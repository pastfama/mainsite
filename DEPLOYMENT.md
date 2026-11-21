# Fameshire GTA6 Roleplay Website - Deployment Guide

## Website Overview

This is a static website for www.fameshire.com announcing GTA6 roleplay servers.
- Features Entra ID (Microsoft Entra) login via MSAL.js 2.x
- Responsive design for all devices
- Three language server announcements: English, Russian, Arabic

---

## Step 1: DNS Configuration (REQUIRED - Critical)

⚠️ **You must configure DNS records before deployment or the site will show SSL warnings!**

### For Azure Static Web Apps, you need to add these records to your DNS provider:

1. **CNAME record** (recommended for Azure Static Web Apps):
   - Name/Host: `www`
   - Type: CNAME
   - Value/Target: `<your-sw-name>.github.io` (or the custom domain Azure assigns)
   - Or use the Azure-provided CNAME target from the SWA "Custom domains" blade

2. **A record for apex domain** (if you want fameshire.com to work):
   - Name/Host: `@` (or just `fameshire.com`)
   - Type: A
   - Points to: Azure Static Web Apps IPs (check Azure docs for latest)

### Azure Custom Domain Setup:

1. Go to **Azure Portal** → **Static Web Apps** → Your SWA resource
2. Under **Settings** → **Custom domains** → **Add**
3. Enter: `www.fameshire.com` and optionally `fameshire.com`
4. Azure will show verification records needed (TXT or CNAME)
5. Add those records to your DNS provider (where you bought fameshire.com)
6. Wait 5-30 minutes for DNS propagation
7. Click **Validate** in Azure, then **Add**
8. Azure automatically provisions a free managed SSL certificate

---

## Step 2: Entra ID App Configuration

The app is already created with these redirect URIs:
- https://www.fameshire.com
- https://fameshire.com
- http://localhost:5000 (development)

### Current App Details (DO NOT SHARE PUBLICLY):
```
App Name: Fameshire-Web-AllSites
Client ID: 7e379545-6460-465e-bf56-2dd57b64afce
Tenant ID: 185b412d-bddc-454b-9987-40628582c63c
```

### Adding More Apps / Subdomains:

If you want different subdomains (app1.fameshire.com, app2.fameshire.com) to use DIFFERENT Entra ID apps:

1. Register new app in **Microsoft Entra ID** → **App registrations**:
   ```bash
   az ad app create \
     --display-name "Fameshire-Subdomain-App" \
     --sign-in-audience AzureADMyOrg \
     --web-redirect-uris "https://app1.fameshire.com"
   ```

2. Add subdomain as custom domain in Azure Static Web Apps

3. Update `js/config.js` to support dynamic client IDs based on subdomain:
   ```javascript
   const clientMaps = {
     "app1.fameshire.com": "NEW_CLIENT_ID_1",
     "app2.fameshire.com": "NEW_CLIENT_ID_2",
     "www.fameshire.com": "7e379545-6460-465e-bf56-2dd57b64afce"
   };
   ```

---

## Step 3: Deploy to Azure Static Web Apps

### Option A: Via Azure CLI (fastest)

```bash
cd c:\Tools\mainsite

# Login if not already
az login

# Create Static Web App (one-time)
az staticwebapp create \
  --name fameshire \
  --resource-group "Fameshire-SWA RG" \
  --source "https://github.com/YOUR_REPO" \
  --branch main \
  --login-with-github

# OR deploy existing files
az staticwebapp create \
  --name fameshire \
  --resource-group "Fameshire-SWA RG" \
  --source . \
  --location westus2
```

### Option B: Via Azure Portal (manual)

1. **Azure Portal** → **Static Web Apps** → **Create**
2. Resource group: `Fameshire-SWA RG` (or your existing RG)
3. Name: `fameshire` (or similar)
4. Source: GitHub, Azure DevOps, or Upload existing files
5. Build preset: **None** (static site, no framework build required)
6. Review + Create
7. After deployment, go to **Custom domains** → **Add**
8. Add `www.fameshire.com` and `fameshire.com`
9. Complete DNS verification

---

## Step 4: Verify HTTPS

After DNS propagation (may take 5-30 minutes):

1. Visit: https://www.fameshire.com
2. Firefox should NOT show SSL warning
3. Click "Sign in with Entra ID" — you should see Microsoft login

---

## Step 5: Test Entra ID Login

1. Open https://www.fameshire.com
2. Click "Sign in with Entra ID" in the navbar
3. Microsoft login page should appear
4. Complete sign-in
5. Navbar should show your name and "Sign out" button

---

## File Structure

```
c:\Tools\mainsite\
├── index.html              # Main landing page
├── css\
│   └── style.css           # All styles
├── js\
│   ├── config.js           # Entra ID configuration
│   ├── auth.js             # MSAL authentication logic
│   └── ui.js               # UI helpers (toasts, waitlist)
└── staticwebapp.config.json # SWA routing, headers, redirects
```

---

## Troubleshooting

### SSL_ERROR_BAD_CERT_DOMAIN
- DNS for custom domain not configured or not propagated
- Wait for DNS records, then add custom domain in Azure Portal

### Login fails, redirect loop
- Ensure redirect URI in Entra ID matches exactly (https://www.fameshire.com)
- Check `postLogoutRedirectUri` in config.js

### "AADSTS500011" error
- The redirect URI is not listed in the app registration
- Add it in Entra ID → App registration → Authentication → SPA redirect URIs

---

## For Future Site Additions

To add a new subdomain (e.g., fameshire-gta6.com or a blog):

1. Create new Entra ID app with subdomain redirect URI
2. Add subdomain as custom domain in SWA
3. Configure DNS CNAME/A records for the subdomain
4. Either create new SWA instance or implement routing logic