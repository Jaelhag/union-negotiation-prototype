// Communications tab — email forwarding inbox + file upload + threaded comms log.
// Built on top of Outlook sync, with a unique forward-to address and AI auto-routing.

const FORWARD_ADDR = (negId) => `ibew1430-${negId.slice(0, 6)}@inbox.bargain.app`;

function seedCommunications(neg) {
  return [
    {
      id: "t-1", kind: "email-thread",
      subject: "RE: Article 18 — Wage counter clarification",
      participants: [
        { name: "H. Calderon", role: "VP Labor Relations", side: "employer" },
        { name: "You", role: "Lead Negotiator", side: "union" },
      ],
      messageCount: 4,
      lastAt: "2026-05-26T08:42:00",
      direction: "incoming",
      source: "outlook-sync",
      article: "Article 18 — Wages",
      articleNum: "18",
      attachments: [{ name: "Employer Wage Counter 8.5pct.docx", type: "docx" }],
      aiSummary: "Calderon confirms the 4-year duration is firm. Signing bonus negotiable. Asks if Union has a counter ready for Session 8.",
      unread: true,
      preview: "Jordan — confirming receipt of your H&W cap language. To your question on Article 18, we are firm on the four-year duration but the signing bonus number is open…",
    },
    {
      id: "t-2", kind: "email-thread",
      subject: "Session 8 logistics — parking + AV",
      participants: [
        { name: "S. Carmichael", role: "ConEd Admin", side: "employer" },
        { name: "M. Rivera", role: "Business Mgr", side: "union" },
      ],
      messageCount: 6,
      lastAt: "2026-05-25T16:20:00",
      direction: "incoming",
      source: "outlook-sync",
      article: "Logistics",
      articleNum: "—",
      attachments: [],
      aiSummary: "Session 8 confirmed for June 2 at 10am, Local Hall. Parking validated. AV testing 9:30am.",
      unread: false,
      preview: "All set for Tuesday. We have the front conference room booked from 9 to 5…",
    },
    {
      id: "t-3", kind: "email-thread",
      subject: "FWD: Member concerns re. retiree medical closure",
      participants: [
        { name: "K. Nguyen", role: "Steward", side: "union" },
        { name: "You", role: "Lead Negotiator", side: "union" },
      ],
      messageCount: 1,
      lastAt: "2026-05-25T11:08:00",
      direction: "forwarded",
      source: "forward",
      article: "Article 21 — Retiree Medical",
      articleNum: "21",
      attachments: [],
      aiSummary: "Floor steward forwarded 14 member messages opposing any closure of retiree medical to new hires. Strong sentiment — quotes attached.",
      unread: false,
      preview: "Jordan, forwarding the messages I've gotten this week. The membership is firm — this is the dealbreaker line…",
      forwardedBy: "K. Nguyen",
    },
    {
      id: "t-4", kind: "email-thread",
      subject: "BLS Q1 2026 release — NY electrical comps",
      participants: [
        { name: "BLS Notification", role: "Bureau of Labor Statistics", side: "external" },
        { name: "P. O'Brien", role: "Analyst", side: "union" },
      ],
      messageCount: 1,
      lastAt: "2026-05-22T09:00:00",
      direction: "incoming",
      source: "outlook-sync",
      article: "Article 18 — Wages",
      articleNum: "18",
      attachments: [{ name: "NY-Electrical-Q1-2026.xlsx", type: "xlsx" }],
      aiSummary: "Q1 2026 BLS release confirms 3.8% YoY growth for NY electrical occupations. Slightly above what's in the Union opener.",
      unread: false,
      preview: "Quarterly release attached. Filed in Knowledge base / wage comps.",
    },
    {
      id: "t-5", kind: "email-thread",
      subject: "RE: Subcontracting first-refusal language — clean v2",
      participants: [
        { name: "R. Mendelsohn", role: "Outside Counsel (employer)", side: "employer" },
        { name: "You", role: "Lead Negotiator", side: "union" },
      ],
      messageCount: 8,
      lastAt: "2026-05-21T15:45:00",
      direction: "outgoing",
      source: "outlook-sync",
      article: "Article 27 — Subcontracting",
      articleNum: "27",
      attachments: [{ name: "Subcontracting Clean v2.docx", type: "docx" }],
      aiSummary: "Final exchange before Session 7 TA. Employer counsel accepted 30-day notice; we accepted 14-day for emergency work. Near TA.",
      unread: false,
      preview: "Thanks Ron — accepting your edit on §3(b). Sending clean v2 attached for sign-off…",
    },
    {
      id: "t-6", kind: "uploaded-file",
      subject: "Peer CBA — IBEW Local 41 (2024)",
      participants: [
        { name: "You", role: "Lead Negotiator", side: "union" },
      ],
      messageCount: 0,
      lastAt: "2026-05-19T14:30:00",
      direction: "upload",
      source: "upload",
      article: "Article 18 — Wages",
      articleNum: "18",
      attachments: [{ name: "IBEW-Local-41-CBA-2024.pdf", type: "pdf" }],
      aiSummary: "Peer reference. Local 41 2024 settlement: 14% over 3yr, full retiree med preserved, $1,000 signing bonus. Strong comparable for Article 18 and 21.",
      unread: false,
      preview: "Uploaded by Jordan. Auto-filed to Knowledge base / Peer locals.",
    },
    {
      id: "t-7", kind: "email-thread",
      subject: "Caucus prep — Tuesday economic counter",
      participants: [
        { name: "D. Foster", role: "E-Board Rep", side: "union" },
        { name: "M. Rivera", role: "Business Mgr", side: "union" },
        { name: "You", role: "Lead Negotiator", side: "union" },
      ],
      messageCount: 12,
      lastAt: "2026-05-24T20:18:00",
      direction: "internal",
      source: "outlook-sync",
      article: "Cross-article",
      articleNum: "—",
      attachments: [],
      aiSummary: "Internal team alignment for Session 8. Agreed on 12.5%/3yr position, retiree med hard line, $750 bonus as walk-away floor.",
      unread: false,
      preview: "OK team, my proposed approach for Tuesday. Comments welcome but please by EOD Sunday…",
      internal: true,
    },
  ];
}

