// Proposal Review & Drafting — Claude-project-style AI workspace.
// Each negotiation has a project with standing instructions + knowledge base.
// Each proposal opens its own chat that inherits both.

const { useState: useS, useEffect: useE, useRef: useR } = React;

// ── Default standing instructions per industry (could be editable) ───────────
const DEFAULT_INSTRUCTIONS = `You are the AI analyst for an experienced labor negotiator. You analyze incoming proposals, draft counter-proposals, and surface strategy.

ANALYSIS RULES
1. For every incoming proposal, separate economic vs non-economic impact.
2. Compare against the prior CBA and flag any regressions in member rights.
3. Cost economic items against current membership demographics.
4. Surface peer-local comparison data when relevant.
5. Name what the counterpart actually wants beneath the language.
6. Recommend response framing: accept, counter, or table.

DRAFTING RULES
1. Match the prior CBA's voice and structure.
2. Use bilateral language by default.
3. Always include savings clause and severability.
4. Show the math behind counters in dollars and percentages.
5. Surface track-changes explicitly with rationale.

TONE
- Concise. Front-load the recommendation.
- Use bullet structure. No filler.
- Cite specific article and section numbers.`;

const KNOWLEDGE_BASE = [
  { name: "Current CBA 2023-2026", type: "pdf", note: "Baseline reference" },
  { name: "Prior CBA 2020-2023", type: "pdf", note: "Regression check" },
  { name: "BLS NY Electrical Q1 2026", type: "xlsx", note: "Wage comparables" },
  { name: "IBEW Local 3 — 2025 CBA", type: "pdf", note: "Peer reference" },
  { name: "IBEW Local 41 — 2024 CBA", type: "pdf", note: "Peer reference" },
  { name: "Membership demographics", type: "xlsx", note: "412 members, age, classification" },
  { name: "Prior caucus memos (12)", type: "thread", note: "Strategy continuity" },
];

// ── Pre-baked chats for the demo ────────────────────────────────────────────
function seedChats() {
  return [
    {
      id: "c-art18-empc",
      title: "2026-05-20_Analysis of Employer 5-20 proposal re. Article 18 — Wages",
      article: "Article 18 — Wages",
      articleNum: "18",
      kind: "analysis",
      source: { name: "Employer Wage Counter 8.5pct.docx", type: "docx" },
      createdAt: "2026-05-20T15:42:00",
      lastActiveAt: "2026-05-26T09:13:00",
      tags: ["wages", "employer-counter", "duration", "signing-bonus", "package"],
      pinned: true,
      status: "active",
      messages: [
        { role: "ai", time: "May 20, 3:42 PM", content:
`**Initial analysis — Employer counter (Round 2)**

**Recommendation:** Counter, do not accept. The 4-year duration is the swing variable, not the 8.5%.

**What changed from their opener**
- Rate: 6% → 8.5% (+2.5%, ~ $160K/yr)
- Duration: held at 4 years (their structural anchor)
- **New:** $1,200/member signing bonus (~$494K one-time)
- Substation tech differential: +$0.50 → +$0.85

**What they actually want**
- The 4th year. Every economic move so far has held duration constant. Signing bonus reads as a "duration buy."
- Predictability through their next rate case (Aug 2027).

**Where to push**
1. 3-year deal at 12.5%–13% remains in range — they have not put their full Y1 number forward.
2. Signing bonus is fully tradeable for Y1 rate (rule of thumb: $750 bonus ≈ 0.7% Y1 lift over 3yr).
3. Apprentice scale not yet addressed in their counter — silent equals leverage for us.

**Regression check vs 2023 CBA**
- None. Substation tech is a new classification, not a carryover.

Want me to model a counter at 12.5%/3yr + $750 bonus, or draft the language?` },
        { role: "user", time: "May 20, 4:18 PM", content: "Run both. Also show me what 12.5%/3yr looks like vs accepting their 8.5%/4yr in total dollars over 4 years." },
        { role: "ai", time: "May 20, 4:19 PM", content:
`**Side-by-side, 4-year horizon (412 members, $92.5K base)**

|                          | Our 12.5%/3yr + $750 | Their 8.5%/4yr + $1,200 |
|--------------------------|----------------------|--------------------------|
| Total wage cost          | $4.06M (3yr)         | $3.62M (4yr)            |
| Bonus                    | $309K                | $494K                   |
| Y4 baseline (post-CBA)   | open / new neg       | locked at 8.5% over Y3  |
| Members net (avg/yr)     | $11,260              | $7,810                  |

**Plain read:** Our 3-year package is **$3,450/member/yr** richer over its term. Their 4-year package costs them less per year and locks the floor.

**The strategic question:** are we better off bargaining again in 3 years or 4? Wage growth tail risk says 3.

**Draft language — 12.5% / 3yr + $750**
Filed at \`05 — Proposal Review / Wage Counter v4 — DRAFT.docx\`. Highlights:
- Y1: 5.5% effective July 1, 2026
- Y2: 4.0% effective July 1, 2027
- Y3: 2.5% effective July 1, 2028 (CPI floor of 2%)
- Apprentice scale held at 50/60/70/80/90% of JIW
- $750 ratification bonus, payable within 30 days of execution
- Substation tech: JIW + $1.20

Recommend you take this to caucus before Session 8.` },
        { role: "user", time: "Today, 9:12 AM", content: "What's the apprentice-scale leverage point you mentioned? Concrete." },
        { role: "ai", time: "Today, 9:13 AM", content:
`**Apprentice scale — leverage map**

**Current (2023 CBA):** 50/60/70/80/90% of JIW across years 1-5.
**Their counter:** silent on apprentices — assumed status quo.
**Membership reality:** 38 of 412 (9.2%) are apprentices. 18 graduate to JIW during this CBA term.

**Three plays, ranked**

1. **Raise the floor** (low cost, high optics)
   Move year 1 from 50% → 55%. Cost: ~$22K/yr total. Wins the apprentice block at ratification. Their HR will likely say yes.

2. **Compress the bottom** (medium cost)
   55/65/72/80/90%. Speeds turnover from apprentice to JIW. Cost: ~$48K/yr. Helps recruitment story.

3. **Tie scale to wage opener** (high leverage)
   Bind apprentice scale to JIW + automatic step on each anniversary. Costs nothing extra in Y1, but caps their future cost-saving on apprentice-heavy hiring. Strategic value.

Recommend asking for #3 in language and trading down to #1 if they push back. The ask itself signals you're paying attention to a group they expect us to ignore.` },
      ],
    },
    {
      id: "c-art18-draft",
      title: "2026-05-26_Draft of Union counter v4 re. Article 18 — Wages",
      article: "Article 18 — Wages",
      articleNum: "18",
      kind: "draft",
      source: { name: "Wage Counter v4 — DRAFT.docx", type: "docx" },
      createdAt: "2026-05-26T10:48:00",
      lastActiveAt: "2026-05-26T10:53:00",
      tags: ["wages", "drafting", "cpi-floor", "savings-clause"],
      pinned: true,
      status: "drafting",
      messages: [
        { role: "user", time: "Today, 10:48 AM", content: "Draft the savings clause for the wage article. Standard but tight." },
        { role: "ai", time: "Today, 10:48 AM", content:
`**Savings clause — Article 18.§7**

> Should any provision of this Article be held invalid or unenforceable by a court of competent jurisdiction or by operation of federal or state law, such determination shall not invalidate the remainder of this Article, which shall continue in full force and effect. The parties shall, within thirty (30) days of such determination, meet to negotiate a substitute provision that effectuates the original intent.

Mirrors the 2020 CBA §22.4 language with the 30-day meet-and-confer added — that's what got us movement on the prior reopener. Want it inserted now?` },
        { role: "user", time: "Today, 10:53 AM", content: "Yes. And add a CPI floor language for Y3." },
        { role: "ai", time: "Today, 10:53 AM", content:
`**Inserted both.** Draft saved to \`05 — Proposal Review / Wage Counter v4 — DRAFT.docx\`, v.4.3.

**CPI floor — §3(c)**

> Effective July 1, 2028, the wage rate set forth in §3(a) shall be increased by two and one-half percent (2.5%), or by the percentage change in the Consumer Price Index for All Urban Consumers (CPI-U), Northeast Region, for the twelve-month period ending May 31, 2028, whichever is greater. In no event shall the Y3 increase be less than two percent (2.0%).

**Note:** The 2% hard floor is unusual. Their HR will counter it out. If you want a stronger ask, leave it; if you want this draft to be accepted with minimal pushback, take the hard floor out and rely on the CPI-or-2.5% mechanism alone. Your call.` },
      ],
    },
    {
      id: "c-art21",
      title: "2026-05-06_Analysis of Employer 5-6 proposal re. Article 21 — Retiree Medical Closure",
      article: "Article 21 — Retiree Medical",
      articleNum: "21",
      kind: "analysis",
      source: { name: "Retiree Medical Closure Proposal.docx", type: "docx" },
      createdAt: "2026-05-06T14:15:00",
      lastActiveAt: "2026-05-25T14:15:00",
      tags: ["retiree-medical", "generational-equity", "hold-line", "ratification"],
      status: "active",
      messages: [
        { role: "ai", time: "May 6, 2:15 PM", content:
`**Initial analysis — Retiree medical closure to new hires**

**Recommendation:** Reject. This is a generational equity issue and your membership will not ratify it. Caucus has confirmed the floor.

**What it does**
- Closes retiree medical eligibility to anyone hired after CBA execution.
- Existing employees and current retirees: held harmless.
- Affects an estimated 60-90 future hires over the next decade.

**Why they're asking**
- IBNR liability on retiree medical is their single largest unfunded line item.
- Closing the door now defers ~$8-12M in projected liability over 20 years.
- This is a "second bite" — they asked for the same in 2020 and withdrew.

**The members will hear:** "the company doesn't want to take care of the next generation." This is the proposal that breaks ratification. Hold the line.

**Counter-options if they insist on touching it**
1. Cap retiree medical at Medicare-eligible age.
2. Tiered benefit — full for 25+ years service, partial for 15-24.
3. Joint trust fund with member contribution share.

None of these should be offered unprompted. Position #1 and #2 as the *only* directions you'll go, only if asked.` },
      ],
    },
    {
      id: "c-art19-compare",
      title: "2026-05-14_Comparison of H&W counters across 3 rounds re. Article 19 — Health & Welfare",
      article: "Article 19 — Health & Welfare",
      articleNum: "19",
      kind: "compare",
      source: null,
      createdAt: "2026-05-14T11:30:00",
      lastActiveAt: "2026-05-22T11:30:00",
      tags: ["health-welfare", "convergence", "cap-and-collar"],
      status: "idle",
      messages: [
        { role: "ai", time: "May 14, 11:30 AM", content:
`**H&W contribution — three rounds of moves**

Movement is happening. Both sides have given ground twice.

| Round | Union ask | Employer ask | Gap |
|------:|----------:|-------------:|----:|
| 1 (opener) | 0% member share | 5% member share | 5.0 pts |
| 2          | 0.5% with cap | 3% member share | 2.5 pts |
| 3 (current)| 1% with cap @ $40/mo | 2% member share | 1.0 pt |

**The negotiation is converging on 1.5%, capped.** The remaining fight is the cap mechanism, not the rate.

**Strategy**
- They'll move to 1.5% if you accept a $60/mo cap.
- Hold at 1% + $40 cap as your stated position; signal 1.25% + $50 is your real position.
- Do not name the real position until Session 8.

Want me to draft the cap-and-collar language?` },
      ],
    },
    {
      id: "c-art27-subcontract",
      title: "2026-05-18_Draft of Union first-refusal language re. Article 27 — Subcontracting",
      article: "Article 27 — Subcontracting",
      articleNum: "27",
      kind: "draft",
      source: { name: "Subcontracting Language Final.docx", type: "docx" },
      createdAt: "2026-05-18T10:00:00",
      lastActiveAt: "2026-05-20T16:30:00",
      tags: ["subcontracting", "drafting", "first-refusal", "near-ta"],
      status: "near-ta",
      messages: [],
    },
    {
      id: "c-strategy",
      title: "2026-05-22_Strategy memo re. Economic package endgame (cross-article)",
      article: "Cross-article",
      articleNum: "—",
      kind: "strategy",
      source: null,
      createdAt: "2026-05-22T09:00:00",
      lastActiveAt: "2026-05-26T08:30:00",
      tags: ["package", "endgame", "leverage", "walk-away"],
      status: "active",
      messages: [],
    },
    {
      id: "c-art20",
      title: "2026-05-13_Analysis of Employer 5-13 proposal re. Article 20 — Pension",
      article: "Article 20 — Pension",
      articleNum: "20",
      kind: "analysis",
      source: { name: "Pension counter v2.docx", type: "docx" },
      createdAt: "2026-05-13T15:00:00",
      lastActiveAt: "2026-05-13T15:30:00",
      tags: ["pension", "employer-counter", "hourly-contribution"],
      status: "idle",
      messages: [],
    },
  ];
}

