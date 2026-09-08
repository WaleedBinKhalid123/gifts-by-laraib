/**
 * Bring the spreadsheets down from wherever you just downloaded them, then
 * import them.
 *
 *   npm run content:pull
 *
 * The step people miss: editing the Google Sheet changes a copy in Drive, not
 * the file on this computer. `content:import` only ever reads
 * content/products.csv here — so a price changed in Drive stays invisible until
 * the downloaded file is actually put in place. This does that part.
 *
 * What it does:
 *   1. Looks in Downloads (then Desktop, then this folder) for exported CSVs.
 *   2. Works out which sheet each one is from its header row, not its filename —
 *      so "products - Sheet1 (2).csv" is recognised fine.
 *   3. Shows you exactly what would change, row by row, old value → new value.
 *   4. Backs up the current file, puts the new one in place, and runs the import.
 *
 * Options:
 *   --dry            show the changes and stop, write nothing
 *   --no-import      put the files in place but don't run content:import
 *   --dir <path>     look in this folder instead of Downloads/Desktop
 *   <file.csv> ...   use these exact files, skip searching altogether
 *
 * Node 18+. No dependencies.
 */

import {
  readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync, copyFileSync, unlinkSync,
} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CONTENT = path.join(ROOT, 'content');
const BACKUPS = path.join(CONTENT, '.backups');
const KEEP_BACKUPS = 10;

/* --------------------------------------------------------------- colour --- */

const tty = process.stdout.isTTY && !process.env.NO_COLOR;
const c = (code) => (s) => (tty ? `\x1b[${code}m${s}\x1b[0m` : String(s));
const bold = c('1'), dim = c('2'), red = c('31'), green = c('32'), yellow = c('33'), cyan = c('36');

/* ------------------------------------------------------------------ CSV --- */

/** Same minimal RFC-4180 parser content-import uses. Rows stay as arrays here. */
function parseCsv(text) {
  const rows = [];
  let row = [], field = '', quoted = false;
  const src = text.replace(/^﻿/, '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (quoted) {
      if (ch === '"') {
        if (src[i + 1] === '"') { field += '"'; i++; } else quoted = false;
      } else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',') { row.push(field); field = ''; }
    else if (ch === '\n') {
      row.push(field); field = '';
      if (row.some((v) => v.trim() !== '')) rows.push(row);
      row = [];
    } else field += ch;
  }
  row.push(field);
  if (row.some((v) => v.trim() !== '')) rows.push(row);
  return rows;
}

