// node render.js <mode: stills|video> <vertical 0|1> <out> [qrUrl]
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const QRCode = require('qrcode');

(async () => {
  const [mode, vert, out, qr] = process.argv.slice(2);
  const V = vert === '1';
  const W = V ? 1080 : 1920, H = V ? 1920 : 1080, FPS = 30;
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  if (qr) {
    const svg = await QRCode.toString(qr, { type: 'svg', margin: 0, color: { dark: '#0d0f12', light: '#ffffff' } });
    await page.addInitScript((s) => { window.QR_SVG = s; }, svg);
  }
  const url = 'file://' + path.resolve(__dirname, process.env.PAGE || 'promo.html') + `?v=${V ? 1 : 0}` + (process.env.Q || '') + (qr ? `&qr=${encodeURIComponent(qr)}` : '');
  await page.goto(url);
  await page.waitForFunction(() => window.READY === true);
  const dur = await page.evaluate(() => window.DURATION);

  if (mode === 'stills') {
    const times = process.argv.slice(6).map(Number);
    for (const t of times) {
      await page.evaluate((t) => renderAt(t), t);
      await page.screenshot({ path: `${out}-${t}.png` });
    }
  } else {
    const ff = spawn('ffmpeg', ['-y', '-f', 'image2pipe', '-framerate', String(FPS), '-i', '-',
      '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'ignore', 'inherit'] });
    const n = Math.round(dur * FPS);
    for (let i = 0; i < n; i++) {
      await page.evaluate((t) => renderAt(t), i / FPS);
      const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
      if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r));
    }
    ff.stdin.end();
    await new Promise((r) => ff.on('close', r));
  }
  console.log('duration', dur);
  await browser.close();
})();
