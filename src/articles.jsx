// Article tracker — list of all articles + per-article proposal history thread.
// This is the killer feature: the back-and-forth.

const ArticlesView = ({ neg, focusId, onSelect }) => {
  const [selected, setSelected] = React.useState(focusId || "art-18");
  const [filter, setFilter] = React.useState("all"); // all, open, tentative, ta, econ, non-econ

  React.useEffect(() => {
    if (focusId && focusId !== selected) setSelected(focusId);
  }, [focusId]);

  const filtered = neg.articles.filter(a => {
    if (filter === "all") return true;
    if (filter === "econ" || filter === "non-econ") return a.topic === filter;
    return a.status === filter;
  });

  const article = neg.articles.find(a => a.id === selected) || neg.articles[0];

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      {/* List */}
      <div style={{
        width: 360, flexShrink: 0,
        borderRight: "1px solid var(--border)",
        background: "var(--surface-2)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>Articles</div>
            <Btn size="sm" variant="secondary" icon={<I.Plus size={11}/>}>Add</Btn>
          </div>
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {[
              { k: "all", l: "All", n: neg.articles.length },
              { k: "open", l: "Open", n: neg.articles.filter(a => a.status === "open").length },
              { k: "tentative", l: "Pending", n: neg.articles.filter(a => a.status === "tentative").length },
              { k: "ta", l: "TA'd", n: neg.articles.filter(a => a.status === "ta").length },
              { k: "econ", l: "Econ", n: neg.articles.filter(a => a.topic === "econ").length },
            ].map(t => (
              <button key={t.k} onClick={() => setFilter(t.k)} style={filterChip(filter === t.k)}>
                {t.l} <span style={{ opacity: 0.6, marginLeft: 2 }}>{t.n}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {filtered.map(a => (
            <ArticleListItem key={a.id} article={a}
              selected={a.id === selected}
              onClick={() => { setSelected(a.id); onSelect && onSelect(a.id); }} />
          ))}
        </div>
      </div>

      {/* Detail */}
      <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
        {article.id === "art-18" ? (
          <ArticleDetailFull neg={neg} article={article} history={window.ARTICLE_18_HISTORY}/>
        ) : (
          <ArticleDetailSimple neg={neg} article={article}/>
        )}
      </div>
    </div>
  );
};

const filterChip = (active) => ({
  fontSize: 11.5, fontWeight: 500,
  padding: "4px 9px", borderRadius: 999,
  background: active ? "var(--primary)" : "var(--surface)",
  color: active ? "#fff" : "var(--ink-2)",
  border: "1px solid " + (active ? "var(--primary)" : "var(--border)"),
  cursor: "pointer",
});

const ArticleListItem = ({ article, selected, onClick }) => (
  <button onClick={onClick} style={{
    width: "100%", textAlign: "left",
    padding: "10px 18px", border: "none",
    background: selected ? "var(--surface)" : "transparent",
    borderLeft: "3px solid " + (selected ? "var(--primary)" : "transparent"),
    cursor: "pointer", display: "flex", gap: 12, alignItems: "flex-start",
    transition: "background .1s",
  }}
  onMouseEnter={(e) => { if (!selected) e.currentTarget.style.background = "var(--bg-2)"; }}
  onMouseLeave={(e) => { if (!selected) e.currentTarget.style.background = "transparent"; }}>
    <div style={{
      fontFamily: "var(--font-mono)", fontSize: 11,
      color: "var(--ink-3)", fontWeight: 500, paddingTop: 1, minWidth: 24,
    }}>{article.num}</div>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)", lineHeight: 1.3 }}>{article.title}</div>
      <div style={{ marginTop: 5, display: "flex", gap: 5, alignItems: "center", flexWrap: "wrap" }}>
        <Pill kind={article.status}/>
        {article.priority === "high" && <Pill kind="high">High</Pill>}
      </div>
      <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 5, fontFamily: "var(--font-mono)" }}>
        {article.proposals} moves · last: {article.lastMove}
      </div>
    </div>
  </button>
);

// Full proposal-thread view — the back-and-forth
const ArticleDetailFull = ({ neg, article, history }) => {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 32px 64px" }}>
      <ArticleHeader neg={neg} article={article}/>

      {/* AI summary banner */}
      <div style={{ marginTop: 16, marginBottom: 24 }}>
        <AINote>
          <div style={{ fontStyle: "normal", fontFamily: "var(--font-sans)" }}>
            <strong style={{ color: "var(--ink)" }}>State of play:</strong>{" "}
            <span style={{ color: "var(--ink-2)" }}>
              Union has moved from 18% → 14% → 12% (drafting). Employer has moved from 6%/4yr → 8.5%/4yr.
              Gap at draft: <strong>3.5% over 3 years</strong>, ~$440K/yr. Employer is buying duration — the signing bonus is the swing variable.
              Recommend caucus on whether to <strong>accept the 4th year</strong> in exchange for Y1 bump.
            </span>
          </div>
        </AINote>
      </div>

      {/* The thread */}
      <div style={{ position: "relative" }}>
        {/* Vertical spine */}
        <div style={{
          position: "absolute", left: 23, top: 16, bottom: 16,
          width: 2, background: "var(--border)",
        }}/>
        {history.map((p, i) => (
          <ProposalCard key={p.id} p={p} index={i}
            isLast={i === history.length - 1}
            previous={history[i - 1]} />
        ))}
      </div>

      {/* Draft your counter */}
      <Card style={{ marginTop: 28, background: "var(--surface-2)", borderStyle: "dashed", borderColor: "var(--border-2)" }}>
        <Label style={{ marginBottom: 8 }}>Tools</Label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn icon={<I.Doc size={13}/>}>Open in Word</Btn>
          <Btn icon={<I.Sparkle size={13}/>}>Run cost model</Btn>
          <Btn icon={<I.Mic size={13}/>}>Caucus on this article</Btn>
          <Btn icon={<I.Send size={13}/>}>Send to counterpart</Btn>
          <Btn variant="primary" icon={<I.Check size={13}/>} style={{ marginLeft: "auto" }}>Mark TA reached</Btn>
        </div>
      </Card>
    </div>
  );
};

