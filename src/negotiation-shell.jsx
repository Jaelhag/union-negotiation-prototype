// Shell for a single negotiation — header with sub-tabs and routes to module views.

const NegotiationShell = ({ neg, onBack }) => {
  const [tab, setTab] = React.useState("overview");
  const [articleFocus, setArticleFocus] = React.useState(null);

  const accent = neg.id === "ibew-1430" ? "var(--primary)" : "var(--accent-amber)";

  const tabs = [
    { id: "overview",  label: "Overview",   icon: I.Home },
    { id: "articles",  label: "Articles",   icon: I.Scale, badge: neg.articles.filter(a => a.status === "open").length },
    { id: "drafting",  label: "Proposal Review & Drafting", icon: I.Sparkle },
    { id: "communications", label: "Communications", icon: I.Inbox, badge: 1 },
    { id: "files",     label: "Files",      icon: I.Folder },
    { id: "calendar",  label: "Calendar",   icon: I.Calendar },
    { id: "caucus",    label: "Caucus",     icon: I.Lock },
    { id: "economics", label: "Economics",  icon: I.Dollar },
    { id: "chat",      label: "Team chat",  icon: I.Chat },
  ];

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0, background: "var(--bg)" }}>
      {/* Header */}
      <div style={{
        padding: "14px 32px 0", borderBottom: "1px solid var(--border)",
        background: "var(--surface)", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
          <button onClick={onBack} style={crumbBtn}>
            <I.ChevronLeft size={13}/> Dashboard
          </button>
          <span style={{ color: "var(--ink-4)" }}>/</span>
          <span style={{ fontSize: 12, color: "var(--ink-3)" }}>{neg.industry}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 4, height: 36, borderRadius: 4, background: accent }}/>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <h1 style={{ margin: 0, fontSize: 22, fontWeight: 600, letterSpacing: "-0.018em", color: "var(--ink)" }}>{neg.name}</h1>
                <Pill kind="active" dot/>
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>{neg.employer} · {neg.members} members · {neg.phase}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Bargaining team</div>
              <div style={{ marginTop: 4 }}><AvatarStack people={neg.bargainingTeam} size={26} max={5}/></div>
            </div>
            <div style={{ width: 1, height: 36, background: "var(--border)" }}/>
            <Btn variant="ghost" icon={<I.Star size={14}/>}>Pin</Btn>
            <Btn variant="secondary" icon={<I.Users size={14}/>}>Share</Btn>
          </div>
        </div>
        <div style={{ display: "flex", gap: 2, overflow: "auto" }}>
          {tabs.map(t => (
            <TabButton key={t.id} tab={t} active={tab === t.id} onClick={() => { setTab(t.id); if (t.id !== "articles") setArticleFocus(null); }}/>
          ))}
        </div>
      </div>

      {/* Tab content */}
      {tab === "overview"  && <NegotiationOverview neg={neg} onTab={setTab} onGotoArticle={setArticleFocus}/>}
      {tab === "articles"  && <ArticlesView neg={neg} focusId={articleFocus} onSelect={setArticleFocus}/>}
      {tab === "drafting"  && <DraftingView neg={neg}/>}
      {tab === "communications" && <CommunicationsView neg={neg}/>}
      {tab === "files"     && <FilesView neg={neg}/>}
      {tab === "calendar"  && <CalendarView neg={neg}/>}
      {tab === "caucus"    && <CaucusView neg={neg}/>}
      {tab === "economics" && <EconomicsView neg={neg}/>}
      {tab === "chat"      && <ChatView neg={neg}/>}
    </div>
  );
};

const TabButton = ({ tab, active, onClick }) => {
  const Ico = tab.icon;
  return (
    <button onClick={onClick} style={{
      position: "relative",
      display: "flex", alignItems: "center", gap: 7,
      padding: "9px 12px 11px",
      background: "transparent", border: "none",
      color: active ? "var(--ink)" : "var(--ink-3)",
      fontSize: 13, fontWeight: active ? 600 : 500,
      cursor: "pointer",
      letterSpacing: "-0.005em",
    }}>
      <Ico size={14}/>
      {tab.label}
      {tab.badge > 0 && (
        <span style={{
          fontSize: 10.5, fontWeight: 600,
          background: active ? "var(--primary)" : "var(--bg-2)",
          color: active ? "#fff" : "var(--ink-3)",
          padding: "0 5px", borderRadius: 999, minWidth: 16, textAlign: "center",
        }}>{tab.badge}</span>
      )}
      {active && (
        <span style={{
          position: "absolute", left: 8, right: 8, bottom: -1,
          height: 2, background: "var(--primary)",
          borderRadius: 2,
        }}/>
      )}
    </button>
  );
};

const crumbBtn = {
  display: "inline-flex", alignItems: "center", gap: 4,
  background: "transparent", border: "none",
  fontSize: 12, color: "var(--ink-3)", cursor: "pointer",
  padding: "2px 6px", borderRadius: 4,
};

Object.assign(window, { NegotiationShell });
