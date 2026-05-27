// Primary navigation rail. Two layouts: 'rail' (icon-only narrow rail + secondary list) or 'top'.

const PrimaryRail = ({ active, onNav, layout, negotiations, openNeg, onNew, density }) => {
  const compact = layout === "rail";

  if (layout === "top") {
    // Top bar variant
    return (
      <div style={{
        height: 52, borderBottom: "1px solid var(--border)",
        background: "var(--surface)", display: "flex", alignItems: "center",
        padding: "0 18px", gap: 18, flexShrink: 0,
      }}>
        <Brand compact={false}/>
        <div style={{ width: 1, height: 22, background: "var(--border)" }} />
        <nav style={{ display: "flex", gap: 4 }}>
          {NAV_ITEMS.map(item => (
            <TopNavItem key={item.id} item={item} active={active === item.id} onClick={() => onNav(item.id)} />
          ))}
        </nav>
        <div style={{ flex: 1 }} />
        <GlobalSearch />
        <Btn variant="primary" icon={<I.Plus size={14}/>} onClick={onNew}>New negotiation</Btn>
        <button style={iconBtn} title="Notifications"><I.Bell size={16}/></button>
        <Avatar name="You" initials="YO" color="#1F4A47" size={28} />
      </div>
    );
  }

  return (
    <div style={{
      width: 240, flexShrink: 0,
      borderRight: "1px solid var(--border)",
      background: "var(--surface-2)",
      display: "flex", flexDirection: "column",
      height: "100%",
    }}>
      <div style={{ padding: "14px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <Brand compact={false} />
      </div>

      <div style={{ padding: "0 12px 12px" }}>
        <GlobalSearch compact />
      </div>

      <div style={{ padding: "0 12px 8px" }}>
        <Btn variant="primary" icon={<I.Plus size={14}/>} onClick={onNew}
          style={{ width: "100%", justifyContent: "center" }}>
          New negotiation
        </Btn>
      </div>

      <nav style={{ padding: "8px 8px 4px" }}>
        {NAV_ITEMS.map(item => (
          <SideNavItem key={item.id} item={item} active={active === item.id} onClick={() => onNav(item.id)} />
        ))}
      </nav>

      <div style={{ padding: "14px 16px 6px" }}>
        <Label>Active negotiations</Label>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "0 8px 16px" }}>
        {negotiations.map(n => {
          const isOpen = openNeg === n.id;
          return (
            <button key={n.id} onClick={() => onNav('negotiation:' + n.id)}
              style={{
                width: "100%", textAlign: "left",
                background: isOpen ? "var(--surface)" : "transparent",
                border: isOpen ? "1px solid var(--border)" : "1px solid transparent",
                borderRadius: 7,
                padding: "9px 10px", marginBottom: 2,
                display: "flex", flexDirection: "column", gap: 4,
                cursor: "pointer",
                transition: "background .1s, border-color .1s",
              }}
              onMouseEnter={(e) => { if (!isOpen) e.currentTarget.style.background = "var(--bg-2)"; }}
              onMouseLeave={(e) => { if (!isOpen) e.currentTarget.style.background = "transparent"; }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{
                  width: 8, height: 8, borderRadius: 2, flexShrink: 0,
                  background: n.id === "ibew-1430" ? "var(--primary)" : "var(--accent-amber)",
                }}/>
                <span style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", lineHeight: 1.25 }}>{n.name}</span>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", paddingLeft: 16 }}>
                {n.daysToExpiry}d to expiry · {n.articles.filter(a => a.status === 'open').length} open
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ padding: 12, borderTop: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
        <Avatar name="You" initials="YO" color="#1F4A47" size={28} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)" }}>Lead Negotiator</div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>your.workspace</div>
        </div>
        <button style={iconBtn} title="Settings"><I.Settings size={16}/></button>
      </div>
    </div>
  );
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard",    icon: I.Home },
  { id: "inbox",     label: "Inbox",        icon: I.Inbox, badge: 4 },
  { id: "calendar",  label: "Calendar",     icon: I.Calendar },
  { id: "files",     label: "All Files",    icon: I.Folder },
  { id: "contacts",  label: "Contacts",     icon: I.Users },
];

const SideNavItem = ({ item, active, onClick }) => {
  const Ico = item.icon;
  return (
    <button onClick={onClick} style={{
      width: "100%", display: "flex", alignItems: "center", gap: 10,
      padding: "7px 10px",
      background: active ? "var(--primary-soft)" : "transparent",
      color: active ? "var(--primary-ink)" : "var(--ink-2)",
      border: "none", borderRadius: 6,
      fontSize: 13, fontWeight: active ? 600 : 500,
      letterSpacing: "-0.005em",
      cursor: "pointer", marginBottom: 1,
      transition: "background .1s",
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--bg-2)"; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
      <Ico size={15} />
      <span>{item.label}</span>
      {item.badge && <span style={{
        marginLeft: "auto", background: "var(--signal-red)", color: "#fff",
        fontSize: 10, fontWeight: 600, padding: "0 5px", borderRadius: 999, minWidth: 16, textAlign: "center",
      }}>{item.badge}</span>}
    </button>
  );
};

const TopNavItem = ({ item, active, onClick }) => {
  const Ico = item.icon;
  return (
    <button onClick={onClick} style={{
      display: "flex", alignItems: "center", gap: 6,
      padding: "6px 10px",
      background: active ? "var(--primary-soft)" : "transparent",
      color: active ? "var(--primary-ink)" : "var(--ink-2)",
      border: "none", borderRadius: 6, fontSize: 13.5, fontWeight: 500,
      cursor: "pointer",
    }}>
      <Ico size={15}/>{item.label}
    </button>
  );
};

const Brand = ({ compact }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
    <div style={{
      width: 24, height: 24, borderRadius: 6,
      background: "var(--primary)", color: "#fff",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      position: "relative",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M12 3v18M5 7h14M5 7l-3 7a4 4 0 0 0 6 0L5 7zM19 7l-3 7a4 4 0 0 0 6 0l-3-7z"/>
      </svg>
    </div>
    {!compact && (
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: "-0.015em", color: "var(--ink)" }}>Bargain</div>
        <div style={{ fontSize: 9.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.1em" }}>Negotiation OS</div>
      </div>
    )}
  </div>
);

const GlobalSearch = ({ compact }) => (
  <div style={{
    position: "relative",
    width: compact ? "100%" : 280,
  }}>
    <I.Search size={13} style={{ position: "absolute", left: 9, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}/>
    <input placeholder="Search proposals, files, threads…" style={{
      width: "100%", height: 30, padding: "0 10px 0 28px",
      background: "var(--surface)",
      border: "1px solid var(--border)", borderRadius: 6,
      fontSize: 12.5, color: "var(--ink)",
      outline: "none",
    }} onFocus={(e) => e.target.style.borderColor = "var(--primary)"} onBlur={(e) => e.target.style.borderColor = "var(--border)"} />
    <span style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", fontSize: 10.5, color: "var(--ink-4)", fontFamily: "var(--font-mono)", background: "var(--bg-2)", padding: "2px 5px", borderRadius: 3 }}>⌘K</span>
  </div>
);

const iconBtn = {
  width: 30, height: 30, borderRadius: 6,
  background: "transparent", border: "none",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  color: "var(--ink-3)", cursor: "pointer",
};

Object.assign(window, { PrimaryRail });