// ── Main view ───────────────────────────────────────────────────────────────
const DraftingView = ({ neg }) => {
  const [chats, setChats] = useS(seedChats());
  const [activeId, setActiveId] = useS(null); // null = library view
  const [showInstructions, setShowInstructions] = useS(false);
  const [showNewChat, setShowNewChat] = useS(false);
  const [instructions, setInstructions] = useS(DEFAULT_INSTRUCTIONS);

  const active = chats.find(c => c.id === activeId);

  const updateActiveMessages = (updater) => {
    setChats(cs => cs.map(c => c.id === activeId ? { ...c, messages: updater(c.messages), lastActiveAt: new Date().toISOString() } : c));
  };

  const togglePin = (id) => {
    setChats(cs => cs.map(c => c.id === id ? { ...c, pinned: !c.pinned } : c));
  };

  const createChat = (config) => {
    const c = {
      id: "c-" + Date.now(),
      title: config.title,
      article: config.article,
      articleNum: config.articleNum,
      kind: config.kind,
      source: config.source,
      createdAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
      tags: config.tags || [],
      status: "active",
      messages: [],
    };
    setChats(cs => [c, ...cs]);
    setActiveId(c.id);
    setShowNewChat(false);
  };

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0, minWidth: 0, flexDirection: "column" }}>
      {active ? (
        <FullScreenChat
          chat={active}
          chats={chats}
          onBack={() => setActiveId(null)}
          onJump={(id) => setActiveId(id)}
          onSendUserMessage={updateActiveMessages}
          onTogglePin={() => togglePin(active.id)}
          onOpenProject={() => setShowInstructions(true)}
          instructions={instructions}
        />
      ) : (
        <ChatLibrary
          neg={neg}
          chats={chats}
          onOpenChat={setActiveId}
          onTogglePin={togglePin}
          onNew={() => setShowNewChat(true)}
          onOpenProject={() => setShowInstructions(true)}
        />
      )}

      {showInstructions && (
        <ProjectModal
          instructions={instructions}
          setInstructions={setInstructions}
          onClose={() => setShowInstructions(false)}
        />
      )}
      {showNewChat && (
        <NewChatModal neg={neg} onCancel={() => setShowNewChat(false)} onCreate={createChat}/>
      )}
    </div>
  );
};

