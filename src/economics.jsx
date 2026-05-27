// Economics — cost calculator / package model

const EconomicsView = ({ neg }) => {
  const [model, setModel] = React.useState({
    wageY1: 5.5, wageY2: 4.0, wageY3: 2.5, years: 3,
    hwShare: 1.0, // % member contribution
    pensionAdd: 1.20, // $ per hour
    bonus: 750, // signing bonus
  });

  const baseSalary = 92500; // avg wage IBEW 1430 inside wireman
  const members = neg.members;

  const wageCostY1 = baseSalary * (model.wageY1 / 100) * members;
  const wageCostY2 = baseSalary * ((1 + model.wageY1/100) * (model.wageY2 / 100)) * members;
  const wageCostY3 = baseSalary * ((1 + model.wageY1/100) * (1 + model.wageY2/100) * (model.wageY3 / 100)) * members;
  const totalWage = wageCostY1 + wageCostY2 + wageCostY3;

  const hwCost = -model.hwShare * 13000 * members; // savings — member pays share of $13K premium
  const pensionCost = model.pensionAdd * 2080 * members; // $/hr × 2080 hrs
  const bonusCost = model.bonus * members;

  const annualAvg = (totalWage + hwCost + pensionCost) / model.years;
  const grandTotal = totalWage + hwCost * model.years + pensionCost * model.years + bonusCost;

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
      <div style={{ padding: "24px 32px 64px", maxWidth: 1280, margin: "0 auto" }}>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <h1 style={{ margin: 0, fontFamily: "var(--font-serif)", fontSize: 28, fontWeight: 500, letterSpacing: "-0.018em" }}>Economic package model</h1>
            <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
              {neg.members} members · base wage {`$${baseSalary.toLocaleString()}`} · model v3
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn variant="ghost" icon={<I.Download size={13}/>}>Export</Btn>
            <Btn variant="secondary" icon={<I.Doc size={13}/>}>Open in Excel</Btn>
            <Btn variant="primary" icon={<I.Sparkle size={13}/>}>Compare scenarios</Btn>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "minmax(340px, 1fr) 2fr", gap: 16 }}>
          {/* Inputs */}
          <Card padding={0}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Inputs</div>
              <div style={{ fontSize: 12, color: "var(--ink-3)" }}>Move sliders to model</div>
            </div>
            <div style={{ padding: "18px 20px" }}>
              <SubSection label="Wages">
                <ModelSlider label="Year 1 increase" value={model.wageY1} setValue={(v) => setModel(m => ({...m, wageY1: v}))} suffix="%" min={0} max={10} step={0.25}/>
                <ModelSlider label="Year 2 increase" value={model.wageY2} setValue={(v) => setModel(m => ({...m, wageY2: v}))} suffix="%" min={0} max={8} step={0.25}/>
                <ModelSlider label="Year 3 increase" value={model.wageY3} setValue={(v) => setModel(m => ({...m, wageY3: v}))} suffix="%" min={0} max={8} step={0.25}/>
              </SubSection>

              <SubSection label="Other">
                <ModelSlider label="Member H&W share" value={model.hwShare} setValue={(v) => setModel(m => ({...m, hwShare: v}))} suffix="%" min={0} max={5} step={0.1}/>
                <ModelSlider label="Pension add" value={model.pensionAdd} setValue={(v) => setModel(m => ({...m, pensionAdd: v}))} suffix="/hr" prefix="$" min={0} max={3} step={0.05}/>
                <ModelSlider label="Signing bonus" value={model.bonus} setValue={(v) => setModel(m => ({...m, bonus: v}))} prefix="$" min={0} max={2500} step={50}/>
              </SubSection>
            </div>
          </Card>

          {/* Output */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Card padding={20}>
              <Label>Total package — 3 years</Label>
              <div style={{ fontSize: 44, fontFamily: "var(--font-serif)", fontWeight: 500, color: "var(--ink)", letterSpacing: "-0.025em", lineHeight: 1, marginTop: 6 }}>
                ${(grandTotal / 1000000).toFixed(2)}M
              </div>
              <div style={{ fontSize: 13, color: "var(--ink-3)", marginTop: 4 }}>
                ~${(annualAvg / 1000).toFixed(0)}K/yr avg · ${(grandTotal / members / model.years).toFixed(0)}/member/yr
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 20 }}>
                <Stat2 label="Wages (3yr)"   value={`$${(totalWage / 1000).toFixed(0)}K`} sub={`${model.wageY1 + model.wageY2 + model.wageY3}% total`}/>
                <Stat2 label="H&W (3yr)"     value={`$${(hwCost * 3 / 1000).toFixed(0)}K`} sub={`-${model.hwShare}% to members`} tone="savings"/>
                <Stat2 label="Pension (3yr)" value={`$${(pensionCost * 3 / 1000).toFixed(0)}K`} sub={`+$${model.pensionAdd}/hr`}/>
                <Stat2 label="Bonus"         value={`$${(bonusCost / 1000).toFixed(0)}K`} sub="one-time"/>
              </div>
            </Card>

            {/* Compare */}
            <Card padding={0}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--border)" }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Compared with positions on the table</div>
              </div>
              <div>
                <CompareRow side="Your draft (current)" amount={grandTotal} highlight scenario="3yr"/>
                <CompareRow side="Last employer counter — May 20" amount={1620000} scenario="8.5% / 4yr"/>
                <CompareRow side="Last union counter — May 13" amount={3120000} scenario="14% / 3yr"/>
                <CompareRow side="Employer opener — May 13" amount={1140000} scenario="6% / 4yr"/>
                <CompareRow side="Union opener — May 6" amount={4350000} scenario="18% / 3yr" last/>
              </div>
            </Card>
          </div>
        </div>

      </div>
    </div>
  );
};

