/**
 * Pull the three Google Sheets down from Drive and rebuild the site's data.
 *
 *   npm run sync
 *
 * One command. It fetches products, variants and items straight from Drive,
 * checks every row, and regenerates lib/content/*.data.ts. The CSVs in
 * /content are written too, but only as a snapshot you can diff and commit —
 * the sheets in Drive are the source of truth and this never writes back to
 * them.
 *
 * Setup, once: content/sheets.json holds the three sheet links. Each sheet has
 * to be readable without signing in, or Google returns its login page instead
 * of your data. In each sheet: Share → General access → "Anyone with the link"
 * → Viewer. Nothing else is needed — no API key, no downloads folder.
 *
 * Options:
 *   --dry      fetch and check everything, then stop without writing
 *   --offline  skip Drive and rebuild from the CSVs already in /content
 *
 * Node 18+ (needs global fetch). No dependencies.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, unlinkSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
const OUT = path.join(ROOT, 'lib', 'content');
const BACKUPS = path.join(CONTENT, '.backups');
const KEEP_BACKUPS = 10;

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry');
const OFFLINE = argv.includes('--offline');

const tty = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (n) => (s) => (tty ? `\x1b[${n}m${s}\x1b[0m` : String(s));
const bold = c('1'), dim = c('2'), red = c('31'), green = c('32'), yellow = c('33'), cyan = c('36');

function die(lines) {
  console.error(`\n${red('\u2716')} ${[].concat(lines).join('\n  ')}\n`);
  process.exit(1);
}

/* These must match the unions in lib/types.ts. */
const CATEGORIES = ['signature', 'self-care', 'romance', 'celebration', 'corporate', 'petite'];
const OCCASIONS = [
  'birthday', 'anniversary', 'wedding', 'bridal-shower', 'valentines',
  'eid', 'mothers-day', 'graduation', 'corporate', 'just-because',
];
const RECIPIENTS = ['for-her', 'for-him', 'for-couples', 'for-teams', 'for-new-mums'];
const ITEM_GROUPS = ['Pamper', 'Sweet', 'Keepsake', 'Bloom'];

const problems = [];
const warnings = [];

/* ------------------------------------------------------------------ CSV --- */

/** Minimal RFC-4180 parser: handles quoted fields, embedded commas, newlines and "". */
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;

  const src = text.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (quoted) {
      if (c === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; }
        else quoted = false;
      } else field += c;
    } else if (c === '"') {
      quoted = true;
    } else if (c === ',') {
      row.push(field); field = '';
    } else if (c === '\n') {
      row.push(field); field = '';
      if (row.some((v) => v.trim() !== '')) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((v) => v.trim() !== '')) rows.push(row);

  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim());
  return rows.slice(1).map((cells, i) => {
    const obj = { __line: i + 2 };
    header.forEach((h, j) => { obj[h] = (cells[j] ?? '').trim(); });
    return obj;
  });
}

/** Filled by the fetch step below, keyed by "products.csv" etc. */
const sources = new Map();

function readCsv(name) {
  const text = sources.get(name);
  if (text === undefined) {
    problems.push(`No data for ${name}`);
    return [];
  }
  return parseCsv(text);
}

/* ------------------------------------------------------------- helpers --- */

const list = (v) => (v ? v.split(';').map((s) => s.trim()).filter(Boolean) : []);
const bool = (v) => ['yes', 'y', 'true', '1', 'x'].includes(String(v).trim().toLowerCase());

function num(v, where, field, { required = true } = {}) {
  const raw = String(v ?? '').replace(/[, ]/g, '').trim();
  if (!raw) {
    if (required) problems.push(`${where}: "${field}" is empty`);
    return undefined;
  }
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0) {
    problems.push(`${where}: "${field}" is not a positive number (got "${v}")`);
    return undefined;
  }
  return n;
}

/** "Item name | note" → { name, note } */
function parseIncludes(value) {
  return list(value).map((entry) => {
    const [name, note] = entry.split('|').map((s) => s.trim());
    return note ? { name, note } : { name };
  });
}

