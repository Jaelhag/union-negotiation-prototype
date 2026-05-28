// Microsoft Graph API helpers.
//
// All calls require the user to be signed in (window.AUTH.getToken() returns
// a valid bearer token). Functions throw if not signed in.
//
// Exposes window.GRAPH so plain-script components can call it.

const GRAPH_BASE = "https://graph.microsoft.com/v1.0";

// The SharePoint host. Hardcoded for elhagassociatespc — adjust when this
// app is reused for a different tenant.
const SP_HOST = "elhagassociatespc.sharepoint.com";

async function graphFetch(path, options = {}) {
  const token = await window.AUTH.getToken();
  if (!token) {
    throw new Error("Not signed in. Click 'Sign in with Microsoft' first.");
  }
  const url = path.startsWith("http") ? path : GRAPH_BASE + path;
  const res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text();
    let parsed;
    try { parsed = JSON.parse(text); } catch (e) {}
    const msg = parsed?.error?.message || text || res.statusText;
    const err = new Error(`Graph ${res.status}: ${msg}`);
    err.status = res.status;
    err.body = parsed || text;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
}

// Convert a site alias (e.g. "nyra-cctv") into Graph's site-id format.
// Graph expects "<hostname>:/sites/<alias>" or a hash GUID id.
function siteRef(alias) {
  return `${SP_HOST}:/sites/${alias}:`;
}

// ─── Site discovery ────────────────────────────────────────────────────────

// Known negotiation workspaces. When you provision a new one, add its alias
// here. Long-term we'd maintain this as a SharePoint master list to avoid
// hardcoding, but for v1 with 1-2 workspaces it's simpler and faster.
const KNOWN_NEGOTIATION_ALIASES = ["nyra-cctv"];

// Load each known site by direct path lookup. Avoids the noisy "search all
// sites in tenant + probe each for an Overview list" approach that flooded
// the console with 404s for non-negotiation sites.
async function listNegotiationSites() {
  const sites = await Promise.all(KNOWN_NEGOTIATION_ALIASES.map(async (alias) => {
    try {
      const site = await graphFetch(`/sites/${SP_HOST}:/sites/${alias}`);
      return site;
    } catch (e) {
      console.warn(`Couldn't load workspace '${alias}':`, e.message);
      return null;
    }
  }));
  return sites.filter(Boolean);
}

// ─── Single negotiation data ───────────────────────────────────────────────

// Read the Overview list (one row) for a given site alias.
// Returns the metadata: client, employer, members, CBA expiry, etc.
async function getOverview(alias) {
  const data = await graphFetch(
    `/sites/${siteRef(alias)}/lists/Overview/items?$expand=fields`
  );
  const item = data.value?.[0];
  return item ? item.fields : null;
}

// Read all articles for a given site alias.
async function getArticles(alias) {
  const data = await graphFetch(
    `/sites/${siteRef(alias)}/lists/Articles/items?$expand=fields&$top=200`
  );
  return (data.value || []).map(item => item.fields);
}

// Read all sessions for a given site alias.
async function getSessions(alias) {
  const data = await graphFetch(
    `/sites/${siteRef(alias)}/lists/Sessions/items?$expand=fields&$top=200`
  );
  return (data.value || []).map(item => item.fields);
}

// Read bargaining team for a given site alias.
async function getBargainingTeam(alias) {
  const data = await graphFetch(
    `/sites/${siteRef(alias)}/lists/BargainingTeam/items?$expand=fields&$top=200`
  );
  return (data.value || []).map(item => item.fields);
}

// ─── Composite: full negotiation object matching the prototype's shape ─────

// Loads everything about one negotiation in parallel, shaped like the
// hardcoded objects in window.DEMO_NEGOTIATIONS so the rest of the app
// doesn't need to know it's real data.
async function loadNegotiation(site) {
  const alias = site.webUrl.split("/sites/")[1].replace(/\/$/, "");
  const [overview, articles, sessions, team] = await Promise.all([
    getOverview(alias),
    getArticles(alias),
    getSessions(alias),
    getBargainingTeam(alias),
  ]);

  if (!overview) return null;

  // Shape it like window.DEMO_NEGOTIATIONS entries
  return {
    id: alias,
    name: overview.Title || site.displayName,
    client: overview.Client || "",
    employer: overview.Employer || "",
    industry: overview.Industry || "",
    members: overview.Members || 0,
    status: "active",
    phase: overview.Phase || "",
    cbaExpires: overview.CBAExpires ? overview.CBAExpires.split("T")[0] : "",
    nextSession: overview.NextSession || "",
    sessionLocation: overview.SessionLocation || "",
    daysToExpiry: overview.CBAExpires
      ? Math.max(0, Math.round((new Date(overview.CBAExpires) - new Date()) / (1000*60*60*24)))
      : 0,
    teamLead: "You",
    summary: overview.Summary || "",
    forwardingAlias: overview.ForwardingAlias || alias,
    siteUrl: site.webUrl,
    articles: articles.map(a => ({
      id: `${alias}-${a.ArticleNum}`,
      num: a.ArticleNum || "",
      title: a.Title || "",
      status: a.ArticleStatus || "open",
      topic: a.Topic || "non-econ",
      priority: a.Priority || "med",
      proposals: a.ProposalCount || 0,
      lastMove: a.LastMove || "-",
      lastDate: a.LastDate ? a.LastDate.split("T")[0] : "-",
      summary: a.Summary || "",
    })),
    sessions: sessions.map(s => ({
      n: s.SessionNum || 0,
      date: s.SessionDate ? s.SessionDate.split("T")[0] : "",
      topic: s.Topic || "",
      outcome: s.Outcome || "scheduled",
    })),
    bargainingTeam: team.filter(p => p.Side === "Our Team").map(p => ({
      name: p.Title || "",
      role: p.RoleTitle || "",
      initials: p.Initials || (p.Title || "").split(" ").map(w=>w[0]).join("").slice(0,2),
      color: "#1F4A47",
    })),
    counterparts: team.filter(p => p.Side === "Counterparts").map(p => ({
      name: p.Title || "",
      role: p.RoleTitle || "",
      initials: p.Initials || (p.Title || "").split(" ").map(w=>w[0]).join("").slice(0,2),
      color: "#8B919A",
    })),
    folders: window.standardFolderTree ? window.standardFolderTree() : [],
    chat: [],
    activity: [],
  };
}

// Load all negotiations in parallel.
async function loadAllNegotiations() {
  const sites = await listNegotiationSites();
  const loaded = await Promise.all(sites.map(s => loadNegotiation(s).catch(e => {
    console.warn("Failed to load site", s.webUrl, e.message);
    return null;
  })));
  return loaded.filter(Boolean);
}

window.GRAPH = {
  graphFetch,
  listNegotiationSites,
  getOverview,
  getArticles,
  getSessions,
  getBargainingTeam,
  loadNegotiation,
  loadAllNegotiations,
};