const CommunicationsView = ({ neg }) => {
  const [filter, setFilter] = useS("all"); // all, unread, employer, internal, attachments
  const [articleFilter, setArticleFilter] = useS("all");
  const [search, setSearch] = useS("");
  const [activeId, setActiveId] = useS(null);

  const comms = seedCommunications(neg);
  const articles = [...new Set(comms.map(c => c.articleNum))].sort();

  const filtered = comms.filter(c => {
    if (filter === "unread"      && !c.unread) return false;
    if (filter === "employer"    && !c.participants.some(p => p.side === "employer")) return false;
    if (filter === "internal"    && !c.internal) return false;
    if (filter === "attachments" && c.attachments.length === 0) return false;
    if (filter === "forwarded"   && c.source !== "forward") return false;
    if (articleFilter !== "all" && c.articleNum !== articleFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = (c.subject + " " + c.preview + " " + c.aiSummary + " " + c.participants.map(p => p.name).join(" ")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  }).sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt));

  const active = comms.find(c => c.id === activeId);

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0, minWidth: 0 }}>
      {/* Main list pane */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "var(--bg)" }}>
        <div style={{ padding: "24px 32px 0", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 16 }}>
            <div>
              <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 500, letterSpacing: "-0.018em", color: "var(--ink)" }}>Communications</h1>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 3 }}>
                Email threads, forwarded messages, and uploaded files — all auto-routed to the right article.
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Btn variant="secondary" icon={<I.Upload size={13}/>}>Upload file</Btn>
              <Btn variant="secondary" icon={<I.Inbox size={13}/>}>Outlook sync</Btn>
              <Btn variant="primary" icon={<I.Plus size={13}/>}>Compose</Btn>
            </div>
          </div>

          {/* Forward-to address banner */}
          <div style={{ marginBottom: 16 }}>
            <ForwardAddressCard neg={neg}/>
          </div>

          {/* Filters */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingBottom: 12, flexWrap: "wrap" }}>
            <div style={{ position: "relative", width: 280 }}>
              <I.Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}/>
              <input
                placeholder="Search subject, participants, summary…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", height: 30, padding: "0 10px 0 28px",
                  background: "var(--surface-2)", border: "1px solid var(--border)",
                  borderRadius: 6, fontSize: 12.5, color: "var(--ink)", outline: "none",
                }}/>
            </div>
            <div style={{ display: "flex", gap: 4 }}>
              <FilterPill active={filter === "all"}         onClick={() => setFilter("all")}>All <span style={chipN}>{comms.length}</span></FilterPill>
              <FilterPill active={filter === "unread"}      onClick={() => setFilter("unread")}>Unread <span style={chipN}>{comms.filter(c => c.unread).length}</span></FilterPill>
              <FilterPill active={filter === "employer"}    onClick={() => setFilter("employer")}>From counterpart</FilterPill>
              <FilterPill active={filter === "internal"}    onClick={() => setFilter("internal")}>Internal</FilterPill>
              <FilterPill active={filter === "forwarded"}   onClick={() => setFilter("forwarded")}>Forwarded</FilterPill>
              <FilterPill active={filter === "attachments"} onClick={() => setFilter("attachments")}>With attachments</FilterPill>
            </div>
            <div style={{ flex: 1 }}/>
            <select value={articleFilter} onChange={(e) => setArticleFilter(e.target.value)} style={{
              padding: "5px 10px", fontSize: 12, color: "var(--ink-2)",
              background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, outline: "none",
            }}>
              <option value="all">All articles</option>
              {articles.map(a => <option key={a} value={a}>{a === "—" ? "No article" : "Article " + a}</option>)}
            </select>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: 60 }}>
              <Empty title="No communications match" body="Try clearing filters or change article."/>
            </div>
          ) : (
            filtered.map((c, i) => (
              <CommRow key={c.id} comm={c} active={c.id === activeId} onClick={() => setActiveId(c.id)} last={i === filtered.length - 1}/>
            ))
          )}
        </div>
      </div>

      {/* Detail pane */}
      {active && (
        <div style={{
          width: 460, flexShrink: 0,
          borderLeft: "1px solid var(--border)",
          background: "var(--surface)",
          display: "flex", flexDirection: "column", overflowY: "auto",
        }}>
          <CommDetail comm={active} onClose={() => setActiveId(null)}/>
        </div>
      )}
    </div>
  );
};