/** "photo-123|Alt text" → { id, alt } */
function parseImages(value, where, productName) {
  const out = list(value).map((entry, i) => {
    const [id, alt] = entry.split('|').map((s) => s.trim());
    if (!id) return null;
    if (!alt) {
      warnings.push(`${where}: image ${i + 1} has no alt text — falling back to the basket name`);
    }
    return { id, alt: alt || `${productName} gift basket` };
  }).filter(Boolean);

  if (out.length === 0) problems.push(`${where}: needs at least one image`);
  return out;
}

function checkEnum(values, allowed, where, field) {
  values.forEach((v) => {
    if (!allowed.includes(v)) {
      problems.push(
        `${where}: unknown ${field} "${v}". Allowed: ${allowed.join(', ')}`,
      );
    }
  });
  return values;
}

/* -------------------------------------------------------------- import --- */

function buildProducts() {
  const productRows = readCsv('products.csv');
  const variantRows = readCsv('variants.csv');

  const variantsBySlug = new Map();
  variantRows.forEach((r) => {
    const where = `variants.csv line ${r.__line}`;
    if (!r.productSlug) { problems.push(`${where}: "productSlug" is empty`); return; }
    const price = num(r.price, where, 'price');
    if (price === undefined) return;

    const variant = {
      id: r.id || r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      name: r.name,
      price,
      available: r.available === '' ? true : bool(r.available),
    };
    if (r.note) variant.note = r.note;
    if (r.includes) variant.includes = parseIncludes(r.includes);
    if (bool(r.isDefault)) variant.isDefault = true;

    if (!variant.name) problems.push(`${where}: "name" is empty`);

    if (!variantsBySlug.has(r.productSlug)) variantsBySlug.set(r.productSlug, []);
    variantsBySlug.get(r.productSlug).push(variant);
  });

  const seen = new Set();

  const products = productRows.map((r) => {
    const where = `products.csv line ${r.__line}`;

    if (!r.slug) problems.push(`${where}: "slug" is empty`);
    if (seen.has(r.slug)) problems.push(`${where}: duplicate slug "${r.slug}"`);
    seen.add(r.slug);
    if (r.slug && !/^[a-z0-9-]+$/.test(r.slug)) {
      problems.push(`${where}: slug "${r.slug}" must be lowercase letters, numbers and hyphens only`);
    }
    if (!r.name) problems.push(`${where}: "name" is empty`);

    if (!CATEGORIES.includes(r.category)) {
      problems.push(`${where}: unknown category "${r.category}". Allowed: ${CATEGORIES.join(', ')}`);
    }

    const occasions = checkEnum(list(r.occasions), OCCASIONS, where, 'occasion');
    const recipients = checkEnum(list(r.recipients), RECIPIENTS, where, 'recipient');
    if (occasions.length === 0) {
      warnings.push(`${where}: no occasions — this basket will not appear on any occasion page`);
    }

    const variants = variantsBySlug.get(r.slug) ?? [];
    variantsBySlug.delete(r.slug);

    // With variants, the base price is only a fallback; take the cheapest.
    const basePrice = variants.length
      ? Math.min(...variants.map((v) => v.price))
      : num(r.price, where, 'price');

    if (variants.length && !variants.some((v) => v.isDefault)) {
      warnings.push(`${where}: no variant marked isDefault — the first available one will be preselected`);
    }

    const product = {
      id: `p-${r.slug}`,
      name: r.name,
      slug: r.slug,
      tagline: r.tagline || '',
      description: r.description || '',
      price: basePrice ?? 0,
      images: parseImages(r.images, where, r.name),
      category: r.category,
      occasions,
      recipients,
      tags: list(r.tags),
      includes: parseIncludes(r.includes),
      customizable: r.customizable === '' ? true : bool(r.customizable),
      available: r.available === '' ? true : bool(r.available),
      featured: bool(r.featured),
      leadTimeDays: num(r.leadTimeDays, where, 'leadTimeDays', { required: false }) ?? 2,
    };

    const compare = num(r.compareAtPrice, where, 'compareAtPrice', { required: false });
    if (compare !== undefined) product.compareAtPrice = compare;
    if (variants.length) {
      product.variants = variants;
      product.variantLabel = r.variantLabel || 'Size';
    }
    if (product.includes.length === 0) {
      warnings.push(`${where}: no "includes" — the What's inside list will be empty`);
    }

    return product;
  });

  // Variant rows pointing at a basket that does not exist
  variantsBySlug.forEach((_v, slug) => {
    problems.push(`variants.csv: rows reference productSlug "${slug}", which is not in products.csv`);
  });

  return products;
}

