const puppeteer = require('puppeteer');
const fs = require('fs');
const { MongoClient } = require('mongodb');
const path = require('path');

// Configuration
const uri = 'mongodb://localhost:27017';
const dbName = 'leads';
const MAX_PROFILES = 20;
const SEARCH_TIMEOUT = 120000; // 2 minutes for search page
const RETRY_ATTEMPTS = 3;

// Main function
(async () => {
  let browser;
  let page;
  let client;
  let profiles = [];
  
  try {
    console.log('🚀 Starting LinkedIn scraper...');
    
    // Launch browser with stealth settings
    browser = await puppeteer.launch({ 
      headless: false, 
      defaultViewport: null,
      args: [
        '--window-size=1920,1080',
        '--disable-notifications',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-blink-features=AutomationControlled'
      ]
    });
    
    page = await browser.newPage();
    
    // Make puppeteer more stealthy
    await page.evaluateOnNewDocument(() => {
      // Overwrite the 'navigator.webdriver' property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
      
      // Overwrite navigator properties
      window.navigator.chrome = {
        runtime: {},
      };
      
      // Spoof plugins and mime types
      Object.defineProperty(navigator, 'plugins', {
        get: () => [
          {
            0: {type: "application/pdf", suffixes: "pdf", description: "Portable Document Format"},
            name: "Chrome PDF Plugin", filename: "internal-pdf-viewer",
          },
          {
            0: {type: "application/x-google-chrome-pdf", suffixes: "pdf", description: "Portable Document Format"},
            name: "Chrome PDF Viewer", filename: "mhjfbmdgcfjbbpaeojofohoefgiehjai",
          },
          {
            0: {type: "application/epub+zip", suffixes: "epub", description: "E-book format"},
            name: "Chrome EPUB Viewer", filename: "internal-epub-viewer",
          }
        ],
      });
    });
    
    // Set user agent to latest Chrome version
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
    );
    
    // Disable image loading to improve performance
    await page.setRequestInterception(true);
    page.on('request', (req) => {
      if (req.resourceType() === 'image' || req.resourceType() === 'font') {
        req.abort();
      } else {
        req.continue();
      }
    });
    
    // Human-like delay function
    const delay = async (min = 1500, max = 4000) => {
      const randomDelay = Math.floor(Math.random() * (max - min)) + min;
      await new Promise(resolve => setTimeout(resolve, randomDelay));
    };
    
    // Login to LinkedIn
    console.log('⏳ Navigating to LinkedIn login page...');
    await page.goto('https://www.linkedin.com/login', { 
      waitUntil: 'domcontentloaded', 
      timeout: 60000 
    });
    
    console.log('📌 Please log in to LinkedIn manually, then press ENTER here to continue...');
    await new Promise(resolve => process.stdin.once('data', resolve));
    await delay(3000, 5000);
    
    // Check if we're logged in
    const isLoggedIn = await checkIfLoggedIn(page);
    if (!isLoggedIn) {
      throw new Error('Login verification failed. Please make sure you are logged into LinkedIn properly.');
    }
    
    console.log('✅ Login successful!');
    
    // Navigate to search page with retries
    let searchSuccess = false;
    for (let attempt = 0; attempt < RETRY_ATTEMPTS; attempt++) {
      try {
        console.log(`🔍 Navigating to search results (attempt ${attempt + 1}/${RETRY_ATTEMPTS})...`);
        
        await page.goto('https://www.linkedin.com/search/results/people/?keywords=%22lead%20generation%20agency%22&origin=GLOBAL_SEARCH_HEADER&titleFreeText=Founder', {
          waitUntil: 'domcontentloaded',
          timeout: SEARCH_TIMEOUT
        });
        
        // Check if search results are visible
        await delay(3000, 5000);
        const hasSearchResults = await page.evaluate(() => {
          return document.querySelectorAll('.reusable-search__result-container').length > 0;
        });
        
        if (hasSearchResults) {
          console.log('✅ Search page loaded successfully!');
          searchSuccess = true;
          break;
        } else {
          console.log('⚠️ Search results not found. Retrying...');
        }
      } catch (err) {
        console.error(`❌ Search navigation attempt ${attempt + 1} failed:`, err.message);
        
        // Take screenshot for debugging
        await page.screenshot({ path: `search-error-${attempt + 1}.png` });
        console.log(`📸 Screenshot saved as search-error-${attempt + 1}.png`);
        
        await delay(5000, 10000); // Longer delay between retries
      }
    }
    
    if (!searchSuccess) {
      console.log('⚠️ Could not access search results. Trying to work with the current page...');
    }
    
    // Now start collecting profiles
    console.log('🔍 Collecting profile data...');
    
    // Start the scraping process
    try {
      // Try scrolling to load more content
      await scrollAndCollectProfiles(page, profiles, MAX_PROFILES);
    } catch (err) {
      console.error('❌ Error during profile collection:', err.message);
      await page.screenshot({ path: 'scraping-error.png' });
      console.log('📸 Screenshot saved as scraping-error.png');
    }
    
    console.log(`📊 Collected ${profiles.length} profiles`);
    
    // Save to file (backup)
    if (profiles.length > 0) {
      const timestamp = new Date().toISOString().replace(/:/g, '-');
      const fileName = `linkedin-profiles-${timestamp}.json`;
      fs.writeFileSync(fileName, JSON.stringify(profiles, null, 2));
      console.log(`💾 Saved profiles to ${fileName}`);
    } else {
      console.log('⚠️ No profiles collected to save');
    }
    
    // Connect to MongoDB and store data
    if (profiles.length > 0) {
      try {
        console.log('📦 Connecting to MongoDB...');
        client = new MongoClient(uri);
        await client.connect();
        console.log('✅ Connected to MongoDB');
        
        const db = client.db(dbName);
        const collection = db.collection('leads');
        
        // Add timestamp to all profiles
        profiles.forEach(profile => {
          profile.dateAdded = profile.dateAdded || new Date().toISOString();
        });
        
        // Insert data
        const result = await collection.insertMany(profiles);
        console.log(`📊 Successfully saved ${result.insertedCount} profiles to MongoDB`);
      } catch (mongoErr) {
        console.error('❌ MongoDB Error:', mongoErr.message);
        console.log('⚠️ Failed to save to MongoDB, but data is saved to the JSON file');
      }
    }
    
  } catch (err) {
    console.error('❌ Fatal error:', err.message);
  } finally {
    // Close MongoDB connection
    if (client) {
      try {
        await client.close();
        console.log('✅ MongoDB connection closed');
      } catch (err) {
        console.error('❌ Error closing MongoDB connection:', err.message);
      }
    }
    
    // Always save any collected data before exit
    if (profiles.length > 0 && !fs.existsSync('linkedin-profiles-backup.json')) {
      fs.writeFileSync('linkedin-profiles-backup.json', JSON.stringify(profiles, null, 2));
      console.log('💾 Emergency backup saved to linkedin-profiles-backup.json');
    }
    
    // Close browser
    if (browser) {
      await browser.close();
      console.log('✅ Browser closed');
    }
    
    console.log('✨ Script execution complete');
  }
})();

