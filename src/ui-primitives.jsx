// Shared visual primitives

const Avatar = ({ name, initials, color = "#6B7280", size = 28, ring }) => (
  <div title={name} style={{
    width: size, height: size, borderRadius: "50%",
    background: color, color: "#fff",
    display: "inline-flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.38, fontWeight: 600, letterSpacing: "0.02em",
    flexShrink: 0,
    boxShadow: ring ? `0 0 0 2px var(--surface), 0 0 0 ${2 + (ring === true ? 1 : 0)}px ${color}` : "none",
  }}>{initials}</div>
);

const AvatarStack = ({ people, max = 4, size = 24 }) => {
  const visible = people.slice(0, max);
  const rest = people.length - visible.length;
  return (
    <div style={{ display: "inline-flex", alignItems: "center" }}>
      {visible.map((p, i) => (
        <div key={p.name} style={{ marginLeft: i === 0 ? 0 : -8, border: "2px solid var(--surface)", borderRadius: "50%", display: "inline-flex" }}>
          <Avatar {...p} size={size} />
        </div>
      ))}
      {rest > 0 && (
        <div style={{
          marginLeft: -8, width: size, height: size, borderRadius: "50%",
          background: "var(--bg-2)", color: "var(--ink-3)",
          border: "2px solid var(--surface)",
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          fontSize: size * 0.36, fontWeight: 600,
        }}>+{rest}</div>
      )}
    </div>
  );
};

// Status pill
const STATUS = {
  ta:        { bg: "var(--signal-green-soft)", fg: "var(--signal-green)", label: "TA reached" },
  tentative: { bg: "var(--accent-amber-soft)", fg: "var(--accent-amber)", label: "Tentative" },
  open:      { bg: "var(--signal-blue-soft)", fg: "var(--signal-blue)", label: "Open" },
  active:    { bg: "var(--signal-green-soft)", fg: "var(--signal-green)", label: "Active" },
  ratified:  { bg: "var(--bg-2)", fg: "var(--ink-3)", label: "Ratified" },
  scheduled: { bg: "var(--bg-2)", fg: "var(--ink-3)", label: "Scheduled" },
  high:      { bg: "var(--signal-red-soft)", fg: "var(--signal-red)", label: "High" },
  med:       { bg: "var(--accent-amber-soft)", fg: "var(--accent-amber)", label: "Med" },
  low:       { bg: "var(--bg-2)", fg: "var(--ink-3)", label: "Low" },
  econ:      { bg: "var(--accent-amber-soft)", fg: "var(--accent-amber)", label: "Economic" },
  "non-econ":{ bg: "var(--bg-2)", fg: "var(--ink-3)", label: "Non-econ" },
};

const Pill = ({ kind, children, dot, style }) => {
  const c = STATUS[kind] || { bg: "var(--bg-2)", fg: "var(--ink-3)" };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: c.bg, color: c.fg,
      fontSize: 11.5, fontWeight: 500, letterSpacing: "0.02em",
      padding: "3px 8px", borderRadius: 999, lineHeight: 1.3,
      whiteSpace: "nowrap",
      ...style,
    }}>
      {dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.fg, display: "inline-block" }} />}
      {children || c.label}
    </span>
  );
};

const Btn = ({ children, variant = "secondary", size = "md", icon, onClick, disabled, style, type = "button" }) => {
  const base = {
    display: "inline-flex", alignItems: "center", gap: 6,
    border: "1px solid transparent", borderRadius: 7,
    fontWeight: 500, fontSize: size === "sm" ? 12.5 : 13.5,
    padding: size === "sm" ? "5px 10px" : "7px 13px",
    transition: "all .12s",
    whiteSpace: "nowrap",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    letterSpacing: "-0.005em",
  };
  const variants = {
    primary: { background: "var(--primary)", color: "#fff", borderColor: "var(--primary)" },
    secondary: { background: "var(--surface)", color: "var(--ink)", borderColor: "var(--border-2)" },
    ghost: { background: "transparent", color: "var(--ink-2)", borderColor: "transparent" },
    danger: { background: "var(--surface)", color: "var(--signal-red)", borderColor: "var(--border-2)" },
    tinted: { background: "var(--primary-soft)", color: "var(--primary-ink)", borderColor: "transparent" },
  };
  return (
    <button type={type} disabled={disabled} onClick={onClick}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = "brightness(.96)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = "none"; }}
      style={{ ...base, ...variants[variant], ...style }}>
      {icon}{children}
    </button>
  );
};

