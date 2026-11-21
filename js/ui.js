// =========================================
// Fameshire — UI Helpers
// =========================================

function showToast(message, type = "success") {
  const toast = document.getElementById("authToast");
  const msgEl = document.getElementById("authToastMsg");
  if (!toast || !msgEl) return;
  msgEl.textContent = message;
  toast.classList.remove("hidden");
  if (type === "error") {
    toast.style.borderColor = "var(--danger)";
  } else {
    toast.style.borderColor = "var(--success)";
  }
  setTimeout(() => {
    toast.classList.add("hidden");
  }, 5000);
}

function closeToast() {
  const toast = document.getElementById("authToast");
  if (toast) toast.classList.add("hidden");
}

function joinServer(lang) {
  const labels = {
    en: "English (NA / EU)",
    ru: "Русский (RU / CIS)",
    ar: "العربية (MENA)",
  };
  const serverName = labels[lang] || lang;
  if (!currentAccount) {
    showToast("Please sign in with Entra ID to join the " + serverName + " server waitlist.", "error");
    handleLogin();
    return;
  }
  showToast("You have been added to the " + serverName + " server waitlist! We'll notify you at launch.", "success");
}

function notifyMe() {
  const emailInput = document.getElementById("contactEmail");
  const email = emailInput ? emailInput.value : "";
  if (!email) {
    showToast("Please enter your email address.", "error");
    return;
  }
  if (!currentAccount) {
    showToast("Please sign in with Entra ID to receive launch notifications.", "error");
    handleLogin();
    return;
  }
  showToast("Thanks! You'll be notified when Fameshire GTA6 roleplay servers go live.", "success");
}

// Set current year in footer
document.addEventListener("DOMContentLoaded", () => {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});