const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`Console Error: ${msg.text()}`);
    }
  });

  page.on('pageerror', error => {
    errors.push(`Page Error: ${error.message}`);
  });

  await page.goto('http://localhost:5174/', { waitUntil: 'networkidle' });
  
  if (errors.length > 0) {
    console.log("ERRORS FOUND:");
    errors.forEach(e => console.log(e));
  } else {
    console.log("NO ERRORS DETECTED IN CONSOLE.");
  }

  await browser.close();
})();
