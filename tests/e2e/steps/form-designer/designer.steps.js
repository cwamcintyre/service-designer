const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(5000);

let requests = [];

Given('I am on the {string} page', async (test) => {
    await page.goto(`${process.env.FORM_DESIGNER_URL}/${test}`);
});

Then('I should see the form list', async () => {

    const formList = await page.locator('tr');
    const header = await page.locator('h1');
    expect(await header.textContent()).toBe('Forms');
    await page.waitForTimeout(100);
    expect(await formList.count()).toBeGreaterThan(0);
});