const ForwardAddressCard = ({ neg }) => {
  const [copied, setCopied] = useS(false);
  const addr = FORWARD_ADDR(neg.id);

  const copy = () => {
    navigator.clipboard?.writeText(addr).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div style={{
      background: "var(--surface-2)",
      border: "1px solid var(--border)", borderRadius: 9,
      padding: "12px 14px",
      display: "flex", alignItems: "center", gap: 12,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--primary-soft)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <I.Send size={15}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--ink)", display: "flex", alignItems: "center", gap: 6 }}>
          Forward emails here <I.Sparkle size={11} style={{ color: "var(--primary)" }}/>
        </div>
        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.4 }}>
          Anyone on your team can forward — the AI files by article and runs analysis.
        </div>
        <div style={{
          marginTop: 6, padding: "5px 9px",
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: 5, fontFamily: "var(--font-mono)", fontSize: 11.5, color: "var(--primary)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8,
        }}>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{addr}</span>
          <button onClick={copy} style={{
            background: "transparent", border: "none",
            color: copied ? "var(--signal-green)" : "var(--ink-3)",
            cursor: "pointer", fontSize: 11, fontWeight: 500,
            padding: "0 2px",
          }}>{copied ? "Copied" : "Copy"}</button>
        </div>
      </div>
    </div>
  );
};

const CommRow = ({ comm, active, onClick, last }) => {
  const sideMeta = {
    employer: { color: "var(--ink-2)", label: "Employer" },
    union:    { color: "var(--primary)", label: "Union" },
    external: { color: "var(--ink-3)", label: "External" },
  };
  const lead = comm.participants[0];
  const lm = sideMeta[lead.side] || sideMeta.external;

  return (
    <div onClick={onClick} style={{
      display: "grid", gridTemplateColumns: "auto 1fr auto auto", gap: 14, alignItems: "flex-start",
      padding: "12px 32px",
      background: active ? "var(--primary-soft)" : (comm.unread ? "var(--surface)" : "transparent"),
      borderBottom: last ? "none" : "1px solid var(--border)",
      borderLeft: "3px solid " + (active ? "var(--primary)" : (comm.unread ? "var(--accent-amber)" : "transparent")),
      cursor: "pointer",
      transition: "background .1s",
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--surface-2)"; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = comm.unread ? "var(--surface)" : "transparent"; }}>

      {/* Source icon */}
      <div style={{
        width: 32, height: 32, borderRadius: 7,
        background: "color-mix(in oklab, " + lm.color + " 12%, transparent)",
        color: lm.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 2,
      }}>
        {comm.source === "upload" ? <I.Upload size={14}/> :
         comm.source === "forward" ? <I.Send size={14}/> :
         comm.internal ? <I.Users size={14}/> :
         <I.Inbox size={14}/>}
      </div>

      {/* Body */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3, flexWrap: "wrap" }}>
          <span style={{ fontSize: 13, fontWeight: comm.unread ? 700 : 600, color: "var(--ink)", letterSpacing: "-0.005em" }}>
            {comm.subject}
          </span>
          {comm.source === "forward" && <Pill kind="med">Forwarded</Pill>}
          {comm.source === "upload"  && <Pill kind="low">Uploaded</Pill>}
          {comm.internal && <Pill kind="low">Internal</Pill>}
        </div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginBottom: 5 }}>
          {comm.participants.map((p, i) => (
            <span key={i}>
              <span style={{ color: sideMeta[p.side]?.color, fontWeight: 500 }}>{p.name}</span>
              {i < comm.participants.length - 1 ? ", " : ""}
            </span>
          ))}
          {comm.messageCount > 1 && <span> · {comm.messageCount} messages</span>}
        </div>
        <div style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.5, marginBottom: 6, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {comm.preview}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 11, flexWrap: "wrap" }}>
          {comm.articleNum !== "—" && (
            <span style={{ background: "var(--primary-soft)", color: "var(--primary-ink)", padding: "1px 6px", borderRadius: 3, fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 500 }}>
              Art. {comm.articleNum}
            </span>
          )}
          {comm.attachments.length > 0 && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--ink-3)" }}>
              <I.Paperclip size={10}/> {comm.attachments.length}
            </span>
          )}
          {comm.aiSummary && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color: "var(--primary)", fontStyle: "italic", fontFamily: "var(--font-serif)" }}>
              <I.Sparkle size={10}/> AI summarized
            </span>
          )}
        </div>
      </div>

      {/* Article tag column */}
      <div style={{ fontSize: 11, color: "var(--ink-3)", textAlign: "right", whiteSpace: "nowrap", paddingTop: 4 }}>
        {comm.article !== "Cross-article" && comm.article !== "Logistics" ? comm.article.split(" — ")[1] : comm.article}
      </div>

      {/* Time */}
      <div style={{ textAlign: "right", whiteSpace: "nowrap", paddingTop: 2 }}>
        <div style={{ fontSize: 12, color: "var(--ink-2)", fontWeight: comm.unread ? 600 : 500 }}>{formatRelative(comm.lastAt)}</div>
        <div style={{ fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>{formatAbsolute(comm.lastAt)}</div>
      </div>
    </div>
  );
};

