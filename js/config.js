// =========================================
// Fameshire — Entra ID (Microsoft Identity Platform) Config
// =========================================
// IMPORTANT: Replace these values with your own Entra ID app registration details.
// 1. Go to https://portal.azure.com -> Microsoft Entra ID -> App registrations
// 2. Register a new app (Single-page application / SPA platform)
// 3. Add Redirect URI: https://www.fameshire.com (or your local dev URL)
// 4. Copy Application (client) ID and Directory (tenant) ID below.

const msalConfig = {
  auth: {
    clientId: "7e379545-6460-465e-bf56-2dd57b64afce",
    authority: "https://login.microsoftonline.com/185b412d-bddc-454b-9987-40628582c63c",
    redirectUri: "https://www.fameshire.com", // Must match an SPA redirect URI in Entra ID
    postLogoutRedirectUri: "https://www.fameshire.com",
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
};

// Scopes: openid + profile for basic sign-in; add Microsoft Graph scopes as needed.
const loginRequest = {
  scopes: ["openid", "profile", "User.Read"],
};
