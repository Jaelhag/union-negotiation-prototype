// New Negotiation modal — single quick form that auto-creates the folder structure

const NewNegotiationModal = ({ onClose, onCreate }) => {
  const [step, setStep] = React.useState("form"); // "form" | "creating" | "done"
  const [form, setForm] = React.useState({
    name: "",
    client: "",
    employer: "",
    cbaExpires: "",
    firstSession: "",
    memberCount: "",
    industry: "Public sector",
    template: "standard",
    teams: true, zoom: false, outlook: true, sharepoint: true,
  });

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const canCreate = form.name && form.client && form.employer;

  const handleCreate = () => {
    setStep("creating");
    setTimeout(() => setStep("done"), 1400);
  };

  return (
    <div style={overlay} onClick={onClose}>
      <div style={dialog} onClick={(e) => e.stopPropagation()}>
        {step === "form" && (
          <>
            <ModalHeader title="New negotiation" subtitle="Sets up the full workspace — folders, channels, calendar, and AI threads. About 30 seconds of work."
              onClose={onClose}/>
            <div style={{ padding: "20px 28px 24px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Short name" hint="Display name in the sidebar" full>
                <input style={inputStyle} placeholder="e.g. IBEW Local 1430"
                  value={form.name} onChange={(e) => update("name", e.target.value)} autoFocus/>
              </Field>
              <Field label="Bargaining unit / client">
                <input style={inputStyle} placeholder="e.g. International Brotherhood of Electrical Workers, Local 1430"
                  value={form.client} onChange={(e) => update("client", e.target.value)}/>
              </Field>
              <Field label="Employer / counterpart">
                <input style={inputStyle} placeholder="e.g. ConEd Westchester Operations"
                  value={form.employer} onChange={(e) => update("employer", e.target.value)}/>
              </Field>
              <Field label="Members in unit (approx)">
                <input style={inputStyle} placeholder="e.g. 412" type="number"
                  value={form.memberCount} onChange={(e) => update("memberCount", e.target.value)}/>
              </Field>
              <Field label="Industry / sector">
                <select style={inputStyle} value={form.industry} onChange={(e) => update("industry", e.target.value)}>
                  <option>Public sector</option>
                  <option>Utilities / Electrical</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>Hospitality / Gaming</option>
                  <option>Transit</option>
                  <option>Building trades</option>
                  <option>Other</option>
                </select>
              </Field>
              <Field label="Current CBA expires">
                <input style={inputStyle} type="date"
                  value={form.cbaExpires} onChange={(e) => update("cbaExpires", e.target.value)}/>
              </Field>
              <Field label="First bargaining session">
                <input style={inputStyle} type="date"
                  value={form.firstSession} onChange={(e) => update("firstSession", e.target.value)}/>
              </Field>

              {/* Template selector — full width */}
              <div style={{ gridColumn: "1 / -1", marginTop: 6 }}>
                <Label style={{ marginBottom: 8 }}>Folder & article template</Label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                  {TEMPLATES.map(t => (
                    <TemplateCard key={t.id} t={t}
                      selected={form.template === t.id}
                      onClick={() => update("template", t.id)} />
                  ))}
                </div>
              </div>

              {/* Integrations */}
              <div style={{ gridColumn: "1 / -1", marginTop: 8 }}>
                <Label style={{ marginBottom: 8 }}>Connect</Label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <Toggle label="SharePoint folders" sub="Auto-create site"  on={form.sharepoint} onClick={() => update("sharepoint", !form.sharepoint)}/>
                  <Toggle label="Outlook calendar"   sub="Sync sessions"     on={form.outlook}    onClick={() => update("outlook",    !form.outlook)}/>
                  <Toggle label="Teams channel"      sub="Caucus + chat"     on={form.teams}      onClick={() => update("teams",      !form.teams)}/>
                  <Toggle label="Zoom"               sub="Session recording" on={form.zoom}       onClick={() => update("zoom",       !form.zoom)}/>
                </div>
              </div>
            </div>

            <ModalFooter
              left={<span style={{ fontSize: 12, color: "var(--ink-3)" }}>Workspace ready in ~30s. You can edit anything later.</span>}
              right={<>
                <Btn variant="ghost" onClick={onClose}>Cancel</Btn>
                <Btn variant="primary" icon={<I.Plus size={13}/>} disabled={!canCreate} onClick={handleCreate}>Create workspace</Btn>
              </>}
            />
          </>
        )}

        {step === "creating" && (
          <CreatingState form={form} />
        )}

        {step === "done" && (
          <DoneState form={form} onOpen={() => onCreate(form)} />
        )}
      </div>
    </div>
  );
};

const TEMPLATES = [
  { id: "standard",   name: "Standard CBA renewal",  desc: "Full 9-folder structure with article tracker",  art: 28, recommended: true },
  { id: "first",      name: "First contract",        desc: "Newly certified unit. Heavier on non-econ template language.", art: 22 },
  { id: "reopener",   name: "Mid-term reopener",     desc: "Narrow scope. Wages + selected articles only.", art: 6 },
];

const TemplateCard = ({ t, selected, onClick }) => (
  <button onClick={onClick} style={{
    textAlign: "left", padding: "10px 12px",
    background: selected ? "var(--primary-soft)" : "var(--surface)",
    border: "1px solid " + (selected ? "var(--primary)" : "var(--border)"),
    borderRadius: 8, cursor: "pointer",
    transition: "all .12s",
    position: "relative",
  }}>
    {t.recommended && (
      <span style={{ position: "absolute", top: -7, right: 10, background: "var(--accent-amber)", color: "#fff", fontSize: 9.5, fontWeight: 600, padding: "1px 6px", borderRadius: 3, letterSpacing: "0.04em" }}>RECOMMENDED</span>
    )}
    <div style={{ fontSize: 13, fontWeight: 600, color: selected ? "var(--primary-ink)" : "var(--ink)" }}>{t.name}</div>
    <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 4, lineHeight: 1.35 }}>{t.desc}</div>
    <div style={{ fontSize: 10.5, color: "var(--ink-3)", marginTop: 6, fontFamily: "var(--font-mono)" }}>{t.art} article slots</div>
  </button>
);

