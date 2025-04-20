const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ headless: false, defaultViewport: null });
  const page = await browser.newPage();

  // Set user agent to avoid bot detection
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36'
  );

  // Open LinkedIn login
  await page.goto('https://www.linkedin.com/login');

  console.log('📌 Please log in to LinkedIn manually, then press ENTER here to continue...');
  await new Promise(resolve => process.stdin.once('data', resolve));

  // Go to the people search URL
  await page.goto('https://www.linkedin.com/search/results/people/?geoUrn=%5B%22103644278%22%5D&industry=%5B%221594%22%2C%221862%22%2C%2280%22%5D&keywords=%22lead%20generation%20agency%22&origin=GLOBAL_SEARCH_HEADER&titleFreeText=Founder', {
    waitUntil: 'networkidle2',
  });

  // Scroll to load more profiles
  await page.evaluate(async () => {
    for (let i = 0; i < 5; i++) {
      window.scrollBy(0, window.innerHeight);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
  });

  // Wait for results to appear
  await page.waitForSelector('.reusable-search__result-container', { timeout: 0 });

  // Scrape data
  const profiles = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.reusable-search__result-container'));
    return cards.map(card => {
      const name = card.querySelector('span[aria-hidden="true"]')?.innerText || '';
      const title = card.querySelector('.entity-result__primary-subtitle')?.innerText || '';
      const company = title.includes(' at ') ? title.split(' at ')[1] : '';
      const location = card.querySelector('.entity-result__secondary-subtitle')?.innerText || '';
      const link = card.querySelector('a.app-aware-link')?.href || '';
      return { name, jobTitle: title, company, location, profileUrl: link };
    });
  });

  // Save to file
  fs.writeFileSync('scraped-leads.json', JSON.stringify(profiles, null, 2));
  console.log('✅ Scraping complete. Saved to scraped-leads.json');

  await browser.close();
})();
