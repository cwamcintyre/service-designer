const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(250);

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

When('I click the submit button', async () => {
    await page.click('button[type="submit"]');
});

Then('I should see the error {string}', async (errorText) => {
    const errorMessage = await page.locator('.error-message').innerText();
    expect(errorMessage).toContain(errorText);
});

Then('I should see the summary page which contains {string} for question {string} with name {string}', async (text, questionLabel, questionType) => {
    const summaryLabel = await page.locator(`.govuk-summary-list__row[data-name="${questionType}"] .govuk-summary-list__key`).innerText();
    const summaryText = await page.locator(`.govuk-summary-list__row[data-name="${questionType}"] .govuk-summary-list__value`).innerText();
    expect(summaryLabel).toContain(questionLabel);
    expect(summaryText).toContain(text);
});

Then('I should see the error message {string} for {string}', async (errorMessage, questionName) => {
    const error = await page.locator(`#${questionName}-error`).innerText();
    expect(error).toContain(errorMessage);
});

Then('I should see the form with title {string}', async (formTitle) => {
    const title = await page.locator('h1').innerText();
    expect(title).toBe(formTitle);
});