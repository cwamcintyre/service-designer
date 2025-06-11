const { Given, When, Then, setDefaultTimeout } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { AxeBuilder } = require('@axe-core/playwright');

setDefaultTimeout(5000);

let requests = [];

Given('I start the {string} form', async (test) => {
    await page.goto(`${process.env.FORM_RUNNER_URL}/${test}/start`);
});

When('I enter {string} in the {string} component', async (text, name) => {
    await page.getByTestId(`${name}`).fill(text);
});

When('I select {string} in the {string} component', async (option, name) => {
    await page.getByTestId(`${name}`).selectOption({ label: option });
});

When('I check {string} in the {string} checkbox', async (option, name) => {
    await page.getByTestId(`${name}-${option}`).check();
});

When('I select {string} in the {string} radio group', async (option, name) => {
    await page.getByTestId(`${name}-${option}`).check();
});

When('I enter {string} for day, {string} for month, and {string} for year in the {string} date parts component', async (day, month, year, componentName) => {
    await page.getByTestId(`${componentName}-day`).fill(day);
    await page.getByTestId(`${componentName}-month`).fill(month);
    await page.getByTestId(`${componentName}-year`).fill(year);
});

When('I click the submit button', async () => {
    await page.click('button[type="submit"]');
});

When('I click on the back link', async () => {
    await page.click('.govuk-back-link');
});

When('I click on the back button', async () => {
    await page.goBack();
});

When('I click on the change link for question with name {string}', async (questionName) => {
    await page.locator(`.govuk-summary-list__row[data-name="${questionName}"] .govuk-summary-list__actions a:has-text("Change")`).click();
});

When('I start tracking requests', async () => {
    requests = [];
    page.on('request', (request) => {
        requests.push(request.method());
    });
});

Then('I should see the error {string}', async (errorText) => {
    const errorMessage = await page.locator('.error-message').innerText();
    expect(errorMessage).toContain(errorText);
});

Then('I should see the summary page which contains {string} for question {string} with name {string}', async (text, questionLabel, questionType) => {
    const summaryLabel = await page.locator(`.govuk-summary-list__row[data-name="${questionType}"] .govuk-summary-list__key`).innerHTML();
    const summaryText = await page.locator(`.govuk-summary-list__row[data-name="${questionType}"] .govuk-summary-list__value`).innerHTML();
    expect(summaryLabel).toContain(questionLabel);
    expect(summaryText).toContain(text);
});

Then('I should see the error message {string} for {string}', async (errorMessage, questionName) => {
    const error = await page.locator(`#${questionName}-error`).innerText();
    expect(error).toContain(errorMessage);
});

Then('I should see the error message {string} for {string} at index {string}', async (errorMessage, questionName, index) => {
    const error = await page.locator(`#${questionName}-error-${index}`).innerText();
    expect(error).toContain(errorMessage);
});

Then('I should see the form with title {string}', async (formTitle) => {
    await page.waitForLoadState('networkidle');
    const title = await page.locator('h1').innerText();
    expect(title).toBe(formTitle);
});

Then('I should see the {string} component', async (componentName) => {
    await page.waitForLoadState('networkidle');
    const component = await page.getByTestId(`${componentName}`);
    expect(await component.count()).toBe(1);
});

Then('I should see the yes option of the {string} component', async (componentName) => {
    await page.waitForLoadState('networkidle');
    const component = await page.getByTestId(`${componentName}-yes`);
    expect(await component.count()).toBe(1);
});

Then('There should not be a back link', async () => {
    await page.waitForLoadState('networkidle');
    const backLink = await page.locator('.govuk-back-link');
    expect(await backLink.count()).toBe(0);
});

Then('I should not see POST in the requests', async () => {
    expect(requests).not.toContain('POST');
});

Then('the page should pass accessibility checks', async function () {
    await page.waitForLoadState('networkidle');
    const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
    expect(accessibilityScanResults.violations).toHaveLength(0);
});