// =========================================
// Fameshire — Entra ID Authentication (MSAL.js 2.x)
// =========================================
let msalInstance = null;
let currentAccount = null;

async function initMsal() {
  try {
    msalInstance = new msal.ClientApplication(msalConfig);

    // Handle redirect callback from Entra ID
    const response = await msalInstance.handleRedirectPromise();
    if (response) {
      currentAccount = response.account || msalInstance.getActiveAccount();
      updateAuthUI(currentAccount);
      showToast("Signed in successfully with Entra ID.", "success");
    } else {
      currentAccount = msalInstance.getActiveAccount();
      updateAuthUI(currentAccount);
    }
  } catch (err) {
    console.error("MSAL initialization error:", err);
    showToast("Authentication setup failed. See console for details.", "error");
  }
}

async function handleLogin() {
  if (!msalInstance) {
    showToast("Auth library still loading. Please try again.", "error");
    return;
  }
  try {
    await msalInstance.loginPopup(loginRequest);
    currentAccount = msalInstance.getActiveAccount();
    updateAuthUI(currentAccount);
    showToast("Welcome back, " + (currentAccount && currentAccount.username ? currentAccount.username : "user") + "!", "success");
  } catch (err) {
    console.error("Login error:", err);
    showToast("Sign-in failed. Please try again.", "error");
  }
}

async function handleLogout() {
  if (!msalInstance) return;
  try {
    await msalInstance.logoutPopup({
      postLogoutRedirectUri: msalConfig.auth.postLogoutRedirectUri,
    });
    currentAccount = null;
    updateAuthUI(null);
    showToast("You have been signed out.", "success");
  } catch (err) {
    console.error("Logout error:", err);
    showToast("Sign-out failed.", "error");
  }
}

function handleProfile() {
  if (!currentAccount) return;
  const name = currentAccount.name || currentAccount.username || "User";
  showToast("Signed in as: " + name, "success");
}

function updateAuthUI(account) {
  const loginBtn = document.getElementById("loginBtn");
  const profileBtn = document.getElementById("profileBtn");
  const logoutBtn = document.getElementById("logoutBtn");
  const userNameEl = document.getElementById("userName");

  if (account) {
    // Signed in
    if (loginBtn) loginBtn.classList.add("hidden");
    if (profileBtn) {
      profileBtn.classList.remove("hidden");
      if (userNameEl) userNameEl.textContent = account.name || account.username || "User";
    }
    if (logoutBtn) logoutBtn.classList.remove("hidden");
  } else {
    // Signed out
    if (loginBtn) loginBtn.classList.remove("hidden");
    if (profileBtn) profileBtn.classList.add("hidden");
    if (logoutBtn) logoutBtn.classList.add("hidden");
  }
}

// Initialize on load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMsal);
} else {
  initMsal();
}