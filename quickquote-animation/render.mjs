// Renders index.html frame-by-frame with headless Chromium and pipes to ffmpeg.
// Usage: node render.mjs [out.mp4] [fps]      Stills: node render.mjs --stills 1,5.9,15.5
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || undefined });
const page = await browser.newPage({ viewport: { width: 1080, height: 1080 }, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(path.join(here, 'index.html')).href + '?render=1');
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
const stage = await page.$('#stage');

if (args[0] === '--stills') {
  mkdirSync(path.join(here, 'stills'), { recursive: true });
  for (const t of args[1].split(',').map(Number)) {
    await page.evaluate((t) => window.setTime(t), t);
    await stage.screenshot({ path: path.join(here, 'stills', `t${t.toFixed(2)}.png`) });
  }
  await browser.close();
  process.exit(0);
}

const out = args[0] || path.join(here, 'quickquote.mp4');
const fps = Number(args[1] || 30);
const { duration, sfx } = await page.evaluate(() => ({ duration: window.DURATION, sfx: window.SFX }));
writeFileSync(path.join(here, 'sfx.json'), JSON.stringify({ duration, sfx }, null, 1));

const silent = out.replace(/\.mp4$/, '.silent.mp4');
const ff = spawn(FFMPEG, ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'png', '-i', '-',
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '18', '-preset', 'slow', '-movflags', '+faststart', silent], { stdio: ['pipe', 'inherit', 'inherit'] });
const frames = Math.round(duration * fps);
for (let i = 0; i < frames; i++) {
  await page.evaluate((t) => window.setTime(t), i / fps);
  const buf = await stage.screenshot({ type: 'png' });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
  if (i % fps === 0) process.stdout.write(`\r${(i / fps).toFixed(0)}s / ${duration}s`);
}
ff.stdin.end();
await new Promise((r) => ff.on('close', r));
await browser.close();
console.log(`\nwrote ${silent}`);
