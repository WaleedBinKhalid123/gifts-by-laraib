/**
 * Download every photo the site references into public/images/.
 *
 *   npm run images
 *
 * Then set USE_LOCAL_IMAGES = true in lib/utils.ts.
 *
 * Why bother: pulling ~30 photos per page from a third-party CDN and re-encoding
 * each one on the fly is the single biggest thing slowing this site down, and it
 * is also why slots can sit empty for a while on a slow connection. Local files
 * are served straight off disk, cached forever by hash, and work offline.
 *
 * Node 18+ (uses global fetch). No dependencies.
 */

import { mkdir, writeFile, readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public', 'images');

/** Largest width any slot uses. One file per photo keeps this simple. */
const WIDTH = 1600;
const QUALITY = 80;
const CONCURRENCY = 5;

async function collectIds() {
  const dirs = [path.join(ROOT, 'lib', 'content'), path.join(ROOT, 'components'), path.join(ROOT, 'app')];
  const ids = new Set();

  async function walk(dir) {
    if (!existsSync(dir)) return;
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
      } else if (/\.(ts|tsx)$/.test(entry.name)) {
        const src = await readFile(full, 'utf8');
        for (const m of src.matchAll(/['"`](photo-[0-9a-zA-Z_-]{10,})['"`]/g)) ids.add(m[1]);
      }
    }
  }

  for (const d of dirs) await walk(d);
  return [...ids];
}

async function download(id) {
  const dest = path.join(OUT, `${id}.jpg`);
  if (existsSync(dest) && (await stat(dest)).size > 1024) return { id, skipped: true };

  const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&fm=jpg&q=${QUALITY}&w=${WIDTH}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'gifts-by-laraib-build' } });
  if (!res.ok) throw new Error(`${id} → HTTP ${res.status}`);

  await writeFile(dest, Buffer.from(await res.arrayBuffer()));
  return { id, bytes: Number(res.headers.get('content-length')) || 0 };
}

async function main() {
  await mkdir(OUT, { recursive: true });
  const ids = await collectIds();
  console.log(`Found ${ids.length} photo ids. Saving to public/images/\n`);

  let done = 0;
  let failed = 0;
  const queue = [...ids];

  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (queue.length) {
        const id = queue.shift();
        try {
          const r = await download(id);
          done += 1;
          process.stdout.write(`  ${String(done).padStart(3)}/${ids.length}  ${r.skipped ? 'have' : 'got '}  ${id}\n`);
        } catch (err) {
          failed += 1;
          process.stdout.write(`  !!  ${err.message}\n`);
        }
      }
    }),
  );

  console.log(`\nDone. ${done} ready, ${failed} failed.`);
  if (failed === 0) {
    console.log('Now set USE_LOCAL_IMAGES = true in lib/utils.ts and restart the dev server.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
