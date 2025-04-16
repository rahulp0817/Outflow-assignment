const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://www.linkedin.com/login');

  console.log('Please log in to LinkedIn manually then press ENTER...');
  await new Promise(resolve => process.stdin.once('data', resolve));

  await page.goto('https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&industry=%5B%221594%22%2C%221862%22%2C%2280%22%5D&keywords=%22lead%20generation%20agency%22&origin=GLOBAL_SEARCH_HEADER&titleFreeText=Founder');
  await page.waitForTimeout(5000);

  const profiles = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.reusable-search__result-container'));
    return cards.map(card => {
      const name = card.querySelector('span[aria-hidden="true"]')?.innerText;
      const title = card.querySelector('.entity-result__primary-subtitle')?.innerText;
      const company = title?.split(' at ')[1] || '';
      const location = card.querySelector('.entity-result__secondary-subtitle')?.innerText;
      const link = card.querySelector('a.app-aware-link')?.href;
      return { name, jobTitle: title, company, location, profileUrl: link };
    });
  });

  fs.writeFileSync('scraped-leads.json', JSON.stringify(profiles, null, 2));
  console.log('✅ Scraping complete. Saved to scraped-leads.json');

  await browser.close();
})();