const ArticleHeader = ({ neg, article }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24 }}>
    <div>
      <div style={{ fontSize: 12, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.07em", fontWeight: 500, marginBottom: 6 }}>
        Article {article.num}
      </div>
      <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: 30, fontWeight: 500, letterSpacing: "-0.02em", color: "var(--ink)" }}>{article.title}</h1>
      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center" }}>
        <Pill kind={article.status}/>
        <Pill kind={article.topic}/>
        {article.priority === "high" && <Pill kind="high">High priority</Pill>}
        <span style={{ fontSize: 12, color: "var(--ink-3)" }}>· {article.proposals} proposals exchanged</span>
      </div>
    </div>
    <div style={{ display: "flex", gap: 6 }}>
      <Btn variant="ghost" icon={<I.Star size={14}/>}>Pin</Btn>
      <Btn variant="ghost" icon={<I.MoreHorizontal size={14}/>}/>
    </div>
  </div>
);

const ProposalCard = ({ p, index, isLast, previous }) => {
  const isUnion = p.side === "union";
  const isDraft = p.isDraft;

  return (
    <div style={{
      position: "relative",
      marginBottom: isLast ? 0 : 16,
      paddingLeft: 60,
    }}>
      {/* Move marker */}
      <div style={{
        position: "absolute", left: 12, top: 14,
        width: 24, height: 24, borderRadius: 6,
        background: isDraft ? "var(--surface)" : (isUnion ? "var(--primary)" : "var(--ink)"),
        border: isDraft ? "1.5px dashed var(--border-strong)" : "none",
        color: isDraft ? "var(--ink-3)" : "#fff",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 600, fontFamily: "var(--font-mono)",
        zIndex: 1,
      }}>{isDraft ? "…" : (isUnion ? "U" : "E")}</div>

      <Card padding={0} style={{
        borderColor: isDraft ? "var(--border-2)" : (isUnion ? "color-mix(in oklab, var(--primary) 25%, var(--border))" : "var(--border-2)"),
        background: isDraft ? "color-mix(in oklab, var(--accent-amber) 5%, var(--surface))" : "var(--surface)",
        borderStyle: isDraft ? "dashed" : "solid",
        boxShadow: isDraft ? "none" : "var(--shadow-1)",
      }}>
        {/* Card head */}
        <div style={{
          padding: "12px 18px 10px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: 10.5, fontWeight: 500, color: "var(--ink-3)", letterSpacing: "0.04em" }}>
              MOVE {String(index + 1).padStart(2, "0")}
            </span>
            <span style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--ink-4)" }}/>
            <span style={{ fontSize: 12.5, color: "var(--ink-2)", fontWeight: 500 }}>{p.title}</span>
            {p.isDraft && <Pill kind="med">Drafting</Pill>}
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>
            {p.date ? `${p.date}${p.session ? " · Session " + p.session : ""}` : "Not yet exchanged"}
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: "16px 18px 18px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 20 }}>
            <div style={{ flex: 1 }}>
              <div style={{
                fontSize: 22, fontFamily: "var(--font-serif)", fontWeight: 500,
                letterSpacing: "-0.015em", color: "var(--ink)", marginBottom: 6,
                lineHeight: 1.15,
              }}>{p.headline}</div>
              <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55, marginBottom: 12 }}>
                {p.detail}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <FileBadge kind="docx" size={20}/>
                  <span style={{ fontSize: 12, color: "var(--ink-2)" }}>{p.docName}</span>
                </div>
                <span style={{ fontSize: 12, color: "var(--ink-3)" }}>·</span>
                <span style={{ fontSize: 12, color: "var(--ink-3)" }}>By {p.author}</span>
              </div>
            </div>
            {/* Cost panel */}
            {p.annual && (
              <div style={{ padding: "10px 14px", background: "var(--bg-2)", borderRadius: 8, minWidth: 140 }}>
                <Label style={{ marginBottom: 4 }}>Annual cost</Label>
                <div style={{ fontSize: 18, fontFamily: "var(--font-mono)", fontWeight: 500, color: "var(--ink)" }}>
                  ${(p.annual / 1000).toFixed(0)}K
                </div>
                {previous && previous.annual && !p.isDraft && (
                  <div style={{ fontSize: 11, color: p.annual > previous.annual ? "var(--signal-red)" : "var(--signal-green)", marginTop: 2 }}>
                    {p.annual > previous.annual ? "+" : "−"}${Math.abs((p.annual - previous.annual) / 1000).toFixed(0)}K vs prior
                  </div>
                )}
              </div>
            )}
          </div>

          {/* AI note inset */}
          {p.aiNote && (
            <div style={{ marginTop: 12, padding: "9px 12px", background: "var(--bg-2)", borderRadius: 6, fontSize: 12.5, color: "var(--ink-2)", fontStyle: "italic", fontFamily: "var(--font-serif)", display: "flex", gap: 8 }}>
              <I.Sparkle size={12} style={{ color: "var(--primary)", marginTop: 3, flexShrink: 0 }}/>
              <span>{p.aiNote}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

// Simpler view for the other articles
const ArticleDetailSimple = ({ neg, article }) => {
  return (
    <div style={{ maxWidth: 920, margin: "0 auto", padding: "32px 32px 64px" }}>
      <ArticleHeader neg={neg} article={article}/>

      <div style={{ marginTop: 24 }}>
        <Card padding={20}>
          <Label>AI summary</Label>
          <div style={{ marginTop: 8, fontFamily: "var(--font-serif)", fontSize: 16, lineHeight: 1.55, color: "var(--ink)" }}>
            {article.summary}
          </div>
        </Card>
      </div>

      <SectionHead title="Proposal history" subtitle={`${article.proposals} move${article.proposals !== 1 ? 's' : ''} exchanged`} style={{ marginTop: 28, marginBottom: 14 }}/>

      {article.proposals === 0 ? (
        <Empty title="No proposals exchanged yet" body="When the first opener is uploaded, the AI will start tracking the history here automatically." action={<Btn variant="primary" icon={<I.Upload size={13}/>}>Upload first proposal</Btn>}/>
      ) : (
        <div style={{ position: "relative" }}>
          <div style={{ position: "absolute", left: 23, top: 16, bottom: 16, width: 2, background: "var(--border)" }}/>
          {generateFakeHistory(article).map((p, i, arr) => (
            <ProposalCard key={i} p={p} index={i} isLast={i === arr.length - 1} previous={arr[i-1]}/>
          ))}
        </div>
      )}

      <Card style={{ marginTop: 28, background: "var(--surface-2)", borderStyle: "dashed", borderColor: "var(--border-2)" }}>
        <Label style={{ marginBottom: 8 }}>Tools</Label>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Btn icon={<I.Doc size={13}/>}>Open in Word</Btn>
          <Btn icon={<I.Sparkle size={13}/>}>Draft counter with AI</Btn>
          <Btn icon={<I.Mic size={13}/>}>Caucus</Btn>
          <Btn variant="primary" icon={<I.Check size={13}/>} style={{ marginLeft: "auto" }} disabled={article.status === "ta"}>
            {article.status === "ta" ? "Already TA'd" : "Mark TA reached"}
          </Btn>
        </div>
      </Card>
    </div>
  );
};

function generateFakeHistory(article) {
  if (article.proposals === 0) return [];
  const result = [];
  for (let i = 0; i < article.proposals; i++) {
    const isUnion = i % 2 === 0;
    result.push({
      id: `${article.id}-p${i}`,
      side: isUnion ? "union" : "employer",
      round: Math.floor(i / 2) + 1,
      date: i === 0 ? "2026-04-15" : i === 1 ? "2026-04-22" : i === 2 ? "2026-05-06" : "2026-05-13",
      session: i + 2,
      title: i === 0 ? "Opener" : (isUnion ? "Union counter" : "Employer counter"),
      headline: i === 0 ? "Initial position" : (i === article.proposals - 1 && article.status === "ta" ? "Tentative agreement" : "Counter " + Math.floor(i / 2 + 1)),
      detail: article.summary,
      author: isUnion ? "M. Rivera" : "H. Calderon",
      docName: `${article.title.replace(/[^a-zA-Z]/g, "")}-v${i + 1}.docx`,
    });
  }
  return result;
}

Object.assign(window, { ArticlesView });