// Helper functions

async function checkIfLoggedIn(page) {
  try {
    // Check for elements that indicate logged-in state
    return await page.evaluate(() => {
      // Check for common elements that appear when logged in
      const profileIcon = document.querySelector('.global-nav__me-photo') || 
                          document.querySelector('.profile-rail-card__actor-link');
      const feedElement = document.querySelector('.feed-identity-module');
      const navMenu = document.querySelector('.global-nav');
      
      return !!(profileIcon || feedElement || navMenu);
    });
  } catch (err) {
    console.error('Error checking login status:', err.message);
    return false;
  }
}

async function scrollAndCollectProfiles(page, profiles, maxProfiles) {
  let previousHeight;
  let scrollAttempts = 0;
  const maxScrollAttempts = 15;
  
  while (profiles.length < maxProfiles && scrollAttempts < maxScrollAttempts) {
    // Extract profiles from current view
    const newProfiles = await extractProfilesFromPage(page);
    
    // Add unique profiles
    for (const profile of newProfiles) {
      if (profile.profileUrl && !profiles.some(p => p.profileUrl === profile.profileUrl)) {
        profiles.push(profile);
        console.log(`👤 Found profile: ${profile.name} (${profiles.length}/${maxProfiles})`);
        
        // Break if we have enough
        if (profiles.length >= maxProfiles) break;
      }
    }
    
    // Get current scroll height
    previousHeight = await page.evaluate('document.body.scrollHeight');
    
    // Scroll down with random distance
    await page.evaluate(() => {
      const scrollDistance = Math.floor(Math.random() * 800) + 600;
      window.scrollBy(0, scrollDistance);
    });
    
    // Wait for new content to load
    await new Promise(resolve => setTimeout(resolve, Math.random() * 1000 + 1000));
    
    // Check if scroll made progress
    const newHeight = await page.evaluate('document.body.scrollHeight');
    if (newHeight === previousHeight) {
      scrollAttempts++;
      
      // Try clicking "Show more results" if available
      const hasMoreButton = await clickShowMoreResults(page);
      
      if (!hasMoreButton) {
        console.log(`⚠️ No more results to load (attempt ${scrollAttempts}/${maxScrollAttempts})`);
        
        // After a few attempts, try to move to next page
        if (scrollAttempts % 3 === 0) {
          const nextPageSuccess = await goToNextPage(page);
          if (nextPageSuccess) {
            scrollAttempts = 0; // Reset counter since we moved to a new page
            await new Promise(resolve => setTimeout(resolve, 3000));
          }
        }
      }
    } else {
      scrollAttempts = 0; // Reset counter since we made progress
    }
  }
  
  return profiles;
}

