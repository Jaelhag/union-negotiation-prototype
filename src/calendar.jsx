// Calendar view per negotiation

const CalendarView = ({ neg }) => {
  // Build a month view for June 2026
  const monthDays = buildMonth(2026, 5); // 0-indexed; 5 = June

  const sessions = neg.sessions.map(s => ({ ...s, dateObj: new Date(s.date + "T00:00:00") }));

  // Hardcode a couple of extra calendar items
  const extras = neg.id === "ibew-1430" ? [
    { date: "2026-06-04", label: "Pre-session caucus", tag: "internal" },
    { date: "2026-06-09", label: "Tentative — Session 9", tag: "pending" },
    { date: "2026-06-16", label: "Membership update meeting", tag: "external" },
    { date: "2026-06-23", label: "Ratification vote (tentative)", tag: "vote" },
    { date: "2026-06-30", label: "CBA expires", tag: "deadline" },
  ] : [
    { date: "2026-06-11", label: "Session 4 — Wages opener", tag: "session" },
    { date: "2026-06-25", label: "Session 5", tag: "session" },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
      <div style={{ padding: "24px 32px 64px", maxWidth: 1280, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 500, letterSpacing: "-0.018em" }}>June 2026</h1>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 2 }}>Synced with Outlook · {sessions.length + extras.length} scheduled items</div>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            <Btn variant="ghost" icon={<I.ChevronLeft size={14}/>}/>
            <Btn variant="ghost">Today</Btn>
            <Btn variant="ghost" icon={<I.ChevronRight size={14}/>}/>
            <div style={{ width: 1, height: 24, background: "var(--border)", margin: "0 6px" }}/>
            <Btn variant="primary" icon={<I.Plus size={13}/>}>Schedule session</Btn>
          </div>
        </div>

        <Card padding={0}>
          {/* Day-of-week head */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "1px solid var(--border)" }}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
              <div key={d} style={{ padding: "10px 12px", fontSize: 11, fontWeight: 600, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{d}</div>
            ))}
          </div>
          {/* Days */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gridAutoRows: "minmax(110px, auto)" }}>
            {monthDays.map((d, i) => {
              if (!d) return <div key={i} style={{ borderRight: "1px solid var(--border)", borderBottom: "1px solid var(--border)", background: "var(--surface-2)" }}/>;
              const dateStr = `2026-06-${String(d).padStart(2, "0")}`;
              const session = sessions.find(s => s.date === dateStr);
              const extra = extras.find(e => e.date === dateStr);
              const isToday = d === 2; // pretend "today" is June 2 to match the data
              return (
                <div key={i} style={{
                  borderRight: ((i + 1) % 7) === 0 ? "none" : "1px solid var(--border)",
                  borderBottom: "1px solid var(--border)",
                  padding: 8,
                  background: isToday ? "var(--primary-soft)" : "var(--surface)",
                  position: "relative",
                }}>
                  <div style={{
                    fontSize: 12, fontWeight: isToday ? 700 : 500,
                    color: isToday ? "var(--primary-ink)" : "var(--ink-2)",
                    fontFamily: "var(--font-mono)",
                    marginBottom: 6,
                  }}>{d}</div>
                  {session && (
                    <CalEvent
                      label={`Session ${session.n} — ${session.topic.split(",")[0]}`}
                      color="var(--primary)"
                    />
                  )}
                  {extra && (
                    <CalEvent
                      label={extra.label}
                      color={extra.tag === "deadline" ? "var(--signal-red)" : extra.tag === "vote" ? "var(--signal-green)" : extra.tag === "internal" ? "var(--accent-amber)" : "var(--ink-3)"}
                      outline={extra.tag === "pending"}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Legend */}
        <div style={{ display: "flex", gap: 16, marginTop: 14, fontSize: 12, color: "var(--ink-3)" }}>
          <LegendDot color="var(--primary)" label="Bargaining session"/>
          <LegendDot color="var(--accent-amber)" label="Internal caucus"/>
          <LegendDot color="var(--ink-3)" label="Membership"/>
          <LegendDot color="var(--signal-green)" label="Ratification"/>
          <LegendDot color="var(--signal-red)" label="Deadline"/>
        </div>
      </div>
    </div>
  );
};

function buildMonth(year, month) {
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstDay).fill(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

const CalEvent = ({ label, color, outline }) => (
  <div style={{
    fontSize: 11, fontWeight: 500, padding: "2px 6px",
    borderRadius: 4, marginBottom: 3,
    background: outline ? "transparent" : "color-mix(in oklab, " + color + " 12%, var(--surface))",
    border: outline ? `1px dashed ${color}` : "none",
    color: color,
    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
  }}>{label}</div>
);

const LegendDot = ({ color, label }) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
    <span style={{ width: 8, height: 8, borderRadius: 2, background: color }}/>
    {label}
  </span>
);

Object.assign(window, { CalendarView });
