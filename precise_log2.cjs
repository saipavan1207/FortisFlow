const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    const t = msg.text();
    if (!t.includes('Curtains') && !t.includes('plane') && !t.includes('Renderer WebGL')) {
      console.log(`[${msg.type().toUpperCase()}] ${t}`);
    }
  });

  page.on('pageerror', error => {
    console.log(`[PAGE ERROR] ${error.message}`);
  });

  await page.goto('http://localhost:5174/goals', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  await browser.close();
})();
