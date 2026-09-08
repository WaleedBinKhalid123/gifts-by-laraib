/**
 * Regenerate the spreadsheets in /content from the site's current data.
 *
 *   npm run content:export
 *
 * Useful when someone has edited the generated data files directly, or when you
 * want a fresh sheet after adding baskets in code. The generated data files are
 * plain JSON behind one `export const`, so this is a parse, not a TypeScript
 * compile.
 *
 * The CSV is the source of truth day to day — this is the escape hatch.
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

function readData(file, exportName) {
  const full = path.join(ROOT, 'lib', 'content', file);
  if (!existsSync(full)) {
    console.error(`Missing ${file}. Run \`npm run content:import\` first.`);
    process.exit(1);
  }
  const src = readFileSync(full, 'utf8');
  const start = src.indexOf('= ', src.indexOf(exportName));
  const json = src.slice(start + 2).replace(/;\s*$/, '').trim();
  try {
    return JSON.parse(json);
  } catch {
    console.error(`Could not parse ${file}. It should be plain JSON after the "=".`);
    process.exit(1);
  }
}

/** Quote a CSV cell only when it needs it. */
const cell = (v) => {
  const s = v === undefined || v === null ? '' : String(v);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
const row = (values) => values.map(cell).join(',');
const includesToCsv = (arr) =>
  (arr ?? []).map((i) => (i.note ? `${i.name} | ${i.note}` : i.name)).join(';');

const products = readData('products.data.ts', 'productList');
const items = readData('builder.data.ts', 'builderItemList');

const productLines = [
  row(['slug', 'name', 'tagline', 'description', 'category', 'price', 'compareAtPrice',
       'occasions', 'recipients', 'tags', 'images', 'includes', 'leadTimeDays',
       'available', 'featured', 'customizable', 'variantLabel']),
  ...products.map((p) => row([
    p.slug, p.name, p.tagline, p.description, p.category,
    // With variants the base price is derived from the cheapest one, so leave the
    // column blank rather than writing back a number nobody typed.
    p.variants?.length ? '' : p.price,
    p.compareAtPrice ?? '',
    (p.occasions ?? []).join(';'), (p.recipients ?? []).join(';'), (p.tags ?? []).join(';'),
    (p.images ?? []).map((i) => `${i.id}|${i.alt}`).join(';'),
    includesToCsv(p.includes), p.leadTimeDays,
    p.available ? 'yes' : 'no', p.featured ? 'yes' : 'no', p.customizable ? 'yes' : 'no',
    p.variantLabel ?? '',
  ])),
];

const variantLines = [
  row(['productSlug', 'id', 'name', 'price', 'note', 'includes', 'available', 'isDefault']),
  ...products.flatMap((p) =>
    (p.variants ?? []).map((v) => row([
      p.slug, v.id, v.name, v.price, v.note ?? '', includesToCsv(v.includes),
      v.available ? 'yes' : 'no', v.isDefault ? 'yes' : 'no',
    ])),
  ),
];

const itemLines = [
  row(['id', 'name', 'group', 'price', 'image', 'imageAlt', 'available']),
  ...items.map((i) => row([i.id, i.name, i.group, i.price, i.image.id, i.image.alt, 'yes'])),
];

writeFileSync(path.join(ROOT, 'content', 'products.csv'), productLines.join('\n') + '\n');
writeFileSync(path.join(ROOT, 'content', 'variants.csv'), variantLines.join('\n') + '\n');
writeFileSync(path.join(ROOT, 'content', 'items.csv'), itemLines.join('\n') + '\n');

console.log(`\n✓ Exported ${products.length} baskets, ${variantLines.length - 1} variants, ${items.length} materials to /content.\n`);
