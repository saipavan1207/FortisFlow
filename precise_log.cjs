const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', async msg => {
    if (msg.type() === 'error' && !msg.text().includes('Curtains')) {
      try {
        const args = await Promise.all(msg.args().map(a => a.jsonValue()));
        console.log(`[BROWSER ERROR] ${msg.text()}`, JSON.stringify(args));
      } catch(e) {
        console.log(`[BROWSER ERROR] ${msg.text()}`);
      }
    }
  });

  await page.goto('http://localhost:5174/goals', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await browser.close();
})();