async function extractProfilesFromPage(page) {
  try {
    return await page.evaluate(() => {
      const profiles = [];
      const cards = document.querySelectorAll('.reusable-search__result-container');
      
      cards.forEach(card => {
        try {
          // Extract name
          const nameElement = card.querySelector('.entity-result__title-text a span[aria-hidden="true"]');
          const name = nameElement ? nameElement.innerText.trim() : 'Unknown';
          
          // Extract title/position
          const titleElement = card.querySelector('.entity-result__primary-subtitle');
          const titleText = titleElement ? titleElement.innerText.trim() : '';
          
          // Parse title to separate job title and company
          let jobTitle = titleText;
          let company = '';
          
          if (titleText.includes(' at ')) {
            const parts = titleText.split(' at ');
            jobTitle = parts[0].trim();
            company = parts[1].trim();
          }
          
          // Extract location
          const locationElement = card.querySelector('.entity-result__secondary-subtitle');
          const location = locationElement ? locationElement.innerText.trim() : '';
          
          // Extract profile URL
          const linkElement = card.querySelector('.app-aware-link');
          const profileUrl = linkElement ? linkElement.href.split('?')[0] : '';
          
          // Only add if we have at least a name and URL
          if (name !== 'Unknown' && profileUrl) {
            profiles.push({
              name,
              jobTitle,
              company,
              location,
              profileUrl,
              source: 'LinkedIn Search',
              dateAdded: new Date().toISOString()
            });
          }
        } catch (err) {
          // Skip this card if there's an error
          console.error('Error parsing card:', err);
        }
      });
      
      return profiles;
    });
  } catch (err) {
    console.error('Error extracting profiles:', err.message);
    return [];
  }
}

async function clickShowMoreResults(page) {
  try {
    return await page.evaluate(() => {
      const showMoreButton = document.querySelector('.artdeco-button.artdeco-button--muted.artdeco-button--1.artdeco-button--full.artdeco-button--secondary.ember-view');
      if (showMoreButton && showMoreButton.textContent.includes('Show more')) {
        showMoreButton.click();
        return true;
      }
      return false;
    });
  } catch (err) {
    console.error('Error clicking "Show more":', err.message);
    return false;
  }
}

async function goToNextPage(page) {
  try {
    const hasNextPage = await page.evaluate(() => {
      const nextButton = document.querySelector('.artdeco-pagination__button--next:not(.artdeco-button--disabled)');
      if (nextButton) {
        nextButton.click();
        return true;
      }
      return false;
    });
    
    if (hasNextPage) {
      // Wait for navigation
      await new Promise(resolve => setTimeout(resolve, 5000));
      console.log('👉 Navigated to next page of results');
    }
    
    return hasNextPage;
  } catch (err) {
    console.error('Error navigating to next page:', err.message);
    return false;
  }
}