const SubSection = ({ label, children }) => (
  <div style={{ marginBottom: 22 }}>
    <Label style={{ marginBottom: 10 }}>{label}</Label>
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
  </div>
);

const ModelSlider = ({ label, value, setValue, suffix = "", prefix = "", min, max, step }) => (
  <div>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
      <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{label}</span>
      <span style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 600, fontFamily: "var(--font-mono)" }}>
        {prefix}{typeof value === "number" ? (step < 1 ? value.toFixed(step < 0.1 ? 2 : 2) : value) : value}{suffix}
      </span>
    </div>
    <input type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => setValue(parseFloat(e.target.value))}
      style={{ width: "100%", accentColor: "var(--primary)" }}/>
  </div>
);

const Stat2 = ({ label, value, sub, tone }) => (
  <div>
    <div style={{ fontSize: 10.5, color: "var(--ink-3)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 500 }}>{label}</div>
    <div style={{ fontSize: 17, fontFamily: "var(--font-mono)", fontWeight: 500, color: tone === "savings" ? "var(--signal-green)" : "var(--ink)", marginTop: 4 }}>{value}</div>
    <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 1 }}>{sub}</div>
  </div>
);

const CompareRow = ({ side, amount, scenario, highlight, last }) => (
  <div style={{
    padding: "12px 18px", borderBottom: last ? "none" : "1px solid var(--border)",
    display: "grid", gridTemplateColumns: "1fr 100px 140px", alignItems: "center",
    gap: 12,
    background: highlight ? "var(--primary-soft)" : "transparent",
  }}>
    <div>
      <div style={{ fontSize: 13, fontWeight: highlight ? 600 : 500, color: highlight ? "var(--primary-ink)" : "var(--ink)" }}>{side}</div>
      <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 1 }}>{scenario}</div>
    </div>
    <div style={{ fontSize: 14, fontFamily: "var(--font-mono)", fontWeight: 500, color: "var(--ink)", textAlign: "right" }}>${(amount / 1000000).toFixed(2)}M</div>
    <div style={{ height: 6, background: "var(--bg-2)", borderRadius: 999, overflow: "hidden", position: "relative" }}>
      <div style={{ height: "100%", width: Math.min(100, amount / 4500000 * 100) + "%", background: highlight ? "var(--primary)" : "var(--ink-3)", borderRadius: 999 }}/>
    </div>
  </div>
);

Object.assign(window, { EconomicsView });
