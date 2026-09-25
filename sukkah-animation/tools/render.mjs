// רינדור "שלומית בונה סוכה" לוידאו עם השיר — רץ על המחשב המקומי, על כל המעבדים ועם כרטיס המסך.
//
// שימוש (מתוך התיקייה sukkah-animation/tools):
//   npm install
//   npx playwright install chromium
//   node render.mjs --song ../song.mp3 --out ../shlomit.mp4
// אפשרויות: --workers N (ברירת מחדל: מספר המעבדים), --scale 1.5 (1 = 720p, 1.5 = 1080p), --from 0 --to 1588 (פריימים)
//
// צריך בתיקייה sukkah-animation: lyrics.js (מילים), fonts/Discovery_Fs-Bold.otf (פונט) — שניהם לא בגיטהאב.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import ffmpegPath from 'ffmpeg-static';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (name, def) => { const i = process.argv.indexOf('--' + name); return i > 0 ? process.argv[i + 1] : def; };
const PAGE = arg('page', 'shlomit-song.html');
const SONG = path.resolve(arg('song', path.join(ROOT, 'song.mp3')));
const OUT = path.resolve(arg('out', path.join(ROOT, 'shlomit.mp4')));
const WORKERS = +arg('workers', Math.max(1, os.cpus().length - 1));
const SCALE = +arg('scale', 1.5);
const FROM = +arg('from', 0), TO = +arg('to', 1588);
const FPS = 8;

for (const f of ['lyrics.js', 'fonts/Discovery_Fs-Bold.otf']) if (!fs.existsSync(path.join(ROOT, f))) console.warn(`אזהרה: חסר ${f} — ימשיך בלעדיו`);
if (!fs.existsSync(SONG)) { console.error(`לא נמצא קובץ השיר: ${SONG}`); process.exit(1); }

// שרת קבצים קטן (הדפדפן צריך http כדי לטעון פונטים ותמונות)
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.otf': 'font/otf', '.ttf': 'font/ttf', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2' };
const server = http.createServer((req, res) => {
  const p = path.join(ROOT, decodeURIComponent(new URL(req.url, 'http://x').pathname));
  if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': TYPES[path.extname(p)] || 'application/octet-stream' }); fs.createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/${PAGE}?frame=0`;

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'shlomit-'));
const t0 = Date.now();
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--ignore-gpu-blocklist', '--enable-gpu-rasterization', '--enable-accelerated-2d-canvas', '--use-angle=default'] });
let done = 0;
const total = TO - FROM, chunk = Math.ceil(total / WORKERS);
console.log(`מרנדר ${total} פריימים ב-${WORKERS} תהליכים במקביל…`);
await Promise.all([...Array(WORKERS)].map(async (_, w) => {
  const a = FROM + w * chunk, b = Math.min(TO, a + chunk);
  if (a >= b) return;
  const page = await browser.newPage({ viewport: { width: 1400, height: 900 }, deviceScaleFactor: SCALE });
  page.on('pageerror', e => console.error('שגיאה בעמוד:', e.message));
  await page.goto(url); await page.waitForFunction(() => window.__ready, null, { timeout: 60000 });
  for (let f = a; f < b; f++) {
    const d = await page.evaluate(f => window.renderFrame(f), f);
    fs.writeFileSync(path.join(tmp, `f${String(f - FROM).padStart(5, '0')}.jpg`), Buffer.from(d.split(',')[1], 'base64'));
    if (++done % 100 === 0) console.log(`  ${done}/${total}  (${((Date.now() - t0) / 1000).toFixed(0)} שנ')`);
  }
  await page.close();
}));
await browser.close(); server.close();
console.log(`הפריימים מוכנים אחרי ${((Date.now() - t0) / 1000).toFixed(0)} שניות. מקודד וידאו עם השיר…`);

const ff = spawn(ffmpegPath, ['-y', '-loglevel', 'error', '-framerate', String(FPS), '-i', path.join(tmp, 'f%05d.jpg'),
  '-ss', String(FROM / FPS), '-i', SONG, '-vf', 'fps=24,format=yuv420p', '-c:v', 'libx264', '-crf', '22', '-preset', 'medium',
  '-tune', 'animation', '-c:a', 'aac', '-b:a', '160k', '-shortest', '-movflags', '+faststart', OUT], { stdio: 'inherit' });
ff.on('close', code => {
  fs.rmSync(tmp, { recursive: true, force: true });
  if (code === 0) console.log(`מוכן: ${OUT}  (סה"כ ${((Date.now() - t0) / 1000).toFixed(0)} שניות)`);
  else console.error('ffmpeg נכשל, קוד', code);
});
