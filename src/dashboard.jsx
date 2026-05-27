// All-negotiations dashboard — landing view

const Dashboard = ({ negotiations, archive, onOpenNegotiation, onNew }) => {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 36px 64px" }}>

        {/* Hero header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "var(--ink-3)", letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
            Tuesday, May 26 · Week 22
          </div>
          <h1 style={{ margin: 0, fontSize: 32, fontWeight: 500, letterSpacing: "-0.022em", fontFamily: "var(--font-serif)", color: "var(--ink)" }}>
            Good morning. Two negotiations in flight.
          </h1>
          <div style={{ marginTop: 6, fontSize: 14, color: "var(--ink-2)", maxWidth: 640 }}>
            One IBEW session this afternoon, one NYRA session Thursday. Two articles waiting on your counter.
          </div>
        </div>

        {/* Stat row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 32 }}>
          <Stat label="Active negotiations" value="2" />
          <Stat label="Sessions this week"  value="3" sub="Mon · Wed · Thu" />
          <Stat label="Open articles"        value="13" sub="across both matters" />
          <Stat label="Awaiting your move"   value="2" tone="warn" sub="IBEW · Art 18, 21" />
        </div>

        {/* Active negotiations */}
        <SectionHead
          title="Active matters"
          subtitle="Click into any negotiation to open its workspace"
          actions={
            <div style={{ display: "flex", gap: 8 }}>
              <Btn variant="ghost" icon={<I.Filter size={13}/>}>Filter</Btn>
              <Btn variant="primary" icon={<I.Plus size={14}/>} onClick={onNew}>New negotiation</Btn>
            </div>
          }
        />

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 36 }}>
          {negotiations.map(n => (
            <NegotiationCard key={n.id} n={n} onOpen={() => onOpenNegotiation(n.id)} />
          ))}
        </div>

        {/* Activity + Schedule split */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16, marginBottom: 36 }}>
          <Card padding={0}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Cross-matter activity</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Last 48 hours</div>
              </div>
              <button style={ghostLink}>View all</button>
            </div>
            <div>
              {[...negotiations[0].activity.slice(0, 4), ...negotiations[1].activity.slice(0, 2)].map((a, i, arr) => (
                <ActivityRow key={i} activity={a} negotiation={i < 4 ? negotiations[0] : negotiations[1]} last={i === arr.length - 1} />
              ))}
            </div>
          </Card>

          <Card padding={0}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Upcoming</div>
                <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Bargaining schedule</div>
              </div>
              <button style={ghostLink}>Open calendar</button>
            </div>
            <div style={{ padding: "10px 0" }}>
              <UpcomingItem date="May 28" day="Thu" time="1:00 PM" title="NYRA Session 3" sub="Belmont — Hours, Scheduling, Premium" tag="NYRA" tagColor="var(--accent-amber)" />
              <UpcomingItem date="Jun 02" day="Tue" time="10:00 AM" title="IBEW Session 8" sub="Local Hall — Economic counter" tag="IBEW" tagColor="var(--primary)" prime />
              <UpcomingItem date="Jun 04" day="Thu" time="9:00 AM" title="IBEW Caucus — Pre-session" sub="Internal — strategy on retiree med" tag="IBEW" tagColor="var(--primary)" />
              <UpcomingItem date="Jun 09" day="Tue" time="10:00 AM" title="IBEW Session 9" sub="Tentative — pending counter" tag="IBEW" tagColor="var(--primary)" pending />
              <UpcomingItem date="Jun 11" day="Thu" time="1:00 PM" title="NYRA Session 4" sub="Belmont — Wages opener" tag="NYRA" tagColor="var(--accent-amber)" />
            </div>
          </Card>
        </div>

        {/* Archive */}
        <SectionHead title="Archive" subtitle="Ratified agreements" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
          {archive.map(a => (
            <Card key={a.id} interactive padding={14}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{a.name}</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>{a.client}</div>
                </div>
                <Pill kind="ratified">Ratified {a.ratifiedDate}</Pill>
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 16, fontSize: 12, color: "var(--ink-3)" }}>
                <span>{a.members} members</span>
                <span>·</span>
                <span>Expires {a.cbaExpires}</span>
              </div>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
};

const Stat = ({ label, value, sub, tone }) => (
  <div style={{
    background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10,
    padding: "14px 16px",
    borderLeft: tone === "warn" ? "3px solid var(--accent-amber)" : "1px solid var(--border)",
  }}>
    <div style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 28, fontWeight: 500, fontFamily: "var(--font-serif)", color: "var(--ink)", letterSpacing: "-0.02em", marginTop: 6, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 11.5, color: tone === "warn" ? "var(--accent-amber)" : "var(--ink-3)", marginTop: 4 }}>{sub}</div>}
  </div>
);

