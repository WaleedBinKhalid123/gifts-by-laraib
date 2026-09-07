import { chromium } from 'playwright';
import { gzipSync } from 'node:zlib';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const path of ['/', '/shop']) {
  const ctx = await b.newContext({ viewport: { width: 1440, height: 900 } });
  const p = await ctx.newPage();
  let gz = 0, files = 0;
  p.on('response', async r => {
    if (r.url().endsWith('.js')) { files++; try { gz += gzipSync(await r.body()).length; } catch {} }
  });
  await p.goto('http://localhost:3111'+path, { waitUntil: 'load' });
  await p.waitForTimeout(1500);
  console.log(`${path}  jsFiles=${files}  gzippedJS=${Math.round(gz/1024)}KB`);
  await ctx.close();
}
await b.close();