// Card
const Card = ({ children, style, padding, onClick, interactive, ...rest }) => (
  <div onClick={onClick} {...rest} style={{
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 10,
    boxShadow: "var(--shadow-1)",
    padding: padding ?? 18,
    cursor: interactive || onClick ? "pointer" : "default",
    transition: "border-color .15s, box-shadow .15s, transform .15s",
    ...(interactive && {
      ":hover": { borderColor: "var(--border-2)" },
    }),
    ...style,
  }}>{children}</div>
);

// Sectioned label
const Label = ({ children, style }) => (
  <div style={{
    fontSize: 10.5, fontWeight: 600, color: "var(--ink-3)",
    textTransform: "uppercase", letterSpacing: "0.08em",
    ...style,
  }}>{children}</div>
);

// Side / circular topic indicator
const SideChip = ({ side, size = 18, label }) => {
  const cfg = {
    union:    { bg: "var(--primary)", fg: "#fff", short: "U" },
    employer: { bg: "var(--ink-2)",   fg: "#fff", short: "E" },
    joint:    { bg: "var(--accent-amber)", fg: "#fff", short: "•" },
    system:   { bg: "var(--ink-3)",   fg: "#fff", short: "AI" },
  }[side] || { bg: "var(--ink-3)", fg: "#fff", short: "?" };
  return (
    <span style={{
      width: size, height: size, borderRadius: 4,
      background: cfg.bg, color: cfg.fg,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.5, fontWeight: 700, letterSpacing: 0,
      flexShrink: 0, fontFamily: "var(--font-mono)",
    }}>{label || cfg.short}</span>
  );
};

// AI note banner (subtle)
const AINote = ({ children }) => (
  <div style={{
    display: "flex", gap: 10, alignItems: "flex-start",
    background: "linear-gradient(180deg, color-mix(in oklab, var(--primary) 6%, var(--surface)), var(--surface))",
    border: "1px solid color-mix(in oklab, var(--primary) 18%, var(--border))",
    borderRadius: 8, padding: "10px 12px",
    fontSize: 13, color: "var(--ink-2)",
    fontFamily: "var(--font-serif)", fontStyle: "italic",
    lineHeight: 1.5,
  }}>
    <I.Sparkle size={14} style={{ color: "var(--primary)", marginTop: 2, flexShrink: 0 }} />
    <div>{children}</div>
  </div>
);

// Section header
const SectionHead = ({ title, subtitle, actions, style }) => (
  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14, gap: 16, ...style }}>
    <div>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: "-0.015em", color: "var(--ink)" }}>{title}</h2>
      {subtitle && <div style={{ marginTop: 2, fontSize: 13, color: "var(--ink-3)" }}>{subtitle}</div>}
    </div>
    {actions}
  </div>
);

// Empty state
const Empty = ({ title, body, action }) => (
  <div style={{
    border: "1px dashed var(--border-2)", borderRadius: 10,
    padding: "32px 24px", textAlign: "center",
    color: "var(--ink-3)",
    background: "var(--surface-2)",
  }}>
    <div style={{ fontSize: 14, fontWeight: 500, color: "var(--ink-2)", marginBottom: 4 }}>{title}</div>
    {body && <div style={{ fontSize: 13, maxWidth: 340, margin: "0 auto" }}>{body}</div>}
    {action && <div style={{ marginTop: 14 }}>{action}</div>}
  </div>
);

Object.assign(window, { Avatar, AvatarStack, Pill, Btn, Card, Label, SideChip, AINote, SectionHead, Empty, STATUS });
