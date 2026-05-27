// Caucus view — private to your side, Teams/Zoom-layered with AI notes

const CaucusView = ({ neg }) => {
  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
      <div style={{ padding: "24px 32px 64px", maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 20 }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "4px 10px", borderRadius: 999, background: "var(--signal-red-soft)", color: "var(--signal-red)", fontSize: 11, fontWeight: 600, marginBottom: 10, letterSpacing: "0.04em", textTransform: "uppercase" }}>
              <I.Lock size={11}/> Private — Your side only
            </div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 500, letterSpacing: "-0.018em" }}>Caucus Room</h1>
            <div style={{ fontSize: 13.5, color: "var(--ink-2)", marginTop: 4, maxWidth: 640 }}>
              Strategy space for your bargaining team. Layered on Teams + Zoom — recordings are transcribed and AI-summarized into caucus notes that get filed by article.
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="secondary" icon={<I.Video size={13}/>}>Join Zoom</Btn>
            <Btn variant="primary" icon={<I.Mic size={13}/>}>Start caucus</Btn>
          </div>
        </div>

        {/* Live state */}
        <Card padding={0} style={{ marginBottom: 20 }}>
          <div style={{ padding: "18px 22px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: "50%",
              background: "var(--bg-2)", color: "var(--ink-3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <I.Mic size={18}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>No caucus in session</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 1 }}>Last caucus: May 20, 2026 · 47 min · 5 articles discussed</div>
            </div>
            <Btn variant="ghost" icon={<I.Sparkle size={13}/>}>Draft pre-session brief</Btn>
          </div>
        </Card>

        {/* Recent caucus sessions */}
        <SectionHead title="Recent caucus sessions" subtitle="Transcribed and tagged by article — privately searchable across the matter"/>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 28 }}>
          <CaucusCard
            date="May 20" duration="47 min" tag="Pre-session" articles={["Art. 18 — Wages", "Art. 21 — Retiree Med"]}
            summary="Team is firm on retiree medical — will not concede new-hire closure. On wages, willing to take 4-year duration in exchange for Y1 bump to 5.5%. Rivera to call Calderon before Session 8 to feel out signing-bonus floor."
            takeaways={[
              "Hard line on retiree medical for new hires",
              "Open to 4-year deal in exchange for stronger Y1",
              "Floor on signing bonus: $900/member",
            ]}
          />
          <CaucusCard
            date="May 13" duration="38 min" tag="Mid-session" articles={["Art. 19 — H&W"]}
            summary="Quick caucus after employer's H&W counter. Team agreed to accept 1% member contribution if cap is in contract language. Foster to draft cap language for review tonight."
            takeaways={[
              "Accept 1% premium share with hard cap",
              "Draft cap language by EOD",
              "Wait on counter until Session 7",
            ]}
          />
          <CaucusCard
            date="May 6" duration="62 min" tag="Strategy" articles={["Economic package overall"]}
            summary="Big-picture strategy session. Built three scenarios for the economic close: aggressive (3yr, 14%), balanced (3yr, 12% + bonus), and concession (4yr, 9.5% + bonus + better health). Will float the balanced position at Session 7."
            takeaways={[
              "Three scenarios modeled — see Cost Models folder",
              "Lead with balanced position",
              "Hold aggressive in reserve as walk position",
            ]}
          />
        </div>

        {/* Strategy memo callout */}
        <Card style={{ background: "linear-gradient(135deg, color-mix(in oklab, var(--primary) 6%, var(--surface)) 0%, var(--surface) 100%)" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ width: 40, height: 40, borderRadius: 8, background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <I.Doc size={18}/>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Strategy Memo — Economic Package</div>
              <div style={{ fontSize: 13, color: "var(--ink-2)", marginTop: 4, lineHeight: 1.5 }}>
                Live document covering wage, H&W, pension, and retiree medical strategy through ratification. Last updated by you, today.
              </div>
              <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
                <Btn icon={<I.Doc size={13}/>}>Open</Btn>
                <Btn variant="ghost">Version history</Btn>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const CaucusCard = ({ date, duration, tag, articles, summary, takeaways }) => (
  <Card padding={0}>
    <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, padding: "16px 22px", alignItems: "flex-start" }}>
      <div style={{ textAlign: "center", minWidth: 50, paddingTop: 4 }}>
        <div style={{ fontSize: 10, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>May</div>
        <div style={{ fontSize: 22, fontFamily: "var(--font-serif)", fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.02em", lineHeight: 1 }}>{date.split(" ")[1]}</div>
      </div>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Pill kind="low">{tag}</Pill>
          {articles.map(a => <Pill key={a} kind="open">{a}</Pill>)}
          <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>· {duration}</span>
        </div>
        <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55, fontFamily: "var(--font-serif)", marginBottom: 12 }}>
          {summary}
        </div>
        <Label style={{ marginBottom: 6 }}>Takeaways</Label>
        <ul style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 4 }}>
          {takeaways.map((t, i) => (
            <li key={i} style={{ fontSize: 12.5, color: "var(--ink-2)", display: "flex", gap: 8 }}>
              <span style={{ color: "var(--primary)", flexShrink: 0 }}>→</span>{t}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <Btn size="sm" variant="ghost" icon={<I.Video size={12}/>}>Play recording</Btn>
        <Btn size="sm" variant="ghost" icon={<I.Doc size={12}/>}>Full notes</Btn>
      </div>
    </div>
  </Card>
);

Object.assign(window, { CaucusView });