const projectChip = {
  display: "inline-flex", alignItems: "center", gap: 4,
  padding: "4px 8px", borderRadius: 5,
  background: "var(--surface)", border: "1px solid var(--border)",
  color: "var(--ink-2)", fontSize: 11, fontWeight: 500,
  cursor: "pointer",
};

// ── Kind metadata (shared between library and chat) ─────────────────────────
const KIND_META = {
  analysis: { color: "var(--signal-blue)",  label: "Analysis", verb: "Analyze"   },
  draft:    { color: "var(--accent-amber)", label: "Draft",    verb: "Draft"     },
  compare:  { color: "var(--primary)",      label: "Compare",  verb: "Compare"   },
  strategy: { color: "#7A3F8F",             label: "Strategy", verb: "Strategy"  },
};

// ── Datetime helpers ────────────────────────────────────────────────────────
// "Now" is May 26 2026 11:00 AM for the prototype.
const PROTO_NOW = new Date("2026-05-26T11:00:00").getTime();

function formatAbsolute(iso) {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}

function formatRelative(iso) {
  const t = new Date(iso).getTime();
  const diff = PROTO_NOW - t;
  if (diff < 0) return "Just now";
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return mins + "m ago";
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs + "h ago";
  // Same calendar day boundary
  const today = new Date(PROTO_NOW); today.setHours(0,0,0,0);
  const that = new Date(t); that.setHours(0,0,0,0);
  const dayDiff = Math.round((today - that) / 86400000);
  if (dayDiff === 1) return "Yesterday, " + new Date(t).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
  if (dayDiff < 7)   return new Date(t).toLocaleDateString("en-US", { weekday: "long" });
  return new Date(t).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function bucketByDate(chats) {
  const today = [], yesterday = [], thisWeek = [], earlier = [];
  const todayStart = new Date(PROTO_NOW); todayStart.setHours(0,0,0,0);
  for (const c of chats) {
    const t = new Date(c.lastActiveAt).getTime();
    const days = Math.floor((todayStart.getTime() - t) / 86400000);
    if (days < 0)     today.push(c);
    else if (days < 1) today.push(c);
    else if (days < 2) yesterday.push(c);
    else if (days < 7) thisWeek.push(c);
    else               earlier.push(c);
  }
  return { today, yesterday, thisWeek, earlier };
}

// ── Library view (full width, default) ──────────────────────────────────────
const ChatLibrary = ({ neg, chats, onOpenChat, onTogglePin, onNew, onOpenProject }) => {
  const [search, setSearch] = useS("");
  const [kindFilter, setKindFilter] = useS("all");
  const [articleFilter, setArticleFilter] = useS("all");
  const [tagFilter, setTagFilter] = useS(null);
  const [sort, setSort] = useS("recent"); // recent | oldest

  // Collect all unique tags
  const allTags = [...new Set(chats.flatMap(c => c.tags || []))].sort();
  const allArticles = [...new Set(chats.map(c => c.articleNum))].sort();

  let filtered = chats.filter(c => {
    if (kindFilter !== "all" && c.kind !== kindFilter) return false;
    if (articleFilter !== "all" && c.articleNum !== articleFilter) return false;
    if (tagFilter && !(c.tags || []).includes(tagFilter)) return false;
    if (search) {
      const q = search.toLowerCase();
      const hay = (c.title + " " + c.article + " " + (c.tags || []).join(" ") + " " + (c.source?.name || "")).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  filtered.sort((a, b) =>
    sort === "oldest"
      ? new Date(a.lastActiveAt) - new Date(b.lastActiveAt)
      : new Date(b.lastActiveAt) - new Date(a.lastActiveAt)
  );

  const pinned = filtered.filter(c => c.pinned);
  const rest = filtered.filter(c => !c.pinned);
  const buckets = bucketByDate(rest);

  const counts = {
    all: chats.length,
    analysis: chats.filter(c => c.kind === "analysis").length,
    draft: chats.filter(c => c.kind === "draft").length,
    compare: chats.filter(c => c.kind === "compare").length,
    strategy: chats.filter(c => c.kind === "strategy").length,
  };

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: "28px 32px 64px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 18 }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <div style={{ width: 22, height: 22, borderRadius: 5, background: "var(--primary)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <I.Sparkle size={11}/>
              </div>
              <Label>Negotiation AI · Project</Label>
            </div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 500, letterSpacing: "-0.018em", color: "var(--ink)" }}>
              Proposal Review & Drafting
            </h1>
            <div style={{ fontSize: 13.5, color: "var(--ink-2)", marginTop: 4, maxWidth: 720, lineHeight: 1.5 }}>
              Each proposal opens its own chat. All chats share standing instructions and {KNOWLEDGE_BASE.length} reference documents.
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            <Btn variant="secondary" icon={<I.Doc size={13}/>} onClick={onOpenProject}>Project rules</Btn>
            <Btn variant="primary"   icon={<I.Plus size={13}/>} onClick={onNew}>New chat</Btn>
          </div>
        </div>

        {/* Filter bar */}
        <Card padding={0} style={{ marginBottom: 18 }}>
          <div style={{ padding: "12px 16px", display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid var(--border)" }}>
            <div style={{ position: "relative", flex: 1, maxWidth: 360 }}>
              <I.Search size={13} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--ink-3)" }}/>
              <input
                placeholder="Search by title, tag, source, article…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", height: 32, padding: "0 12px 0 30px",
                  background: "var(--surface)", border: "1px solid var(--border)",
                  borderRadius: 6, fontSize: 12.5, color: "var(--ink)", outline: "none",
                }}/>
            </div>
            <div style={{ flex: 1 }}/>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "var(--ink-3)" }}>
              <span>Sort:</span>
              <button onClick={() => setSort("recent")} style={sortBtn(sort === "recent")}>Most recent</button>
              <button onClick={() => setSort("oldest")} style={sortBtn(sort === "oldest")}>Oldest first</button>
            </div>
          </div>
          <div style={{ padding: "10px 16px", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginRight: 6 }}>Type</span>
            <FilterChip active={kindFilter === "all"}      onClick={() => setKindFilter("all")}>All <span style={chipCount}>{counts.all}</span></FilterChip>
            <FilterChip active={kindFilter === "analysis"} color="var(--signal-blue)"  onClick={() => setKindFilter("analysis")}>Analysis <span style={chipCount}>{counts.analysis}</span></FilterChip>
            <FilterChip active={kindFilter === "draft"}    color="var(--accent-amber)" onClick={() => setKindFilter("draft")}>Drafts <span style={chipCount}>{counts.draft}</span></FilterChip>
            <FilterChip active={kindFilter === "compare"}  color="var(--primary)"      onClick={() => setKindFilter("compare")}>Compare <span style={chipCount}>{counts.compare}</span></FilterChip>
            <FilterChip active={kindFilter === "strategy"} color="#7A3F8F"             onClick={() => setKindFilter("strategy")}>Strategy <span style={chipCount}>{counts.strategy}</span></FilterChip>

            <span style={{ width: 1, height: 18, background: "var(--border)", margin: "0 6px" }}/>

            <span style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginRight: 6 }}>Article</span>
            <FilterChip active={articleFilter === "all"} onClick={() => setArticleFilter("all")}>All</FilterChip>
            {allArticles.map(num => (
              <FilterChip key={num} active={articleFilter === num} onClick={() => setArticleFilter(num)}>
                Art. {num}
              </FilterChip>
            ))}
          </div>
          {allTags.length > 0 && (
            <div style={{ padding: "0 16px 12px", display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 11, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600, marginRight: 6 }}>Tags</span>
              {tagFilter && (
                <FilterChip active onClick={() => setTagFilter(null)} color="var(--primary)">
                  #{tagFilter} <I.X size={10} style={{ marginLeft: 2 }}/>
                </FilterChip>
              )}
              {allTags.filter(t => t !== tagFilter).map(tag => (
                <button key={tag} onClick={() => setTagFilter(tag)} style={tagBtn}>#{tag}</button>
              ))}
            </div>
          )}
        </Card>

        {/* Results */}
        {filtered.length === 0 ? (
          <Empty title="No chats match your filters"
            body="Clear filters or start a new chat."
            action={<Btn variant="primary" icon={<I.Plus size={13}/>} onClick={onNew}>New chat</Btn>}/>
        ) : (
          <>
            {pinned.length > 0 && (
              <Section label="Pinned" icon={<I.Pin size={11}/>}>
                {pinned.map(c => <ChatCard key={c.id} chat={c} onOpen={() => onOpenChat(c.id)} onTogglePin={() => onTogglePin(c.id)} onTagClick={setTagFilter}/>)}
              </Section>
            )}
            {buckets.today.length > 0 && (
              <Section label="Today">
                {buckets.today.map(c => <ChatCard key={c.id} chat={c} onOpen={() => onOpenChat(c.id)} onTogglePin={() => onTogglePin(c.id)} onTagClick={setTagFilter}/>)}
              </Section>
            )}
            {buckets.yesterday.length > 0 && (
              <Section label="Yesterday">
                {buckets.yesterday.map(c => <ChatCard key={c.id} chat={c} onOpen={() => onOpenChat(c.id)} onTogglePin={() => onTogglePin(c.id)} onTagClick={setTagFilter}/>)}
              </Section>
            )}
            {buckets.thisWeek.length > 0 && (
              <Section label="This week">
                {buckets.thisWeek.map(c => <ChatCard key={c.id} chat={c} onOpen={() => onOpenChat(c.id)} onTogglePin={() => onTogglePin(c.id)} onTagClick={setTagFilter}/>)}
              </Section>
            )}
            {buckets.earlier.length > 0 && (
              <Section label="Earlier">
                {buckets.earlier.map(c => <ChatCard key={c.id} chat={c} onOpen={() => onOpenChat(c.id)} onTogglePin={() => onTogglePin(c.id)} onTagClick={setTagFilter}/>)}
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

const Section = ({ label, icon, children }) => (
  <div style={{ marginBottom: 24 }}>
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 4px 8px" }}>
      {icon && <span style={{ color: "var(--ink-3)" }}>{icon}</span>}
      <Label>{label}</Label>
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>{children}</div>
  </div>
);

const ChatCard = ({ chat, onOpen, onTogglePin, onTagClick }) => {
  const k = KIND_META[chat.kind] || KIND_META.analysis;
  return (
    <div onClick={onOpen} style={{
      background: "var(--surface)", border: "1px solid var(--border)",
      borderRadius: 9, padding: "14px 18px", cursor: "pointer",
      display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 16, alignItems: "flex-start",
      transition: "border-color .12s, box-shadow .12s",
      boxShadow: "var(--shadow-1)",
    }}
    onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-2)"; e.currentTarget.style.boxShadow = "var(--shadow-2)"; }}
    onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.boxShadow = "var(--shadow-1)"; }}>

      {/* Kind glyph */}
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: "color-mix(in oklab, " + k.color + " 12%, var(--surface))",
        color: k.color,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 1,
      }}>
        {chat.kind === "analysis" ? <I.Search size={15}/> :
         chat.kind === "draft" ? <I.Doc size={15}/> :
         chat.kind === "compare" ? <I.Scale size={15}/> :
         <I.Flag size={15}/>}
      </div>

      {/* Body */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 10, fontWeight: 700, color: k.color, letterSpacing: "0.05em",
            background: "color-mix(in oklab, " + k.color + " 12%, transparent)",
            padding: "2px 6px", borderRadius: 3,
          }}>{k.label.toUpperCase()}</span>
          <span style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>{chat.article}</span>
          {chat.status === "near-ta" && <Pill kind="tentative">Near TA</Pill>}
          {chat.status === "drafting" && <Pill kind="med">Drafting</Pill>}
        </div>
        <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em", marginBottom: 6, lineHeight: 1.3 }}>
          {chat.title}
        </div>
        {chat.source && (
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <FileBadge kind={chat.source.type} size={14}/>
            {chat.source.name}
          </div>
        )}
        {chat.tags && chat.tags.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 4 }}>
            {chat.tags.map(t => (
              <button key={t} onClick={(e) => { e.stopPropagation(); onTagClick(t); }} style={tagPill}>#{t}</button>
            ))}
          </div>
        )}
      </div>

      {/* Right meta */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, flexShrink: 0, textAlign: "right" }}>
        <div style={{ fontSize: 11.5, color: "var(--ink-2)", fontWeight: 500 }}>{formatRelative(chat.lastActiveAt)}</div>
        <div style={{ fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>{formatAbsolute(chat.lastActiveAt)}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
          <span style={{ fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>
            {chat.messages.length} msg{chat.messages.length !== 1 ? "s" : ""}
          </span>
          <button onClick={(e) => { e.stopPropagation(); onTogglePin(); }} style={{
            background: "transparent", border: "none", cursor: "pointer",
            color: chat.pinned ? "var(--accent-amber)" : "var(--ink-4)",
            padding: 2, display: "inline-flex",
          }} title={chat.pinned ? "Unpin" : "Pin"}>
            <I.Pin size={12}/>
          </button>
        </div>
      </div>
    </div>
  );
};

const FilterChip = ({ active, color, children, onClick }) => (
  <button onClick={onClick} style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "3px 9px", borderRadius: 999,
    background: active ? (color || "var(--primary)") : "var(--surface)",
    color: active ? "#fff" : "var(--ink-2)",
    border: "1px solid " + (active ? (color || "var(--primary)") : "var(--border)"),
    fontSize: 11.5, fontWeight: 500, cursor: "pointer",
    transition: "all .1s",
  }}>{children}</button>
);