function buildItems() {
  const rows = readCsv('items.csv');
  return rows
    .filter((r) => (r.available === '' ? true : bool(r.available)))
    .map((r) => {
      const where = `items.csv line ${r.__line}`;
      if (!r.name) problems.push(`${where}: "name" is empty`);
      if (!ITEM_GROUPS.includes(r.group)) {
        problems.push(`${where}: unknown group "${r.group}". Allowed: ${ITEM_GROUPS.join(', ')}`);
      }
      if (!r.image) problems.push(`${where}: "image" is empty`);
      return {
        id: r.id || r.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: r.name,
        price: num(r.price, where, 'price') ?? 0,
        group: r.group,
        image: { id: r.image, alt: r.imageAlt || r.name },
      };
    });
}

/* --------------------------------------------------------------- write --- */

const BANNER = `/**
 * GENERATED FILE — DO NOT EDIT BY HAND.
 *
 * Source of truth is the Google Sheet in Drive. To change anything here:
 *   1. edit the sheet
 *   2. run \`npm run sync\`
 *   3. commit this file
 *
 * Hand edits are overwritten on the next sync.
 */`;

function write(file, exportName, typeName, data) {
  const body = `${BANNER}

import type { ${typeName} } from '@/lib/types';

export const ${exportName}: ${typeName}[] = ${JSON.stringify(data, null, 2)};
`;
  writeFileSync(path.join(OUT, file), body);
  return body.length;
}

/* ---------------------------------------------------------------- Drive --- */

const SHEETS = [
  { key: 'products', file: 'products.csv', label: 'Baskets' },
  { key: 'variants', file: 'variants.csv', label: 'Sizes' },
  { key: 'items', file: 'items.csv', label: 'Materials' },
];

/**
 * Accepts whatever someone pastes: a full edit URL, a published-to-web URL, or
 * a bare sheet id. Everything resolves to the CSV export endpoint.
 */
