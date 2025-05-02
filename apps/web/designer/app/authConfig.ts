import { type Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: "5b8cb8ab-d197-458a-a97f-e689e69c97f2", // Replace with your Azure AD App's Client ID
    authority: "https://login.microsoftonline.com/5005d2b4-47f7-4911-befe-93b6815688f5", // Replace with your Tenant ID
    redirectUri: "http://localhost:5173", // Replace with your app's redirect URI
    //redirectUri: "https://form-builder.provingtheconcept.org", // Replace with your app's redirect URI
  },
  cache: {
    cacheLocation: "localStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: true, // Set to true if issues arise on IE11 or Edge
  },
};

export const loginRequest = {
  scopes: ["User.Read"], // Add the scopes you need for your app
};
