import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  const errors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      errors.push(`[CONSOLE ERROR] ${msg.text()}`);
    }
  });
  
  page.on('pageerror', err => {
    errors.push(`[PAGE ERROR] ${err.toString()}`);
  });

  try {
    await page.goto('http://localhost:5173/', { waitUntil: 'networkidle2', timeout: 10000 });
    // Wait a bit just in case it takes a moment to crash
    await new Promise(r => setTimeout(r, 2000));
  } catch (err) {
    errors.push(`[NAVIGATION ERROR] ${err.message}`);
  }

  if (errors.length > 0) {
    console.log("ERRORS FOUND:");
    console.log(errors.join('\n'));
  } else {
    console.log("No console errors found.");
  }
  
  await browser.close();
})();
