Solution structure

This is using Turborepo to manage shared dependencies and make it easier to run scripts against all parts of the solution (test, run dev, e2e tests, etc).

|
|
|
|
|
|
|
|
|

Running the solution locally

You will need a local install of DynamoDB (if using the AWS infra layer) and be logged in with AWS CLI aws sso login --profile <your profile> 

or Azure CosmosDB emulator (you'll have to dig about the .env files and change the IoC containers in the API layer)

(in either case you will have to check the API .env files as its unlikely we have the same AWS_PROFILE set up!)

If this is the first time, start at the root of the repository, run  

```
npm install
npx playwright install
```

Then from the root of the repository, run

```
npm run dev
```

(this will run all projects necessary)

Testing

Cucumber e2e tests

If you are using VS Code - ensure to set up the cucumber extension fully or autocomplete won't work, and the feature files will say the steps are undefined.

Add the following to your settings.json (CTRL+Shift+P - Preferences: Open Settings (JSON))

    "cucumber.glue": [
        "tests/e2e/features/**/*",
        "tests/e2e/steps/**/*.js"
    ],
    "cucumber.features": [        
        "src/test/**/*.feature",
        "features/**/*.feature",
        "tests/**/*.feature",
        "*specs*/**/*.feature"
    ]