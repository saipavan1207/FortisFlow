const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error' || msg.type() === 'warning') {
      errors.push(`Console: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  page.on('response', resp => {
    if (!resp.ok() && resp.url().includes('supabase')) {
      errors.push(`API Error: ${resp.url()} - ${resp.status()}`);
    }
  });

  // Since it's a SPA, navigate to /goals directly or click it
  await page.goto('http://localhost:5174/goals', { waitUntil: 'networkidle' });
  
  // wait a bit for fetch to fail
  await page.waitForTimeout(2000);

  if (errors.length > 0) {
    console.log("ERRORS FOUND:");
    errors.forEach(e => console.log(e));
  } else {
    console.log("NO ERRORS DETECTED");
  }

  await browser.close();
})();