const NegotiationCard = ({ n, onOpen }) => {
  const openCount = n.articles.filter(a => a.status === "open").length;
  const taCount   = n.articles.filter(a => a.status === "ta").length;
  const pending   = n.articles.filter(a => a.status === "tentative").length;
  const totalArt  = n.articles.length;
  const progress  = Math.round((taCount / totalArt) * 100);
  const accent    = n.id === "ibew-1430" ? "var(--primary)" : "var(--accent-amber)";

  const nextDate = new Date(n.nextSession);
  const dateStr = nextDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
  const timeStr = nextDate.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });

  return (
    <div onClick={onOpen} style={{
      background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12,
      padding: "20px 24px", cursor: "pointer",
      display: "grid", gridTemplateColumns: "minmax(280px, 1.3fr) 1fr 1fr auto",
      gap: 28, alignItems: "center",
      boxShadow: "var(--shadow-1)",
      transition: "border-color .15s, transform .15s, box-shadow .15s",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.boxShadow = "var(--shadow-2)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "var(--shadow-1)"; }}>

      {/* Identity */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
        <div style={{ width: 4, height: 56, borderRadius: 4, background: accent, flexShrink: 0 }} />
        <div style={{ minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.015em" }}>{n.name}</h3>
            <Pill kind="active" dot/>
          </div>
          <div style={{ fontSize: 12.5, color: "var(--ink-3)", marginBottom: 6, lineHeight: 1.4 }}>
            {n.employer} · {n.members} members
          </div>
          <div style={{ fontSize: 12, color: "var(--ink-2)", fontStyle: "italic", fontFamily: "var(--font-serif)" }}>{n.phase}</div>
        </div>
      </div>

      {/* Next session */}
      <div>
        <Label style={{ marginBottom: 4 }}>Next session</Label>
        <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{dateStr}</div>
        <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{timeStr} · {n.sessionLocation.split(",")[0]}</div>
      </div>

      {/* Article progress */}
      <div>
        <Label style={{ marginBottom: 4 }}>Articles</Label>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--ink)" }}>{taCount} of {totalArt} TA'd</span>
          <span style={{ fontSize: 12, color: "var(--ink-3)" }}>· {openCount} open · {pending} pending</span>
        </div>
        <div style={{ height: 5, background: "var(--bg-2)", borderRadius: 999, overflow: "hidden", display: "flex" }}>
          <div style={{ width: progress + "%", background: "var(--signal-green)" }}/>
          <div style={{ width: (pending / totalArt * 100) + "%", background: "var(--accent-amber)" }}/>
        </div>
      </div>

      {/* Team + chevron */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <AvatarStack people={n.bargainingTeam} size={26} max={3}/>
        <I.ChevronRight size={18} style={{ color: "var(--ink-3)" }}/>
      </div>
    </div>
  );
};

const ActivityRow = ({ activity, negotiation, last }) => {
  const kindMap = {
    "proposal-recv": { ic: <I.ArrowLeft size={13}/>, color: "var(--signal-blue)", bg: "var(--signal-blue-soft)" },
    "ai":            { ic: <I.Sparkle size={13}/>, color: "var(--primary)", bg: "var(--primary-soft)" },
    "ta":            { ic: <I.Check size={13}/>, color: "var(--signal-green)", bg: "var(--signal-green-soft)" },
    "note":          { ic: <I.Doc size={13}/>, color: "var(--ink-3)", bg: "var(--bg-2)" },
    "doc":           { ic: <I.Doc size={13}/>, color: "var(--ink-3)", bg: "var(--bg-2)" },
    "calendar":      { ic: <I.Calendar size={13}/>, color: "var(--accent-amber)", bg: "var(--accent-amber-soft)" },
  };
  const c = kindMap[activity.kind] || kindMap.doc;
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 12,
      padding: "10px 18px",
      borderBottom: last ? "none" : "1px solid var(--border)",
    }}>
      <div style={{ width: 24, height: 24, borderRadius: 6, background: c.bg, color: c.color, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{c.ic}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, color: "var(--ink)", lineHeight: 1.4 }}>{activity.text}</div>
        <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>
          <span style={{ color: negotiation.id === "ibew-1430" ? "var(--primary)" : "var(--accent-amber)", fontWeight: 500 }}>{negotiation.name}</span>
          {" · "}{activity.who} · {activity.time}
        </div>
      </div>
    </div>
  );
};

const UpcomingItem = ({ date, day, time, title, sub, tag, tagColor, prime, pending }) => (
  <div style={{ display: "flex", gap: 14, padding: "10px 18px", alignItems: "flex-start", opacity: pending ? 0.65 : 1 }}>
    <div style={{ textAlign: "center", minWidth: 38, paddingTop: 2 }}>
      <div style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{day}</div>
      <div style={{ fontSize: 16, fontWeight: 500, color: "var(--ink)", fontFamily: "var(--font-serif)", lineHeight: 1.1 }}>{date.split(" ")[1]}</div>
      <div style={{ fontSize: 9.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{date.split(" ")[0]}</div>
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 13, fontWeight: prime ? 600 : 500, color: "var(--ink)" }}>{title}</span>
        <span style={{ fontSize: 10, fontWeight: 600, color: tagColor, background: "color-mix(in oklab, " + tagColor + " 10%, transparent)", padding: "1px 6px", borderRadius: 3, letterSpacing: "0.04em" }}>{tag}</span>
      </div>
      <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 2 }}>{time} · {sub}</div>
    </div>
  </div>
);

const ghostLink = {
  background: "transparent", border: "none", color: "var(--ink-3)",
  fontSize: 12, cursor: "pointer", padding: "2px 6px", borderRadius: 4,
};

Object.assign(window, { Dashboard });