const chipCount = { fontSize: 10.5, opacity: 0.7, marginLeft: 2 };

const sortBtn = (active) => ({
  background: active ? "var(--bg-2)" : "transparent",
  border: "none", color: active ? "var(--ink)" : "var(--ink-3)",
  fontSize: 11.5, fontWeight: 500,
  padding: "3px 8px", borderRadius: 5, cursor: "pointer",
});

const tagBtn = {
  background: "var(--bg-2)", border: "1px solid var(--border)",
  color: "var(--ink-3)", fontSize: 11, fontWeight: 500,
  padding: "2px 7px", borderRadius: 4, cursor: "pointer",
  fontFamily: "var(--font-mono)",
};

const tagPill = {
  background: "var(--bg-2)", border: "1px solid var(--border)",
  color: "var(--ink-2)", fontSize: 10.5, fontWeight: 500,
  padding: "1px 6px", borderRadius: 3, cursor: "pointer",
  fontFamily: "var(--font-mono)",
};

// ── Full-screen chat wrapper — collapsible sidebar + active chat ────────────
const FullScreenChat = ({ chat, chats, onBack, onJump, onSendUserMessage, onTogglePin, onOpenProject, instructions }) => {
  const [collapsed, setCollapsed] = useS(false);
  const sortedChats = [...chats].sort((a, b) => {
    if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.lastActiveAt) - new Date(a.lastActiveAt);
  });

  return (
    <div style={{ flex: 1, display: "flex", minWidth: 0, minHeight: 0, background: "var(--bg)" }}>
      {/* Collapsible sidebar */}
      <div style={{
        width: collapsed ? 52 : 280,
        flexGrow: 0, flexShrink: 0, flexBasis: collapsed ? 52 : 280,
        borderRight: "1px solid var(--border)",
        background: "var(--surface-2)",
        display: "flex", flexDirection: "column",
        transition: "width .18s ease",
        overflow: "hidden",
      }}>
        <div style={{
          padding: collapsed ? "10px 8px" : "10px 14px",
          borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", gap: 6,
          justifyContent: collapsed ? "center" : "space-between",
          minHeight: 50,
        }}>
          {!collapsed && (
            <button onClick={onBack} style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              background: "transparent", border: "none",
              color: "var(--ink-2)", fontSize: 12.5, fontWeight: 500,
              padding: "4px 8px", borderRadius: 5, cursor: "pointer",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-2)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
              <I.ArrowLeft size={13}/> Library
            </button>
          )}
          <button onClick={() => setCollapsed(c => !c)}
            title={collapsed ? "Expand" : "Collapse"}
            style={{
              width: 28, height: 28, borderRadius: 5,
              background: "transparent", border: "none", cursor: "pointer",
              color: "var(--ink-3)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "var(--bg-2)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
            {collapsed ? <I.ChevronRight size={14}/> : <I.ChevronLeft size={14}/>}
          </button>
        </div>

        {collapsed ? (
          <div style={{ padding: "10px 0", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1, overflowY: "auto" }}>
            <button onClick={onBack} title="Back to library" style={collapsedRailBtn(false)}>
              <I.ArrowLeft size={14}/>
            </button>
            <div style={{ width: 24, height: 1, background: "var(--border)", margin: "4px 0" }}/>
            {sortedChats.map(c => {
              const isActive = c.id === chat.id;
              const k = KIND_META[c.kind] || KIND_META.analysis;
              return (
                <button key={c.id}
                  onClick={() => onJump(c.id)}
                  title={c.title}
                  style={{
                    ...collapsedRailBtn(isActive),
                    background: isActive ? "var(--surface)" : "transparent",
                    color: isActive ? k.color : "var(--ink-3)",
                    border: isActive ? "1px solid var(--border)" : "1px solid transparent",
                  }}>
                  {c.kind === "analysis" ? <I.Search size={13}/> :
                   c.kind === "draft" ? <I.Doc size={13}/> :
                   c.kind === "compare" ? <I.Scale size={13}/> :
                   <I.Flag size={13}/>}
                </button>
              );
            })}
          </div>
        ) : (
          <>
            <div style={{ padding: "8px 12px 6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 8px", borderRadius: 5, background: "var(--surface)", border: "1px solid var(--border)" }}>
                <I.Search size={12} style={{ color: "var(--ink-3)" }}/>
                <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>Filter chats…</span>
              </div>
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "0 0 12px" }}>
              {sortedChats.map(c => (
                <SidebarChatItem
                  key={c.id}
                  chat={c}
                  active={c.id === chat.id}
                  onClick={() => onJump(c.id)}
                />
              ))}
            </div>
            <div style={{ padding: "10px 12px", borderTop: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 6 }}>
              <button onClick={onOpenProject} style={sidebarFootBtn}>
                <I.Doc size={13}/> Project rules
              </button>
              <div style={{ fontSize: 10.5, color: "var(--ink-3)", lineHeight: 1.4, padding: "2px 8px" }}>
                {KNOWLEDGE_BASE.length} reference docs · standing instructions loaded
              </div>
            </div>
          </>
        )}
      </div>

      {/* Active chat column */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        {/* Chat header bar */}
        <div style={{
          padding: "10px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--surface)",
          display: "flex", alignItems: "center", gap: 10,
          flexShrink: 0, minHeight: 50,
        }}>
          <div style={{ flex: 1, minWidth: 0, display: "flex", alignItems: "center", gap: 8 }}>
            <Pill kind={chat.status === "near-ta" ? "tentative" : chat.status === "active" ? "active" : "low"} dot>
              {chat.status === "drafting" ? "Drafting" : chat.status === "active" ? "Active" : chat.status === "near-ta" ? "Near TA" : "Idle"}
            </Pill>
            <span style={{ fontSize: 11, color: "var(--ink-3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.05em" }}>{chat.article}</span>
          </div>
          <Btn variant="ghost" icon={<I.Pin size={13}/>} onClick={onTogglePin} size="sm" style={chat.pinned ? { color: "var(--accent-amber)" } : null}>
            {chat.pinned ? "Pinned" : "Pin"}
          </Btn>
          <Btn variant="ghost" icon={<I.MoreHorizontal size={13}/>} size="sm"/>
        </div>
        <ActiveChat chat={chat} onSendUserMessage={onSendUserMessage} instructions={instructions}/>
      </div>
    </div>
  );
};