const cell = (v) => {
  const s = v === undefined || v === null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const toCsv = (rows) => rows.map((r) => r.map(cell).join(',')).join('\n') + '\n';

/* ------------------------------------------------------- the three sheets --- */

/**
 * A sheet is identified by columns it must have and nobody else does, so the
 * filename can be anything Google decided to call it.
 */
const SHEETS = [
  {
    file: 'products.csv',
    label: 'Baskets',
    key: 'slug',
    marks: ['slug', 'category', 'includes'],
    columns: ['slug', 'name', 'tagline', 'description', 'category', 'price', 'compareAtPrice',
      'occasions', 'recipients', 'tags', 'images', 'includes', 'leadTimeDays',
      'available', 'featured', 'customizable', 'variantLabel'],
  },
  {
    file: 'variants.csv',
    label: 'Sizes',
    key: ['productSlug', 'id'],
    marks: ['productSlug', 'isDefault'],
    columns: ['productSlug', 'id', 'name', 'price', 'note', 'includes', 'available', 'isDefault'],
  },
  {
    file: 'items.csv',
    label: 'Materials',
    key: 'id',
    marks: ['group', 'imageAlt'],
    columns: ['id', 'name', 'group', 'price', 'image', 'imageAlt', 'available'],
  },
];

const identify = (header) => {
  const have = new Set(header.map((h) => h.trim()));
  return SHEETS.find((s) => s.marks.every((m) => have.has(m)));
};

/* ------------------------------------------------------------ arguments --- */

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const DRY = flag('--dry');
const NO_IMPORT = flag('--no-import');

let searchDir = null;
const dirAt = argv.indexOf('--dir');
if (dirAt !== -1) {
  searchDir = argv[dirAt + 1];
  if (!searchDir) fail('--dir needs a folder after it.');
}
const explicit = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--dir');

function fail(msg) {
  console.error(`\n${red('✖')} ${msg}\n`);
  process.exit(1);
}

/* -------------------------------------------------------------- find CSVs --- */

function candidateDirs() {
  if (searchDir) return [path.resolve(searchDir)];
  const home = os.homedir();
  return [
    process.env.CONTENT_PULL_DIR,
    path.join(home, 'Downloads'),
    path.join(home, 'Desktop'),
    process.cwd(),
  ].filter(Boolean).filter((d) => existsSync(d));
}

/** Every readable .csv in the search folders, newest first. */
function findCsvFiles() {
  if (explicit.length) {
    return explicit.map((f) => {
      const full = path.resolve(f);
      if (!existsSync(full)) fail(`No such file: ${f}`);
      return { full, mtime: statSync(full).mtimeMs };
    });
  }
  const seen = new Set();
  const out = [];
  for (const dir of candidateDirs()) {
    let names;
    try { names = readdirSync(dir); } catch { continue; }
    for (const name of names) {
      if (!name.toLowerCase().endsWith('.csv')) continue;
      const full = path.join(dir, name);
      if (seen.has(full)) continue;
      let st;
      try { st = statSync(full); } catch { continue; }
      if (!st.isFile() || st.size === 0) continue;
      seen.add(full);
      out.push({ full, mtime: st.mtimeMs });
    }
  }
  return out.sort((a, b) => b.mtime - a.mtime);
}

const age = (ms) => {
  const mins = Math.round((Date.now() - ms) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} days ago`;
};

/* ------------------------------------------------------------- comparing --- */

const keyOf = (sheet, header, cells) => {
  const at = (name) => (cells[header.indexOf(name)] ?? '').trim();
  return Array.isArray(sheet.key) ? sheet.key.map(at).join(' / ') : at(sheet.key);
};

const clip = (s, n = 58) => {
  const one = String(s).replace(/\s+/g, ' ').trim();
  return one.length > n ? `${one.slice(0, n - 1)}…` : one || dim('(empty)');
};

/** Row-by-row diff between the file on disk and the downloaded one. */
function diff(sheet, current, incoming) {
  const [curHead, ...curRows] = current.length ? current : [sheet.columns];
  const [incHead, ...incRows] = incoming;

  const index = (head, rows) => {
    const m = new Map();
    for (const r of rows) m.set(keyOf(sheet, head, r), r);
    return m;
  };
  const before = index(curHead, curRows);
  const after = index(incHead, incRows);

  const added = [...after.keys()].filter((k) => !before.has(k));
  const removed = [...before.keys()].filter((k) => !after.has(k));
  const changed = [];

  for (const [key, incRow] of after) {
    const curRow = before.get(key);
    if (!curRow) continue;
    const fields = [];
    for (const col of incHead) {
      const was = (curRow[curHead.indexOf(col)] ?? '').trim();
      const now = (incRow[incHead.indexOf(col)] ?? '').trim();
      if (was !== now) fields.push({ col, was, now });
    }
    if (fields.length) changed.push({ key, fields });
  }
  return { added, removed, changed, headerChanged: curHead.join() !== incHead.join() };
}

function report(sheet, d) {
  const parts = [];
  if (d.added.length) parts.push(green(`+${d.added.length} new`));
  if (d.removed.length) parts.push(red(`−${d.removed.length} removed`));
  if (d.changed.length) parts.push(yellow(`${d.changed.length} edited`));
  console.log(`  ${bold(sheet.label.padEnd(10))} ${parts.length ? parts.join('  ') : dim('no change')}`);

  for (const k of d.added) console.log(`    ${green('+')} ${k}`);
  for (const k of d.removed) console.log(`    ${red('−')} ${k}  ${dim('(will disappear from the site)')}`);
  for (const { key, fields } of d.changed) {
    console.log(`    ${yellow('~')} ${bold(key)}`);
    for (const f of fields) {
      console.log(`        ${f.col}: ${red(clip(f.was))} ${dim('→')} ${green(clip(f.now))}`);
    }
  }
}

/* ------------------------------------------------------------------ main --- */

console.log(`\n${cyan('Pulling spreadsheets')} ${dim(explicit.length ? 'from the files you named' : `from ${candidateDirs().map((d) => path.basename(d)).join(', ')}`)}\n`);

const files = findCsvFiles();
if (!files.length) {
  fail([
    'No CSV files found to pull.',
    '',
    'In Google Sheets: File → Download → Comma-separated values (.csv),',
    'then run this again. Or point at the file directly:',
    '',
    '    npm run content:pull -- path/to/products.csv',
  ].join('\n  '));
}

/* Newest file wins per sheet — a re-download supersedes an older one. */
const picked = new Map();
const unrecognised = [];

for (const f of files) {
  let rows;
  try { rows = parseCsv(readFileSync(f.full, 'utf8')); } catch { continue; }
  if (!rows.length) continue;
  const sheet = identify(rows[0]);
  if (!sheet) { unrecognised.push(f); continue; }
  if (picked.has(sheet.file)) continue;
  picked.set(sheet.file, { sheet, rows, ...f });
}

if (!picked.size) {
  const names = unrecognised.slice(0, 6).map((f) => `    ${path.basename(f.full)}`).join('\n');
  fail([
    'Found CSV files, but none of them look like the basket sheets.',
    '',
    'A products export needs the columns slug, category and includes;',
    'variants needs productSlug and isDefault; items needs group and imageAlt.',
    'Make sure you downloaded the sheet itself, not a filtered view.',
    unrecognised.length ? `\n  Files looked at:\n${names}` : '',
  ].join('\n  '));
}

/* Check the columns are the ones we expect before comparing anything. */
for (const { sheet, rows, full } of picked.values()) {
  const header = rows[0].map((h) => h.trim());
  const missing = sheet.columns.filter((col) => !header.includes(col));
  const extra = header.filter((col) => col && !sheet.columns.includes(col));
  if (missing.length) {
    fail([
      `${path.basename(full)} is missing ${missing.length === 1 ? 'a column' : 'columns'}: ${bold(missing.join(', '))}`,
      '',
      'Nothing has been changed. Add the column back in the sheet — the header',
      'row has to match exactly, or the import cannot read it.',
    ].join('\n  '));
  }
  if (extra.length) {
    console.log(`  ${yellow('!')} ${path.basename(full)} has extra columns: ${extra.join(', ')} ${dim('— they will be ignored')}`);
  }
}

/* Show what would change. */
const plan = [];
for (const { sheet, rows, full, mtime } of picked.values()) {
  const dest = path.join(CONTENT, sheet.file);
  const current = existsSync(dest) ? parseCsv(readFileSync(dest, 'utf8')) : [];
  const d = diff(sheet, current, rows);
  const identical = !d.added.length && !d.removed.length && !d.changed.length && !d.headerChanged;

  console.log(`${dim('  ' + path.basename(full))} ${dim(`· downloaded ${age(mtime)}`)}`);
  report(sheet, d);
  if (!identical && existsSync(dest) && mtime < statSync(dest).mtimeMs) {
    console.log(`    ${yellow('!')} this download is older than the file already in content/ — is it the right one?`);
  }
  console.log('');

  if (!identical) plan.push({ sheet, rows, dest, full });
}

if (!plan.length) {
  console.log(`${green('✓')} Everything already matches. Nothing to do.\n`);
  console.log(dim('  If you expected a change here, the download is probably from before you edited the sheet.\n'));
  process.exit(0);
}

if (DRY) {
  console.log(`${cyan('Dry run')} — nothing written. Run without ${bold('--dry')} to apply.\n`);
  process.exit(0);
}

/* Back up, then write. */
mkdirSync(BACKUPS, { recursive: true });
const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);

for (const { sheet, rows, dest, full } of plan) {
  if (existsSync(dest)) copyFileSync(dest, path.join(BACKUPS, `${sheet.file}.${stamp}`));
  writeFileSync(dest, toCsv(rows), 'utf8');
  console.log(`  ${green('✓')} content/${sheet.file} ${dim('←')} ${path.basename(full)}`);
}

/* Keep the backup folder from growing forever. */
const olds = readdirSync(BACKUPS).sort().reverse();
const perFile = new Map();
for (const name of olds) {
  const base = name.split('.csv.')[0] + '.csv';
  const seen = (perFile.get(base) ?? 0) + 1;
  perFile.set(base, seen);
  if (seen > KEEP_BACKUPS) {
    try { unlinkSync(path.join(BACKUPS, name)); } catch { /* best effort */ }
  }
}

console.log(dim(`\n  Previous versions kept in content/.backups/ (last ${KEEP_BACKUPS} of each).`));

if (NO_IMPORT) {
  console.log(`\n${cyan('Files are in place.')} Run ${bold('npm run content:import')} when ready.\n`);
  process.exit(0);
}

console.log(`\n${cyan('Importing…')}`);
const res = spawnSync(process.execPath, [path.join(ROOT, 'scripts', 'content-import.mjs')], {
  stdio: 'inherit',
  cwd: ROOT,
});
process.exit(res.status ?? 1);
