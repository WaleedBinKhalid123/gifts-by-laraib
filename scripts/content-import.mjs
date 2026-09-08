/**
 * Turn the spreadsheets in /content into the site's data files.
 *
 *   npm run content:import
 *
 * Reads:   content/products.csv, content/variants.csv, content/items.csv
 * Writes:  lib/content/products.data.ts, lib/content/builder.data.ts
 *
 * The generated files are plain JSON behind a single `export const`, which keeps
 * them readable in a diff and lets content:export read them straight back.
 *
 * Every row is validated before anything is written. A bad category or a
 * misspelled occasion stops the import with a line number, rather than silently
 * producing a basket that never appears in any filter.
 *
 * Node 18+. No dependencies.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
const OUT = path.join(ROOT, 'lib', 'content');

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

function readCsv(name) {
  const file = path.join(CONTENT, name);
  if (!existsSync(file)) {
    problems.push(`Missing file: content/${name}`);
    return [];
  }
  return parseCsv(readFileSync(file, 'utf8'));
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
 * Source of truth is the spreadsheet in /content. To change anything here:
 *   1. edit the CSV
 *   2. run \`npm run content:import\`
 *   3. commit both the CSV and this file
 *
 * Hand edits are overwritten on the next import.
 */`;

function write(file, exportName, typeName, data) {
  const body = `${BANNER}

import type { ${typeName} } from '@/lib/types';

export const ${exportName}: ${typeName}[] = ${JSON.stringify(data, null, 2)};
`;
  writeFileSync(path.join(OUT, file), body);
  return body.length;
}

/* ---------------------------------------------------------------- main --- */

const products = buildProducts();
const items = buildItems();

if (problems.length) {
  console.error(`\n✖ Import stopped. ${problems.length} problem${problems.length === 1 ? '' : 's'} to fix:\n`);
  problems.forEach((p) => console.error(`  • ${p}`));
  console.error('\nNothing was written. Fix the rows above and run the import again.\n');
  process.exit(1);
}

write('products.data.ts', 'productList', 'Product', products);
write('builder.data.ts', 'builderItemList', 'BuilderItem', items);

console.log(`\n✓ Imported ${products.length} baskets and ${items.length} materials.`);
console.log(`  ${products.reduce((n, p) => n + (p.variants?.length ?? 0), 0)} variants across all baskets.`);
console.log('  → lib/content/products.data.ts');
console.log('  → lib/content/builder.data.ts');

if (warnings.length) {
  console.log(`\n  ${warnings.length} thing${warnings.length === 1 ? '' : 's'} worth a look (not blocking):`);
  warnings.forEach((w) => console.log(`  • ${w}`));
}
console.log('\nRun `npm run build` to see it on the site.\n');
