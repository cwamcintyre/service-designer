const { Before, After, BeforeAll, AfterAll } = require('@cucumber/cucumber');
const { chromium } = require('playwright');
const { seedData } = require('../../setup/seedData');
const { CognitoUserPool, CognitoUser, AuthenticationDetails } = require('amazon-cognito-identity-js');

require('dotenv').config({ path: './e2e/.env' }); // Load environment variables from .env file

let browser, context, page, auth_token;

const poolData = {
  UserPoolId: process.env.AWS_OIDC_USER_POOL_ID,
  ClientId: process.env.AWS_OIDC_CLIENT_ID,
};

const userPool = new CognitoUserPool(poolData);
const userData = {
  Username: process.env.AWS_OIDC_USER_ID,
  Pool: userPool,
};

const authDetails = new AuthenticationDetails({
  Username: process.env.AWS_OIDC_USER_ID,
  Password: process.env.AWS_OIDC_PASSWORD,
});

async function fetchToken() {
  const cognitoUser = new CognitoUser(userData);
  return new Promise((resolve, reject) => {
    cognitoUser.authenticateUser(authDetails, {
      onSuccess: (result) => {
        resolve(result);
      },
      onFailure: (error) => {
        console.error('Error fetching token:', error);
        reject(error);
      },
    });
  });
};

BeforeAll(async () => {

    // This hook runs once before all scenarios
    console.log('Starting the test suite...');
    await seedData();

    try {

      auth_token = await fetchToken();

      global.auth_token = auth_token; // Store the token globally for use in other steps

      // Store the token for use in your tests
    } catch (error) {
      console.error('Error fetching token:', error);
    }
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