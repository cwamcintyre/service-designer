const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { seedData } = require('./setup/seedData');

require('dotenv').config({ path: './e2e/.env' }); // Load environment variables from .env file

let browser, context, page;

BeforeAll(async () => {
    // This hook runs once before all scenarios
    console.log('Starting the test suite...');
    await seedData();
});

Before(async () => {
    // Launch the browser and create a new context and page before each scenario
    browser = await chromium.launch({ headless: true });
    context = await browser.newContext();
    page = await context.newPage();
    // Attach the page to the global scope for use in steps
    global.page = page;
});

After(async () => {
    // Close the page, context, and browser after each scenario
    await page.close();
    await context.close();
    await browser.close();
});

AfterAll(async () => {
    // This hook runs once after all scenarios
    console.log('Test suite completed.');
});