// Negotiation Overview tab — the "dashboard inside a negotiation"

const NegotiationOverview = ({ neg, onGotoArticle, onTab }) => {
  const open = neg.articles.filter(a => a.status === "open");
  const tentative = neg.articles.filter(a => a.status === "tentative");
  const ta = neg.articles.filter(a => a.status === "ta");
  const accent = neg.id === "ibew-1430" ? "var(--primary)" : "var(--accent-amber)";

  const nextDate = new Date(neg.nextSession);
  const dateStr = nextDate.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  const timeStr = nextDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div style={{ padding: "24px 32px 64px", maxWidth: 1280, margin: "0 auto" }}>

      {/* Header summary line */}
      <div style={{ display: "flex", gap: 16, marginBottom: 24, alignItems: "stretch" }}>
        <Card padding={20} style={{ flex: 2, background: "linear-gradient(135deg, var(--surface) 0%, var(--surface-2) 100%)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
            <div style={{ flex: 1 }}>
              <Label style={{ marginBottom: 4 }}>Next session — Session {neg.sessions.find(s => s.outcome === "scheduled")?.n}</Label>
              <h2 style={{ margin: "0 0 4px", fontFamily: "var(--font-serif)", fontSize: 24, fontWeight: 500, letterSpacing: "-0.018em", color: "var(--ink)" }}>
                {dateStr}
              </h2>
              <div style={{ fontSize: 14, color: "var(--ink-2)" }}>{timeStr} · {neg.sessionLocation}</div>
              <div style={{ marginTop: 10, fontSize: 13, color: "var(--ink-3)", fontFamily: "var(--font-serif)", fontStyle: "italic" }}>
                {neg.sessions.find(s => s.outcome === "scheduled")?.topic}
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <Btn variant="primary" icon={<I.Video size={13}/>}>Join Teams</Btn>
                <Btn variant="secondary" icon={<I.Doc size={13}/>}>Pre-session brief</Btn>
                <Btn variant="ghost" icon={<I.Mic size={13}/>}>Start caucus</Btn>
              </div>
            </div>
            <div style={{ borderLeft: "1px solid var(--border)", paddingLeft: 24, minWidth: 180 }}>
              <Label style={{ marginBottom: 6 }}>CBA expires in</Label>
              <div style={{ fontSize: 36, fontWeight: 500, fontFamily: "var(--font-serif)", color: accent, letterSpacing: "-0.02em", lineHeight: 1 }}>{neg.daysToExpiry}</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 4 }}>days · {neg.cbaExpires}</div>
              <div style={{ height: 5, background: "var(--bg-2)", borderRadius: 999, marginTop: 12, overflow: "hidden" }}>
                <div style={{ width: Math.max(8, 100 - neg.daysToExpiry / 0.9) + "%", background: accent }}/>
              </div>
            </div>
          </div>
        </Card>

        <Card padding={20} style={{ flex: 1 }}>
          <Label>Bargaining team</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 12 }}>
            {neg.bargainingTeam.map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar {...p} size={26}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: "var(--ink)", lineHeight: 1.2 }}>{p.name}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{p.role}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Article status — the heart */}
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 16, marginBottom: 24 }}>
        <Card padding={0}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Articles awaiting movement</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Sorted by priority</div>
            </div>
            <button onClick={() => onTab("articles")} style={ghostLink2}>Open tracker →</button>
          </div>
          <div>
            {[...tentative, ...open].slice(0, 6).map((a, i, arr) => (
              <ArticleQuickRow key={a.id} article={a} onClick={() => { onTab("articles"); setTimeout(() => onGotoArticle(a.id), 50); }} last={i === arr.length - 1}/>
            ))}
          </div>
        </Card>

        <Card padding={0}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Progress</div>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{ta.length} TA'd · {tentative.length} pending · {open.length} open</div>
          </div>
          <div style={{ padding: "18px" }}>
            <div style={{ display: "flex", height: 10, borderRadius: 4, overflow: "hidden", background: "var(--bg-2)", marginBottom: 16 }}>
              <div style={{ width: `${ta.length / neg.articles.length * 100}%`, background: "var(--signal-green)" }}/>
              <div style={{ width: `${tentative.length / neg.articles.length * 100}%`, background: "var(--accent-amber)" }}/>
            </div>
            <ProgressLegend color="var(--signal-green)" label="Tentatively agreed" count={ta.length}/>
            <ProgressLegend color="var(--accent-amber)" label="Pending (close to TA)" count={tentative.length}/>
            <ProgressLegend color="var(--signal-blue)"  label="Open / exchanged"     count={open.length}/>

            <div style={{ marginTop: 18, paddingTop: 14, borderTop: "1px solid var(--border)" }}>
              <AINote>
                You're moving fastest on non-economic items. Three of four open economic articles are linked — the employer will likely package wages, H&W, and retiree medical. <strong>Consider an economic caucus before Session 8.</strong>
              </AINote>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent moves + sessions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <Card padding={0}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Recent activity</div>
          </div>
          <div>
            {neg.activity.slice(0, 6).map((a, i, arr) => (
              <div key={i} style={{ padding: "10px 18px", borderBottom: i === arr.length - 1 ? "none" : "1px solid var(--border)", display: "flex", gap: 10 }}>
                <ActivityDot kind={a.kind}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: "var(--ink)" }}>{a.text}</div>
                  <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>{a.who} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card padding={0}>
          <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Session history</div>
          </div>
          <div>
            {neg.sessions.map((s, i, arr) => (
              <SessionRow key={s.n} session={s} last={i === arr.length - 1}/>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const ArticleQuickRow = ({ article, onClick, last }) => (
  <div onClick={onClick} style={{
    padding: "11px 18px", display: "flex", gap: 14, alignItems: "center",
    borderBottom: last ? "none" : "1px solid var(--border)",
    cursor: "pointer", transition: "background .1s",
  }}
  onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
    <div style={{
      fontFamily: "var(--font-mono)", fontSize: 11, fontWeight: 500,
      color: "var(--ink-3)", minWidth: 32,
    }}>Art.{article.num}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 500 }}>{article.title}</div>
      <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>
        {article.proposals} proposal{article.proposals !== 1 ? 's' : ''} · last move by {article.lastMove} {article.lastDate !== "—" ? "on " + article.lastDate : ""}
      </div>
    </div>
    <Pill kind={article.topic}/>
    <Pill kind={article.status}/>
    <I.ChevronRight size={14} style={{ color: "var(--ink-4)" }}/>
  </div>
);

const ProgressLegend = ({ color, label, count }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 0", fontSize: 12.5, color: "var(--ink-2)" }}>
    <span style={{ width: 8, height: 8, borderRadius: 2, background: color }}/>
    <span style={{ flex: 1 }}>{label}</span>
    <span style={{ fontVariantNumeric: "tabular-nums", color: "var(--ink-3)" }}>{count}</span>
  </div>
);

const ActivityDot = ({ kind }) => {
  const m = {
    "proposal-recv": "var(--signal-blue)",
    "ai":            "var(--primary)",
    "ta":            "var(--signal-green)",
    "note":          "var(--ink-3)",
    "doc":           "var(--ink-3)",
    "calendar":      "var(--accent-amber)",
  };
  return <span style={{ width: 6, height: 6, borderRadius: "50%", background: m[kind] || "var(--ink-3)", marginTop: 7, flexShrink: 0 }}/>;
};

const SessionRow = ({ session, last }) => {
  const outcomeMap = {
    "ground-rules-signed": { label: "Ground rules", kind: "ta" },
    "exchanged":           { label: "Exchanged",     kind: "low" },
    "partial-ta":          { label: "Partial TA",    kind: "tentative" },
    "ta-reached":          { label: "TAs reached",   kind: "ta" },
    "active":              { label: "Active",        kind: "open" },
    "scheduled":           { label: "Scheduled",     kind: "scheduled" },
  };
  const out = outcomeMap[session.outcome] || { label: session.outcome, kind: "low" };
  return (
    <div style={{ padding: "11px 18px", display: "flex", gap: 14, alignItems: "center", borderBottom: last ? "none" : "1px solid var(--border)" }}>
      <div style={{
        width: 26, height: 26, borderRadius: "50%",
        background: session.outcome === "scheduled" ? "var(--bg-2)" : "var(--primary-soft)",
        color: session.outcome === "scheduled" ? "var(--ink-3)" : "var(--primary-ink)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 600, fontFamily: "var(--font-mono)",
        flexShrink: 0,
      }}>{session.n}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "var(--ink)" }}>{session.topic}</div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 1 }}>{session.date}</div>
      </div>
      <Pill kind={out.kind}>{out.label}</Pill>
    </div>
  );
};

const ghostLink2 = {
  background: "transparent", border: "none", color: "var(--primary)",
  fontSize: 12, fontWeight: 500, cursor: "pointer", padding: "4px 8px", borderRadius: 4,
};

Object.assign(window, { NegotiationOverview });
