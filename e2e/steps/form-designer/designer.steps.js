const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('@playwright/test');
const { setDefaultTimeout } = require('@cucumber/cucumber');

setDefaultTimeout(5000);

let requests = [];

Given('I am on the {string} page', async (test) => {
    // Construct the payload expected by react-oidc-context
    const idToken = auth_token.getIdToken();
    const oidcPayload = {
        id_token: idToken.jwtToken,
        access_token: auth_token.getAccessToken().jwtToken,
        expires_at: idToken.payload.exp,
        scope: 'phone openid email',
        token_type: 'Bearer',
        profile: idToken.payload, // User profile information
    };

    // Store the token in local storage
    const storageKey = `oidc.user:${process.env.AWS_OIDC_AUTHORITY}:${process.env.AWS_OIDC_CLIENT_ID}`;
    global.storageKey = storageKey;
    await page.addInitScript((object) => {
        try {
            sessionStorage.setItem(object.storageKey, JSON.stringify(object.oidcPayload));
        } catch (error) {
            console.error('Error setting sessionStorage:', error);
        }
    }, { storageKey, oidcPayload });

    await page.goto(`${process.env.FORM_DESIGNER_URL}/${test}`);
});

Then('I should see the form list', async () => {

    const formList = await page.locator('tr');
    const header = await page.locator('h1');
    expect(await header.textContent()).toBe('Forms');
    await page.waitForTimeout(100);
    expect(await formList.count()).toBeGreaterThan(0);
});