const collapsedRailBtn = (active) => ({
  width: 36, height: 32, borderRadius: 6,
  background: "transparent", border: "none", cursor: "pointer",
  color: "var(--ink-3)",
  display: "flex", alignItems: "center", justifyContent: "center",
});

const sidebarFootBtn = {
  display: "inline-flex", alignItems: "center", gap: 6,
  padding: "5px 8px", background: "transparent", border: "none",
  color: "var(--ink-2)", fontSize: 12, fontWeight: 500,
  cursor: "pointer", borderRadius: 5, textAlign: "left",
};

const SidebarChatItem = ({ chat, active, onClick }) => {
  const k = KIND_META[chat.kind] || KIND_META.analysis;
  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left",
      padding: "9px 14px 10px",
      background: active ? "var(--surface)" : "transparent",
      borderLeft: "3px solid " + (active ? k.color : "transparent"),
      border: "none", cursor: "pointer",
      transition: "background .1s",
      display: "flex", flexDirection: "column", gap: 3,
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--bg-2)"; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span style={{
          fontSize: 9, fontWeight: 700, color: k.color, letterSpacing: "0.05em",
          background: "color-mix(in oklab, " + k.color + " 12%, transparent)",
          padding: "1px 4px", borderRadius: 3,
        }}>{k.label.toUpperCase()}</span>
        <span style={{ fontSize: 10, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>Art.{chat.articleNum}</span>
        {chat.pinned && <I.Pin size={10} style={{ color: "var(--accent-amber)", marginLeft: "auto" }}/>}
      </div>
      <div style={{ fontSize: 12, fontWeight: active ? 600 : 500, color: "var(--ink)", lineHeight: 1.35,
        display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden",
      }}>
        {chat.title}
      </div>
      <div style={{ fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>{formatRelative(chat.lastActiveAt)}</div>
    </button>
  );
};

// ── Active chat ─────────────────────────────────────────────────────────────
const ActiveChat = ({ chat, onSendUserMessage, instructions }) => {
  const [input, setInput] = useS("");
  const [thinking, setThinking] = useS(false);
  const scrollRef = useR(null);

  useE(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chat.messages.length, thinking]);

  const send = async (text) => {
    if (!text.trim() || thinking) return;
    const userMsg = { role: "user", time: "Just now", content: text };
    onSendUserMessage(ms => [...ms, userMsg]);
    setInput("");
    setThinking(true);

    try {
      const transcript = [...chat.messages, userMsg]
        .map(m => `${m.role === 'user' ? 'NEGOTIATOR' : 'AI ANALYST'}: ${m.content}`)
        .join('\n\n');

      const prompt = `${instructions}

CURRENT CONTEXT
- Chat: "${chat.title}"
- Article: ${chat.article}
- Type: ${chat.kind}
${chat.source ? `- Source document: ${chat.source.name}` : ''}

CONVERSATION
${transcript}

Respond as AI ANALYST. Be concise, structured, and specific. Use markdown headings sparingly. Cite article numbers where relevant. Lead with the recommendation.`;

      const response = await window.claude.complete(prompt);
      onSendUserMessage(ms => [...ms, { role: "ai", time: "Just now", content: response }]);
    } catch (e) {
      onSendUserMessage(ms => [...ms, { role: "ai", time: "Just now",
        content: "**Could not reach the analyst right now.** This is the prototype's live AI link — it requires an active connection. Try again, or use one of the quick-action buttons below." }]);
    } finally {
      setThinking(false);
    }
  };

  const quickActions = chat.kind === "analysis" ? [
    "Generate counter-proposal",
    "Cost the package",
    "Compare to prior CBA",
    "What leverage do we have?",
    "Member-facing summary",
  ] : chat.kind === "draft" ? [
    "Tighten the language",
    "Show track changes vs prior",
    "Flag risks for ratification",
    "Generate plain-English version",
  ] : chat.kind === "compare" ? [
    "Where is movement converging?",
    "What's their endgame?",
    "Model next two rounds",
  ] : [
    "Set me up for the next session",
    "What should we caucus on?",
    "Walk-away analysis",
  ];

  return (
    <>
      {/* Header */}
      <div style={{ padding: "16px 28px 14px", borderBottom: "1px solid var(--border)", background: "var(--surface)" }}>
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          <h2 style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: "-0.018em", color: "var(--ink)", fontFamily: "var(--font-serif)", lineHeight: 1.25 }}>{chat.title}</h2>
          {chat.tags && chat.tags.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
              {chat.tags.map(t => (
                <span key={t} style={{
                  background: "var(--bg-2)", border: "1px solid var(--border)",
                  color: "var(--ink-3)", fontSize: 10.5, fontWeight: 500,
                  padding: "1px 6px", borderRadius: 3,
                  fontFamily: "var(--font-mono)",
                }}>#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Source doc banner */}
      {chat.source && (
        <div style={{ padding: "10px 28px", background: "var(--surface-2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
          <FileBadge kind={chat.source.type} size={26}/>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Source under analysis</div>
            <div style={{ fontSize: 13, color: "var(--ink)", fontWeight: 500 }}>{chat.source.name}</div>
          </div>
          <Btn size="sm" variant="secondary" icon={<I.Doc size={11}/>}>Open in Word</Btn>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "24px 32px 16px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          {chat.messages.length === 0 ? (
            <EmptyChat chat={chat} quickActions={quickActions} onSend={send}/>
          ) : (
            <>
              {chat.messages.map((m, i) => (
                <ChatMessage key={i} m={m}/>
              ))}
              {thinking && <ThinkingBubble/>}
            </>
          )}
        </div>
      </div>

      {/* Quick actions */}
      {chat.messages.length > 0 && !thinking && (
        <div style={{ padding: "10px 32px 0", borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
          <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", gap: 6, flexWrap: "wrap", paddingTop: 8 }}>
            {quickActions.map(qa => (
              <button key={qa} onClick={() => send(qa)} style={{
                padding: "5px 10px", fontSize: 12, fontWeight: 500,
                background: "var(--bg-2)", border: "1px solid var(--border)",
                color: "var(--ink-2)", borderRadius: 999, cursor: "pointer",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "var(--primary-soft)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "var(--bg-2)"}>
                {qa}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div style={{ padding: "12px 32px 20px", background: "var(--surface)" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "flex-end", gap: 8,
            background: "var(--surface)", border: "1px solid var(--border-2)",
            borderRadius: 10, padding: "8px 10px",
            boxShadow: "var(--shadow-1)",
          }}>
            <button style={{ background: "transparent", border: "none", color: "var(--ink-3)", padding: 6, cursor: "pointer" }} title="Attach"><I.Paperclip size={15}/></button>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
              placeholder={`Ask about ${chat.article.toLowerCase()}, or paste new language…`}
              rows={1}
              style={{
                flex: 1, border: "none", outline: "none", resize: "none",
                background: "transparent", fontSize: 13.5, color: "var(--ink)",
                fontFamily: "var(--font-sans)", lineHeight: 1.5, padding: "6px 0",
                minHeight: 22, maxHeight: 200,
              }}/>
            <button onClick={() => send(input)} disabled={!input.trim() || thinking} style={{
              background: input.trim() && !thinking ? "var(--primary)" : "var(--bg-2)",
              color: input.trim() && !thinking ? "#fff" : "var(--ink-4)",
              border: "none", borderRadius: 6, padding: "6px 8px",
              cursor: input.trim() && !thinking ? "pointer" : "not-allowed",
              display: "inline-flex", alignItems: "center",
            }}>
              <I.Send size={14}/>
            </button>
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6, display: "flex", alignItems: "center", gap: 6 }}>
            <I.Sparkle size={11} style={{ color: "var(--primary)" }}/>
            Standing instructions and {KNOWLEDGE_BASE.length} reference documents are loaded for this chat. Press Enter to send, Shift+Enter for newline.
          </div>
        </div>
      </div>
    </>
  );
};

const ChatMessage = ({ m }) => {
  const isUser = m.role === "user";
  return (
    <div style={{ display: "flex", gap: 14, marginBottom: 22, alignItems: "flex-start" }}>
      <div style={{
        width: 30, height: 30, borderRadius: 7,
        background: isUser ? "#1F4A47" : "var(--primary-soft)",
        color: isUser ? "#fff" : "var(--primary)",
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0, marginTop: 2,
        fontSize: 11, fontWeight: 600,
      }}>{isUser ? "YO" : <I.Sparkle size={14}/>}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>{isUser ? "You" : "AI analyst"}</span>
          <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{m.time}</span>
        </div>
        <div className="markdown-body" style={{
          fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.6,
        }}>
          <Markdown content={m.content}/>
        </div>
      </div>
    </div>
  );
};

// Tiny markdown renderer — handles headings, bold, lists, code, tables, blockquote
const Markdown = ({ content }) => {
  const html = renderMarkdown(content);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};

function renderMarkdown(text) {
  if (!text) return "";
  let t = text;
  // Escape angle brackets that aren't in tables
  t = t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  // Code blocks
  t = t.replace(/```([\s\S]*?)```/g, (_, c) => `<pre>${c.trim()}</pre>`);
  // Tables — basic
  t = t.replace(/(^\|.*\|\n\|[-: |]+\|\n(?:\|.*\|\n?)*)/gm, (block) => {
    const lines = block.trim().split("\n");
    const head = lines[0].split("|").slice(1, -1).map(c => c.trim());
    const align = lines[1].split("|").slice(1, -1).map(c => c.includes(":") && c.endsWith(":") ? "right" : c.startsWith(":") ? "left" : "left");
    const rows = lines.slice(2).map(r => r.split("|").slice(1, -1).map(c => c.trim()));
    return `<table>
      <thead><tr>${head.map((h, i) => `<th style="text-align:${align[i]}">${h}</th>`).join("")}</tr></thead>
      <tbody>${rows.map(r => `<tr>${r.map((c, i) => `<td style="text-align:${align[i]}">${c}</td>`).join("")}</tr>`).join("")}</tbody>
    </table>`;
  });
  // Headings
  t = t.replace(/^### (.+)$/gm, "<h4>$1</h4>");
  t = t.replace(/^## (.+)$/gm, "<h3>$1</h3>");
  t = t.replace(/^# (.+)$/gm, "<h2>$1</h2>");
  // Bold + italic + inline code
  t = t.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\*(.+?)\*/g, "<em>$1</em>");
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  // Blockquote
  t = t.replace(/^&gt; (.+)$/gm, "<blockquote>$1</blockquote>");
  // Ordered & unordered lists
  t = t.replace(/(?:^|\n)((?:\d+\. .+\n?)+)/g, (_, block) => {
    const items = block.trim().split("\n").map(l => l.replace(/^\d+\. /, ""));
    return "\n<ol>" + items.map(i => `<li>${i}</li>`).join("") + "</ol>";
  });
  t = t.replace(/(?:^|\n)((?:- .+\n?)+)/g, (_, block) => {
    const items = block.trim().split("\n").map(l => l.replace(/^- /, ""));
    return "\n<ul>" + items.map(i => `<li>${i}</li>`).join("") + "</ul>";
  });
  // Paragraphs (split on blank lines)
  t = t.split(/\n\n+/).map(p => {
    if (p.match(/^<(h[2-4]|ul|ol|table|pre|blockquote)/)) return p;
    return "<p>" + p.replace(/\n/g, "<br/>") + "</p>";
  }).join("\n");
  return t;
}

const ThinkingBubble = () => (
  <div style={{ display: "flex", gap: 14, marginBottom: 22, alignItems: "flex-start" }}>
    <div style={{ width: 30, height: 30, borderRadius: 7, background: "var(--primary-soft)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <I.Sparkle size={14}/>
    </div>
    <div style={{ paddingTop: 8 }}>
      <div className="thinking-dots" style={{ display: "inline-flex", gap: 4 }}>
        <span style={{ ...dotStyle, animationDelay: "0s" }}/>
        <span style={{ ...dotStyle, animationDelay: "0.15s" }}/>
        <span style={{ ...dotStyle, animationDelay: "0.3s" }}/>
      </div>
    </div>
  </div>
);

const dotStyle = {
  width: 6, height: 6, borderRadius: "50%", background: "var(--primary)",
  animation: "pulseDot 1.1s infinite ease-in-out",
};

const EmptyChat = ({ chat, quickActions, onSend }) => (
  <div style={{ textAlign: "center", padding: "60px 0 40px" }}>
    <div style={{ width: 56, height: 56, borderRadius: 12, background: "var(--primary-soft)", color: "var(--primary)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
      <I.Sparkle size={24}/>
    </div>
    <h3 style={{ margin: "0 0 6px", fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em" }}>
      {chat.kind === "draft" ? "Ready to draft" : chat.kind === "compare" ? "Ready to compare" : "Ready to analyze"}
    </h3>
    <div style={{ fontSize: 13.5, color: "var(--ink-3)", maxWidth: 460, margin: "0 auto 24px", lineHeight: 1.55 }}>
      This chat inherits your project instructions and all {KNOWLEDGE_BASE.length} reference documents. Ask anything, or use a quick action below.
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", maxWidth: 560, margin: "0 auto" }}>
      {quickActions.map(qa => (
        <button key={qa} onClick={() => onSend(qa)} style={{
          padding: "8px 14px", fontSize: 13, fontWeight: 500,
          background: "var(--surface)", border: "1px solid var(--border-2)",
          color: "var(--ink-2)", borderRadius: 999, cursor: "pointer",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = "var(--primary-soft)"; e.currentTarget.style.borderColor = "var(--primary)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = "var(--surface)"; e.currentTarget.style.borderColor = "var(--border-2)"; }}>
          {qa}
        </button>
      ))}
    </div>
  </div>
);

// ── Instructions / Knowledge modal ─────────────────────────────────────────
const ProjectModal = ({ instructions, setInstructions, onClose }) => {
  const [tab, setTab] = useS("instructions");
  const [draft, setDraft] = useS(instructions);

  return (
    <div style={modalOverlay} onClick={onClose}>
      <div style={{ ...modalDialog, width: "min(820px, 100%)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "20px 28px 0", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 19, fontWeight: 600, letterSpacing: "-0.015em" }}>Project — Negotiation AI</h2>
              <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-3)" }}>
                Standing instructions and reference documents shared by every chat in this negotiation.
              </div>
            </div>
            <button onClick={onClose} style={{ background: "transparent", border: "none", padding: 6, color: "var(--ink-3)", cursor: "pointer" }}>
              <I.X size={18}/>
            </button>
          </div>
          <div style={{ display: "flex", gap: 2 }}>
            <ModalTab label="Standing instructions" active={tab === "instructions"} onClick={() => setTab("instructions")}/>
            <ModalTab label={`Knowledge base · ${KNOWLEDGE_BASE.length}`} active={tab === "knowledge"} onClick={() => setTab("knowledge")}/>
          </div>
        </div>

        {tab === "instructions" && (
          <div style={{ padding: "20px 28px" }}>
            <Label style={{ marginBottom: 8 }}>Apply to every chat</Label>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={18}
              style={{
                width: "100%", padding: "12px 14px",
                border: "1px solid var(--border-2)", borderRadius: 8,
                fontFamily: "var(--font-mono)", fontSize: 12.5, color: "var(--ink)",
                lineHeight: 1.55, resize: "vertical", outline: "none",
                background: "var(--surface-2)",
              }}/>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, alignItems: "center" }}>
              <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>Saved instructions apply to all new chats. Existing chats retain their original instructions until refreshed.</span>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn variant="ghost" onClick={() => setDraft(DEFAULT_INSTRUCTIONS)}>Reset to default</Btn>
                <Btn variant="primary" icon={<I.Check size={13}/>} onClick={() => { setInstructions(draft); onClose(); }}>Save</Btn>
              </div>
            </div>
          </div>
        )}

        {tab === "knowledge" && (
          <div style={{ padding: "20px 28px" }}>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginBottom: 14 }}>
              These documents are available to every chat as reference. Add prior CBAs, comp data, peer agreements, and strategy memos.
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {KNOWLEDGE_BASE.map(k => (
                <div key={k.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 14px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 7 }}>
                  <FileBadge kind={k.type}/>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13.5, fontWeight: 500, color: "var(--ink)" }}>{k.name}</div>
                    <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 1 }}>{k.note}</div>
                  </div>
                  <button style={{ background: "transparent", border: "none", color: "var(--ink-3)", cursor: "pointer", padding: 4 }}><I.MoreHorizontal size={14}/></button>
                </div>
              ))}
              <button style={{
                marginTop: 6, padding: "12px",
                background: "transparent", border: "1px dashed var(--border-2)",
                borderRadius: 8, color: "var(--ink-3)",
                cursor: "pointer", fontSize: 13, fontWeight: 500,
                display: "flex", alignItems: "center", gap: 8, justifyContent: "center",
              }}>
                <I.Plus size={13}/> Add document
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ModalTab = ({ label, active, onClick }) => (
  <button onClick={onClick} style={{
    position: "relative",
    padding: "10px 14px", background: "transparent", border: "none",
    color: active ? "var(--ink)" : "var(--ink-3)",
    fontSize: 13, fontWeight: active ? 600 : 500,
    cursor: "pointer",
  }}>
    {label}
    {active && <span style={{ position: "absolute", left: 8, right: 8, bottom: -1, height: 2, background: "var(--primary)", borderRadius: 2 }}/>}
  </button>
);

// ── New chat modal ─────────────────────────────────────────────────────────
const NewChatModal = ({ neg, onCancel, onCreate }) => {
  const [kind, setKind] = useS("analysis");
  const [articleId, setArticleId] = useS(neg.articles[0]?.id || "");
  const [party, setParty] = useS("Employer");
  const [proposalDate, setProposalDate] = useS(toDateInputValue(new Date()));
  const [sourceName, setSourceName] = useS("");
  const [detail, setDetail] = useS("");
  const [titleOverride, setTitleOverride] = useS("");

  const article = neg.articles.find(a => a.id === articleId);
  const today = toDateInputValue(new Date(PROTO_NOW));

  // Build the standardized title
  const autoTitle = buildTitle({
    today,
    kind,
    party,
    proposalDate,
    article,
    detail,
  });
  const finalTitle = titleOverride.trim() || autoTitle;

  const KINDS = [
    { id: "analysis", label: "Analyze a proposal",   desc: "Break down an incoming proposal" },
    { id: "draft",    label: "Draft language",        desc: "Counter or new article language" },
    { id: "compare",  label: "Compare positions",     desc: "Multi-round movement & convergence" },
    { id: "strategy", label: "Strategy session",      desc: "Cross-article — endgame, leverage, walk" },
  ];

  const handleCreate = () => {
    onCreate({
      title: finalTitle,
      article: kind === "strategy" ? "Cross-article" : (article?.num ? `Article ${article.num} — ${article.title}` : "—"),
      articleNum: kind === "strategy" ? "—" : (article?.num || "—"),
      kind,
      source: sourceName ? { name: sourceName, type: "docx" } : null,
      tags: deriveTags({ kind, party, article, detail }),
    });
  };

  return (
    <div style={modalOverlay} onClick={onCancel}>
      <div style={{ ...modalDialog, width: "min(680px, 100%)" }} onClick={(e) => e.stopPropagation()}>
        <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ margin: 0, fontSize: 19, fontWeight: 600, letterSpacing: "-0.015em" }}>New chat</h2>
          <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-3)" }}>
            Titles follow a standard format. Inherits project instructions and {KNOWLEDGE_BASE.length} reference docs.
          </div>
        </div>
        <div style={{ padding: "20px 28px" }}>
          {/* Kind */}
          <Label style={{ marginBottom: 8 }}>Chat type</Label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
            {KINDS.map(k => (
              <button key={k.id} onClick={() => setKind(k.id)} style={{
                textAlign: "left", padding: "12px 14px",
                background: kind === k.id ? "var(--primary-soft)" : "var(--surface)",
                border: "1px solid " + (kind === k.id ? "var(--primary)" : "var(--border)"),
                borderRadius: 8, cursor: "pointer",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: kind === k.id ? "var(--primary-ink)" : "var(--ink)" }}>{k.label}</div>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 3, lineHeight: 1.35 }}>{k.desc}</div>
              </button>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: kind === "strategy" ? "1fr" : "1fr 1fr", gap: 12, marginBottom: 14 }}>
            {kind !== "strategy" && (
              <div>
                <Label style={{ marginBottom: 6 }}>Article</Label>
                <select value={articleId} onChange={(e) => setArticleId(e.target.value)} style={selectStyle}>
                  {neg.articles.map(a => <option key={a.id} value={a.id}>Article {a.num} — {a.title}</option>)}
                </select>
              </div>
            )}

            {(kind === "analysis" || kind === "draft") && (
              <div>
                <Label style={{ marginBottom: 6 }}>{kind === "analysis" ? "Proposing party" : "Drafting party"}</Label>
                <select value={party} onChange={(e) => setParty(e.target.value)} style={selectStyle}>
                  {kind === "analysis" ? (
                    <>
                      <option>Employer</option>
                      <option>Union</option>
                      <option>Joint</option>
                    </>
                  ) : (
                    <>
                      <option>Union</option>
                      <option>Employer</option>
                      <option>Joint</option>
                    </>
                  )}
                </select>
              </div>
            )}
          </div>

          {kind === "analysis" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 14 }}>
              <div>
                <Label style={{ marginBottom: 6 }}>Date of proposal</Label>
                <input type="date" value={proposalDate} onChange={(e) => setProposalDate(e.target.value)} style={selectStyle}/>
              </div>
              <div>
                <Label style={{ marginBottom: 6 }}>Source file (optional)</Label>
                <input value={sourceName} onChange={(e) => setSourceName(e.target.value)}
                  placeholder="e.g. Employer-counter-Art19.docx" style={selectStyle}/>
              </div>
            </div>
          )}

          {kind === "draft" && (
            <div style={{ marginBottom: 14 }}>
              <Label style={{ marginBottom: 6 }}>What are you drafting? (short)</Label>
              <input value={detail} onChange={(e) => setDetail(e.target.value)}
                placeholder="e.g. counter v4, first-refusal language, savings clause" style={selectStyle}/>
            </div>
          )}

          {kind === "compare" && (
            <div style={{ marginBottom: 14 }}>
              <Label style={{ marginBottom: 6 }}>What's being compared?</Label>
              <input value={detail} onChange={(e) => setDetail(e.target.value)}
                placeholder="e.g. all 3 H&W counter rounds" style={selectStyle}/>
            </div>
          )}

          {kind === "strategy" && (
            <div style={{ marginBottom: 14 }}>
              <Label style={{ marginBottom: 6 }}>Topic</Label>
              <input value={detail} onChange={(e) => setDetail(e.target.value)}
                placeholder="e.g. Economic package endgame, walk-away analysis" style={selectStyle}/>
            </div>
          )}

          {/* Title preview */}
          <div style={{
            padding: "10px 12px", marginTop: 4,
            background: "var(--bg-2)", borderRadius: 7,
            border: "1px solid var(--border)",
          }}>
            <Label style={{ marginBottom: 6 }}>Title preview</Label>
            <input
              value={titleOverride || autoTitle}
              onChange={(e) => setTitleOverride(e.target.value)}
              style={{
                width: "100%", padding: "6px 8px",
                background: "var(--surface)", border: "1px solid var(--border-2)",
                borderRadius: 5, fontSize: 13, color: "var(--ink)",
                fontFamily: "var(--font-mono)", outline: "none",
              }}/>
            <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 5, lineHeight: 1.5 }}>
              Format: <span style={{ fontFamily: "var(--font-mono)" }}>YYYY-MM-DD_[Kind] of [party] [proposal date] proposal re. Article X — [topic]</span>. Edit freely if needed.
            </div>
          </div>
        </div>
        <div style={{ padding: "14px 28px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", justifyContent: "flex-end", gap: 8, borderRadius: "0 0 12px 12px" }}>
          <Btn variant="ghost" onClick={onCancel}>Cancel</Btn>
          <Btn variant="primary" icon={<I.Plus size={13}/>} onClick={handleCreate}>Create chat</Btn>
        </div>
      </div>
    </div>
  );
};

// ── Title + tag builders ────────────────────────────────────────────────────
function toDateInputValue(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function shortDate(iso) {
  // "2026-05-20" -> "5-20"
  if (!iso) return "";
  const parts = iso.split("-");
  if (parts.length !== 3) return iso;
  return `${parseInt(parts[1], 10)}-${parseInt(parts[2], 10)}`;
}

function buildTitle({ today, kind, party, proposalDate, article, detail }) {
  const artRef = article ? `Article ${article.num} — ${article.title}` : "—";
  if (kind === "analysis") {
    return `${today}_Analysis of ${party} ${shortDate(proposalDate)} proposal re. ${artRef}`;
  }
  if (kind === "draft") {
    return `${today}_Draft of ${party} ${detail || "counter"} re. ${artRef}`;
  }
  if (kind === "compare") {
    return `${today}_Comparison of ${detail || "positions"} re. ${artRef}`;
  }
  // strategy
  return `${today}_Strategy memo re. ${detail || "cross-article"}`;
}

function deriveTags({ kind, party, article, detail }) {
  const tags = [];
  if (kind === "analysis") tags.push(party.toLowerCase() + "-proposal", "analysis");
  if (kind === "draft") tags.push("drafting", party.toLowerCase() + "-counter");
  if (kind === "compare") tags.push("compare", "convergence");
  if (kind === "strategy") tags.push("strategy");
  if (article?.title) {
    const slug = article.title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24);
    if (slug) tags.push(slug);
  }
  if (detail) {
    const slug = detail.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24);
    if (slug) tags.push(slug);
  }
  return tags;
}

const modalOverlay = {
  position: "fixed", inset: 0, background: "rgba(20,24,28,0.42)", backdropFilter: "blur(2px)",
  display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
};
const modalDialog = {
  background: "var(--surface)", borderRadius: 12, boxShadow: "var(--shadow-modal)",
  maxHeight: "92vh", overflow: "auto", border: "1px solid var(--border)",
};
const selectStyle = {
  width: "100%", padding: "8px 10px",
  background: "var(--surface)", border: "1px solid var(--border-2)", borderRadius: 6,
  fontSize: 13, color: "var(--ink)", outline: "none",
};

Object.assign(window, { DraftingView });