function csvUrl(value, label) {
  const raw = String(value ?? '').trim();
  if (!raw) die(`content/sheets.json has no link for "${label}".`);

  // Already a direct CSV link (published to web, or an explicit export URL).
  if (/output=csv|format=csv/.test(raw)) return raw;

  const fromUrl = raw.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  const id = fromUrl ? fromUrl[1] : (/^[a-zA-Z0-9-_]{20,}$/.test(raw) ? raw : null);
  if (!id) {
    die([
      `Could not read a sheet link for "${label}":`,
      dim(raw),
      '',
      'Paste the whole address bar from the sheet, e.g.',
      dim('https://docs.google.com/spreadsheets/d/1AbC…/edit'),
    ]);
  }

  const gid = raw.match(/[#&?]gid=(\d+)/);
  return `https://docs.google.com/spreadsheets/d/${id}/export?format=csv${gid ? `&gid=${gid[1]}` : ''}`;
}

/** Google answers a private sheet with its sign-in page, status 200. */
function looksLikeLoginPage(text) {
  const head = text.slice(0, 2000).toLowerCase();
  return head.includes('<html') || head.includes('accounts.google.com');
}

async function fetchSheet({ key, file, label }, links) {
  const url = csvUrl(links[key], label);
  let res;
  try {
    res = await fetch(url, { redirect: 'follow' });
  } catch (err) {
    die([
      `Could not reach Google for ${bold(label)}.`,
      dim(err.message),
      '',
      'Check your internet connection, then try again.',
      `To rebuild from the last downloaded copy instead: ${bold('npm run sync -- --offline')}`,
    ]);
  }

  const privateSheet = () => die([
    `${bold(label)} is not readable without signing in, so Google would not hand over the data.`,
    '',
    'Open that sheet and set:',
    `  ${bold('Share')} \u2192 ${bold('General access')} \u2192 ${bold('Anyone with the link')} \u2192 ${bold('Viewer')}`,
    '',
    'Then run this again. Viewer is read-only — nobody who finds the link can edit it.',
    dim(url),
  ]);

  if (res.status === 401 || res.status === 403) privateSheet();
  if (res.status === 404) {
    die([
      `${bold(label)}: no sheet at that link.`,
      'Check content/sheets.json — the link may be from a sheet that was deleted or renamed.',
      dim(url),
    ]);
  }
  if (!res.ok) {
    die([`${bold(label)}: Google answered ${res.status} ${res.statusText}.`, dim(url)]);
  }

  const text = await res.text();
  if (looksLikeLoginPage(text)) privateSheet();
  if (!text.trim()) die([`${bold(label)}: the sheet came back empty.`, dim(url)]);
  return text;
}

/* ---------------------------------------------------------------- main --- */

const configPath = path.join(CONTENT, 'sheets.json');
if (!existsSync(configPath)) {
  die([
    'Missing content/sheets.json — that file holds the links to your three sheets.',
    '',
    'Create it with the address bar of each sheet:',
    dim('{ "products": "https://…", "variants": "https://…", "items": "https://…" }'),
  ]);
}

let links;
try {
  links = JSON.parse(readFileSync(configPath, 'utf8'));
} catch (err) {
  die([`content/sheets.json is not valid JSON.`, dim(err.message)]);
}

console.log(`\n${cyan(OFFLINE ? 'Rebuilding from the last download' : 'Syncing from Google Drive')}\n`);

for (const sheet of SHEETS) {
  if (OFFLINE) {
    const local = path.join(CONTENT, sheet.file);
    if (!existsSync(local)) die([`--offline needs content/${sheet.file}, which is not there yet.`]);
    sources.set(sheet.file, readFileSync(local, 'utf8'));
    console.log(`  ${dim('·')} ${sheet.label.padEnd(10)} ${dim(`content/${sheet.file}`)}`);
    continue;
  }
  const text = await fetchSheet(sheet, links);
  sources.set(sheet.file, text);
  const rows = Math.max(0, text.trim().split('\n').length - 1);
  console.log(`  ${green('✓')} ${sheet.label.padEnd(10)} ${String(rows).padStart(3)} rows`);
}

const products = buildProducts();
const items = buildItems();

if (problems.length) {
  console.error(`\n${red('✖')} Sync stopped. ${problems.length} problem${problems.length === 1 ? '' : 's'} to fix in your sheets:\n`);
  problems.forEach((p) => console.error(`  • ${p}`));
  console.error('\nNothing was written. Fix those rows in Drive and run it again.\n');
  process.exit(1);
}

if (DRY) {
  console.log(`\n${cyan('Dry run')} — ${products.length} baskets and ${items.length} materials check out. Nothing written.\n`);
  process.exit(0);
}

/* Snapshot the CSVs, keeping the previous copy so a bad edit is recoverable. */
mkdirSync(BACKUPS, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
if (!OFFLINE) {
  for (const sheet of SHEETS) {
    const dest = path.join(CONTENT, sheet.file);
    if (existsSync(dest)) copyFileSync(dest, path.join(BACKUPS, `${sheet.file}.${stamp}`));
    writeFileSync(dest, sources.get(sheet.file).replace(/^﻿/, '').replace(/\r\n/g, '\n'), 'utf8');
  }
  const kept = new Map();
  for (const name of readdirSync(BACKUPS).sort().reverse()) {
    const base = name.split('.csv.')[0] + '.csv';
    const n = (kept.get(base) ?? 0) + 1;
    kept.set(base, n);
    if (n > KEEP_BACKUPS) { try { unlinkSync(path.join(BACKUPS, name)); } catch { /* ignore */ } }
  }
}

write('products.data.ts', 'productList', 'Product', products);
write('builder.data.ts', 'builderItemList', 'BuilderItem', items);

const variantCount = products.reduce((n, p) => n + (p.variants?.length ?? 0), 0);
console.log(`\n${green('✓')} ${products.length} baskets · ${variantCount} sizes · ${items.length} materials`);
console.log(dim('  → lib/content/products.data.ts'));
console.log(dim('  → lib/content/builder.data.ts'));
if (!OFFLINE) console.log(dim('  → content/*.csv (snapshot; previous copies in content/.backups/)'));

if (warnings.length) {
  console.log(`\n${yellow('!')} ${warnings.length} thing${warnings.length === 1 ? '' : 's'} worth a look (not blocking):`);
  warnings.forEach((w) => console.log(`  • ${w}`));
}
console.log(`\nRun ${bold('npm run dev')} to see it.\n`);
