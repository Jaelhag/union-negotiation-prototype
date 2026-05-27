// Microsoft sign-in (MSAL) + token acquisition.
//
// Reads the firm's Entra app registration: Union Negotiation System.
// Client ID and tenant ID are baked in below since they're not secrets —
// the public client flow with PKCE relies on the redirect URI registered
// in Entra to verify the request, not on a client secret.
//
// Exposes window.AUTH so plain-script components can call it:
//   AUTH.signIn()          -> opens popup, returns account
//   AUTH.signOut()
//   AUTH.getAccount()      -> currently signed-in account, or null
//   AUTH.getToken()        -> access token for Graph API (cached + auto-refresh)
//   AUTH.onChange(cb)      -> subscribe to sign-in/sign-out events

const MSAL_CONFIG = {
  auth: {
    clientId: "32a1dbcd-4c42-4653-816e-a9ba23c0ad29",
    authority: "https://login.microsoftonline.com/9560ca86-1ab5-495e-81c4-7bcbcf4949fd",
    // Use the current page URL as the redirect target. This matches the SPA
    // redirect URI registered in Entra: https://jaelhag.github.io/union-negotiation-prototype/
    redirectUri: window.location.origin + window.location.pathname,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    // sessionStorage = signed-in only for this browser tab.
    // Switch to "localStorage" if you want sign-in to persist across tabs / restarts.
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      logLevel: 1, // 0=Error, 1=Warning, 2=Info, 3=Verbose
      piiLoggingEnabled: false,
    },
  },
};

// Scopes the app asks for. These match what's granted in Entra:
//   User.Read              -> who am I
//   Sites.FullControl.All  -> read/write any SharePoint site (we'll narrow later)
//   Files.ReadWrite.All    -> upload/download proposal docs
//   Mail.ReadWrite         -> read forwarded emails
//   Calendars.ReadWrite    -> read/write bargaining sessions
//   Group.ReadWrite.All    -> create new negotiation workspaces
const GRAPH_SCOPES = [
  "User.Read",
  "Sites.FullControl.All",
  "Files.ReadWrite.All",
  "Mail.ReadWrite",
  "Calendars.ReadWrite",
  "Group.ReadWrite.All",
];

let _msalInstance = null;
let _initPromise = null;
const _listeners = new Set();

function _getInstance() {
  if (!_msalInstance) {
    if (typeof msal === "undefined") {
      throw new Error("MSAL library not loaded. Check that the <script> tag for msal-browser is present in index.html.");
    }
    _msalInstance = new msal.PublicClientApplication(MSAL_CONFIG);
  }
  return _msalInstance;
}

async function _ensureInitialized() {
  if (!_initPromise) {
    _initPromise = _getInstance().initialize();
  }
  return _initPromise;
}

function _notifyChange() {
  _listeners.forEach(cb => {
    try { cb(); } catch (e) { console.error("auth listener error:", e); }
  });
}

async function signIn() {
  await _ensureInitialized();
  const inst = _getInstance();
  const result = await inst.loginPopup({
    scopes: GRAPH_SCOPES,
    prompt: "select_account", // always show account picker
  });
  inst.setActiveAccount(result.account);
  _notifyChange();
  return result.account;
}

async function signOut() {
  await _ensureInitialized();
  const inst = _getInstance();
  const account = inst.getActiveAccount() || inst.getAllAccounts()[0];
  if (account) {
    await inst.logoutPopup({ account });
  }
  _notifyChange();
}

function getAccount() {
  try {
    const inst = _getInstance();
    return inst.getActiveAccount() || inst.getAllAccounts()[0] || null;
  } catch (e) {
    return null;
  }
}

async function getToken() {
  await _ensureInitialized();
  const inst = _getInstance();
  const account = getAccount();
  if (!account) return null;
  try {
    const result = await inst.acquireTokenSilent({
      account,
      scopes: GRAPH_SCOPES,
    });
    return result.accessToken;
  } catch (silentErr) {
    // Silent failed (e.g. session expired) — fall back to interactive.
    console.warn("Silent token acquisition failed, prompting:", silentErr.message);
    const result = await inst.acquireTokenPopup({ scopes: GRAPH_SCOPES });
    return result.accessToken;
  }
}

function onChange(cb) {
  _listeners.add(cb);
  return () => _listeners.delete(cb);
}

// Rehydrate the active account from cache on first load.
// MSAL stores accounts in sessionStorage, but doesn't auto-set the active one.
(async () => {
  try {
    await _ensureInitialized();
    const inst = _getInstance();
    const accounts = inst.getAllAccounts();
    if (accounts.length > 0 && !inst.getActiveAccount()) {
      inst.setActiveAccount(accounts[0]);
      _notifyChange();
    }
  } catch (e) {
    console.warn("MSAL init failed on page load:", e.message);
  }
})();

window.AUTH = { signIn, signOut, getAccount, getToken, onChange };
