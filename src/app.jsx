// Main app — routing, tweaks wiring, app shell

const { useState, useEffect, useRef } = React;

function App() {
  const [t, setTweak] = useTweaks(window.__TWEAKS__);
  const [route, setRoute] = useState("dashboard"); // dashboard, inbox, calendar, files, contacts, negotiation:<id>
  const [showNew, setShowNew] = useState(false);
  const [negotiations, setNegotiations] = useState(window.DEMO_NEGOTIATIONS);

  // Apply tweaks to body
  useEffect(() => {
    document.body.setAttribute("data-density", t.density || "comfortable");
    document.body.setAttribute("data-theme", t.theme || "light");
    if (t.accent) document.documentElement.style.setProperty("--primary", t.accent);
  }, [t.density, t.theme, t.accent]);

  const openNeg = (id) => setRoute("negotiation:" + id);
  const handleNav = (r) => setRoute(r);

  const openNegId = route.startsWith("negotiation:") ? route.split(":")[1] : null;
  const openNegObj = openNegId ? negotiations.find(n => n.id === openNegId) : null;

  const handleCreate = (form) => {
    // Spawn a synthetic new negotiation
    const id = "new-" + Date.now();
    const newNeg = {
      ...window.DEMO_NEGOTIATIONS[0],
      id,
      name: form.name,
      client: form.client,
      employer: form.employer,
      members: parseInt(form.memberCount) || 100,
      industry: form.industry,
      phase: "Just created",
      cbaExpires: form.cbaExpires || "2027-12-31",
      nextSession: form.firstSession ? form.firstSession + "T10:00:00" : "2026-06-15T10:00:00",
      daysToExpiry: 365,
      sessions: [{ n: 1, date: form.firstSession || "2026-06-15", topic: "Opening session — ground rules", outcome: "scheduled" }],
      articles: [],
      bargainingTeam: [{ name: "You", role: "Lead Negotiator", initials: "YO", color: "#1F4A47" }],
      activity: [],
      chat: [],
    };
    setNegotiations(n => [...n, newNeg]);
    setShowNew(false);
    setRoute("negotiation:" + id);
  };

  const navLayout = t.navLayout || "rail";

  return (
    <div style={{
      width: "100%", height: "100%",
      display: "flex", flexDirection: navLayout === "top" ? "column" : "row",
      overflow: "hidden",
    }}>
      <PrimaryRail
        active={route.startsWith("negotiation:") ? null : route}
        onNav={handleNav}
        layout={navLayout}
        negotiations={negotiations}
        openNeg={openNegId}
        onNew={() => setShowNew(true)}
        density={t.density}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, height: "100%" }}>
        {route === "dashboard" && (
          <Dashboard
            negotiations={negotiations}
            archive={window.ARCHIVE_NEGOTIATIONS}
            onOpenNegotiation={openNeg}
            onNew={() => setShowNew(true)}
          />
        )}
        {route === "inbox" && <SimpleEmpty title="Inbox" body="Cross-matter feed of proposals received, AI summaries, and TAs. Coming up — open any negotiation for now."/>}
        {route === "calendar" && <SimpleEmpty title="Calendar" body="Cross-matter calendar view. Open a specific negotiation's Calendar tab to see scheduled sessions."/>}
        {route === "files" && <SimpleEmpty title="All Files" body="Cross-matter file search. Open a specific negotiation to browse its workspace."/>}
        {route === "contacts" && <SimpleEmpty title="Contacts" body="Counterparties, mediators, witnesses, expert consultants. Linked across matters."/>}
        {openNegObj && (
          <NegotiationShell
            key={openNegObj.id}
            neg={openNegObj}
            onBack={() => setRoute("dashboard")}
          />
        )}
      </div>

      {showNew && <NewNegotiationModal onClose={() => setShowNew(false)} onCreate={handleCreate}/>}

      <TweaksUI t={t} setTweak={setTweak}/>
    </div>
  );
}

const SimpleEmpty = ({ title, body }) => (
  <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
    <div style={{ textAlign: "center", maxWidth: 380 }}>
      <h2 style={{ fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 500, letterSpacing: "-0.02em", margin: "0 0 8px" }}>{title}</h2>
      <div style={{ fontSize: 14, color: "var(--ink-3)", lineHeight: 1.55 }}>{body}</div>
    </div>
  </div>
);

const TweaksUI = ({ t, setTweak }) => (
  <TweaksPanel title="Tweaks">
    <TweakSection label="Layout">
      <TweakRadio
        label="Navigation"
        value={t.navLayout || "rail"}
        onChange={(v) => setTweak("navLayout", v)}
        options={[
          { value: "rail", label: "Side rail" },
          { value: "top",  label: "Top bar"  },
        ]}
      />
      <TweakRadio
        label="Density"
        value={t.density || "comfortable"}
        onChange={(v) => setTweak("density", v)}
        options={[
          { value: "comfortable", label: "Comfortable" },
          { value: "dense",       label: "Dense" },
        ]}
      />
    </TweakSection>

    <TweakSection label="Theme">
      <TweakRadio
        label="Mode"
        value={t.theme || "light"}
        onChange={(v) => setTweak("theme", v)}
        options={[
          { value: "light", label: "Light" },
          { value: "ink",   label: "Ink (dark)" },
        ]}
      />
      <TweakColor
        label="Accent"
        value={t.accent || "#1F4A47"}
        onChange={(v) => setTweak("accent", v)}
        options={[
          "#1F4A47",   // slate teal (default)
          "#2C5AA0",   // legal blue
          "#7A3F8F",   // judicial purple
          "#B47A1A",   // brass
          "#161A1D",   // ink
        ]}
      />
    </TweakSection>
  </TweaksPanel>
);

ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