const CommDetail = ({ comm, onClose }) => (
  <>
    <div style={{ padding: "14px 20px 12px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 4 }}>
          {comm.article}
        </div>
        <h3 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: 18, fontWeight: 500, letterSpacing: "-0.015em", color: "var(--ink)", lineHeight: 1.3 }}>{comm.subject}</h3>
      </div>
      <button onClick={onClose} style={{ background: "transparent", border: "none", padding: 4, color: "var(--ink-3)", cursor: "pointer" }}>
        <I.X size={16}/>
      </button>
    </div>

    <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
      <Label style={{ marginBottom: 8 }}>Participants</Label>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {comm.participants.map((p, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name={p.name} initials={p.name.split(" ").map(s => s[0]).join("")} color={p.side === "employer" ? "#6B7280" : p.side === "external" ? "#9CA3AF" : "#1F4A47"} size={24}/>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 500 }}>{p.name}</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{p.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {comm.aiSummary && (
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
        <Label style={{ marginBottom: 8 }}>AI summary</Label>
        <AINote>{comm.aiSummary}</AINote>
      </div>
    )}

    {comm.attachments.length > 0 && (
      <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
        <Label style={{ marginBottom: 8 }}>Attachments ({comm.attachments.length})</Label>
        <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
          {comm.attachments.map(a => (
            <div key={a.name} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 6 }}>
              <FileBadge kind={a.type} size={26}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.name}</div>
              </div>
              <button style={{ background: "transparent", border: "none", padding: 4, color: "var(--ink-3)", cursor: "pointer" }}><I.Download size={13}/></button>
            </div>
          ))}
        </div>
      </div>
    )}

    <div style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
      <Label style={{ marginBottom: 8 }}>Preview</Label>
      <div style={{ fontSize: 13, color: "var(--ink-2)", lineHeight: 1.55, fontFamily: "var(--font-serif)" }}>
        {comm.preview}
      </div>
    </div>

    <div style={{ padding: "14px 20px", display: "flex", flexDirection: "column", gap: 6 }}>
      <Btn variant="primary" icon={<I.Sparkle size={13}/>} style={{ width: "100%", justifyContent: "center" }}>Start analysis chat</Btn>
      <Btn variant="secondary" icon={<I.Inbox size={13}/>} style={{ width: "100%", justifyContent: "center" }}>Open in Outlook</Btn>
      <Btn variant="ghost" icon={<I.Folder size={13}/>} style={{ width: "100%", justifyContent: "center" }}>File under different article</Btn>
    </div>
  </>
);

const FilterPill = ({ active, children, onClick }) => (
  <button onClick={onClick} style={{
    padding: "4px 10px", borderRadius: 999,
    background: active ? "var(--primary)" : "var(--surface)",
    color: active ? "#fff" : "var(--ink-2)",
    border: "1px solid " + (active ? "var(--primary)" : "var(--border)"),
    fontSize: 11.5, fontWeight: 500, cursor: "pointer",
  }}>{children}</button>
);

const chipN = { fontSize: 10.5, opacity: 0.7, marginLeft: 2 };

Object.assign(window, { CommunicationsView });
