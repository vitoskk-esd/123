const { chromium } = require('playwright');
(async () => { const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1080, height: 1350 }, deviceScaleFactor: 2 });
  await p.goto('file://' + process.argv[2]); await p.waitForFunction(() => window.READY, null, { timeout: 20000 }); await p.waitForTimeout(300);
  await p.screenshot({ path: process.argv[3], type: 'jpeg', quality: 93 }); await b.close(); })();