const Toggle = ({ label, sub, on, onClick }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 10,
    padding: "8px 12px",
    background: on ? "var(--surface)" : "var(--bg-2)",
    border: "1px solid " + (on ? "var(--border-2)" : "var(--border)"),
    borderRadius: 7, cursor: "pointer",
    transition: "all .12s",
    minWidth: 180,
  }}>
    <div style={{
      width: 28, height: 16, borderRadius: 999,
      background: on ? "var(--primary)" : "var(--border-2)",
      position: "relative", flexShrink: 0,
      transition: "background .15s",
    }}>
      <div style={{
        width: 12, height: 12, borderRadius: "50%", background: "#fff",
        position: "absolute", top: 2, left: on ? 14 : 2,
        transition: "left .15s",
      }}/>
    </div>
    <div style={{ textAlign: "left" }}>
      <div style={{ fontSize: 12.5, fontWeight: 500, color: "var(--ink)" }}>{label}</div>
      <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{sub}</div>
    </div>
  </button>
);

const CreatingState = ({ form }) => {
  const steps = [
    "Creating SharePoint site structure…",
    "Provisioning 9 folders (Our/Their Proposals, Caucus, Articles, TAs, Final…)",
    "Linking Outlook calendar — first session penciled in",
    "Spinning up Teams caucus channel",
    "Training AI on prior CBAs for " + (form.industry || "your industry"),
    "Generating article tracker slots",
    "Ready",
  ];
  const [done, setDone] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setDone(d => Math.min(d + 1, steps.length)), 180);
    return () => clearInterval(t);
  }, []);
  return (
    <div style={{ padding: "60px 40px 40px", minHeight: 380 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 28 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--primary-soft)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <I.Sparkle size={18}/>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "var(--ink)" }}>Creating <span style={{ fontFamily: "var(--font-serif)", fontStyle: "italic" }}>{form.name || "your workspace"}</span></div>
          <div style={{ fontSize: 13, color: "var(--ink-3)" }}>This usually takes about 30 seconds.</div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, opacity: i < done ? 1 : i === done ? 0.7 : 0.3, transition: "opacity .3s" }}>
            <div style={{ width: 18, height: 18, borderRadius: "50%", background: i < done ? "var(--signal-green-soft)" : "var(--bg-2)", color: "var(--signal-green)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {i < done && <I.Check size={11}/>}
            </div>
            <div style={{ fontSize: 13, color: "var(--ink-2)" }}>{s}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const DoneState = ({ form, onOpen }) => (
  <div style={{ padding: "48px 40px 36px", textAlign: "center" }}>
    <div style={{ width: 56, height: 56, borderRadius: "50%", background: "var(--signal-green-soft)", color: "var(--signal-green)", margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <I.Check size={28}/>
    </div>
    <h2 style={{ margin: "0 0 4px", fontFamily: "var(--font-serif)", fontSize: 22, fontWeight: 500, letterSpacing: "-0.015em" }}>Workspace ready</h2>
    <div style={{ fontSize: 13.5, color: "var(--ink-3)", marginBottom: 24 }}>
      <span style={{ color: "var(--ink-2)", fontWeight: 500 }}>{form.name}</span> is set up with 9 folders, an article tracker, and a Teams caucus channel.
    </div>
    <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
      <Btn variant="primary" icon={<I.ArrowRight size={13}/>} onClick={onOpen}>Open workspace</Btn>
    </div>
  </div>
);

const ModalHeader = ({ title, subtitle, onClose }) => (
  <div style={{ padding: "20px 28px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 16 }}>
    <div style={{ flex: 1 }}>
      <h2 style={{ margin: 0, fontSize: 19, fontWeight: 600, letterSpacing: "-0.015em", color: "var(--ink)" }}>{title}</h2>
      {subtitle && <div style={{ marginTop: 4, fontSize: 13, color: "var(--ink-3)", maxWidth: 540 }}>{subtitle}</div>}
    </div>
    <button onClick={onClose} style={{ background: "transparent", border: "none", padding: 6, borderRadius: 6, color: "var(--ink-3)", cursor: "pointer" }}>
      <I.X size={18}/>
    </button>
  </div>
);

const ModalFooter = ({ left, right }) => (
  <div style={{ padding: "14px 28px", borderTop: "1px solid var(--border)", background: "var(--surface-2)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, borderRadius: "0 0 12px 12px" }}>
    <div>{left}</div>
    <div style={{ display: "flex", gap: 8 }}>{right}</div>
  </div>
);

const Field = ({ label, hint, children, full }) => (
  <div style={{ gridColumn: full ? "1 / -1" : "auto" }}>
    <Label style={{ marginBottom: 6 }}>{label}</Label>
    {children}
    {hint && <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4 }}>{hint}</div>}
  </div>
);

const inputStyle = {
  width: "100%", padding: "8px 10px",
  background: "var(--surface)",
  border: "1px solid var(--border-2)", borderRadius: 6,
  fontSize: 13, color: "var(--ink)", outline: "none",
  transition: "border-color .15s",
};

const overlay = {
  position: "fixed", inset: 0, background: "rgba(20,24,28,0.42)",
  backdropFilter: "blur(2px)",
  display: "flex", alignItems: "center", justifyContent: "center",
  zIndex: 100, padding: 20,
  animation: "fadeIn .15s ease-out",
};

const dialog = {
  width: "min(720px, 100%)",
  background: "var(--surface)",
  borderRadius: 12,
  boxShadow: "var(--shadow-modal)",
  maxHeight: "92vh", overflow: "auto",
  border: "1px solid var(--border)",
};

Object.assign(window, { NewNegotiationModal });
