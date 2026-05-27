// Team chat for a negotiation

const ChatView = ({ neg }) => {
  const [text, setText] = React.useState("");
  const [messages, setMessages] = React.useState(neg.chat);

  const send = () => {
    if (!text.trim()) return;
    setMessages(m => [...m, {
      id: Date.now(), author: "You", initials: "YO", color: "#1F4A47",
      time: "Just now", text,
    }]);
    setText("");
  };

  const channels = [
    { id: "team",      name: "# team",            unread: 0, active: true },
    { id: "art-18",    name: "# art-18-wages",    unread: 2 },
    { id: "art-19",    name: "# art-19-hw",       unread: 0 },
    { id: "art-21",    name: "# art-21-retiree",  unread: 4 },
    { id: "logistics", name: "# logistics",       unread: 0 },
    { id: "research",  name: "# research",        unread: 0 },
  ];

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      {/* Channel list */}
      <div style={{ width: 220, flexShrink: 0, borderRight: "1px solid var(--border)", background: "var(--surface-2)" }}>
        <div style={{ padding: "16px 18px 10px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Threads</div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>Posts the AI files under articles</div>
        </div>
        <div style={{ padding: "8px 8px" }}>
          {channels.map(c => (
            <button key={c.id} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 8,
              padding: "6px 10px", border: "none", borderRadius: 6,
              background: c.active ? "var(--primary-soft)" : "transparent",
              color: c.active ? "var(--primary-ink)" : "var(--ink-2)",
              fontSize: 13, fontWeight: c.active ? 600 : 500,
              cursor: "pointer", marginBottom: 1,
              fontFamily: "var(--font-mono)",
            }}>
              <span style={{ flex: 1, textAlign: "left" }}>{c.name}</span>
              {c.unread > 0 && <span style={{ background: "var(--signal-red)", color: "#fff", fontSize: 10, fontWeight: 600, padding: "0 5px", borderRadius: 999 }}>{c.unread}</span>}
            </button>
          ))}
        </div>

        <div style={{ padding: "8px 18px", marginTop: 12 }}>
          <Label style={{ marginBottom: 8 }}>Team</Label>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {neg.bargainingTeam.map(p => (
              <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ position: "relative" }}>
                  <Avatar {...p} size={22}/>
                  <span style={{ position: "absolute", bottom: -1, right: -1, width: 7, height: 7, borderRadius: "50%", background: "var(--signal-green)", border: "1.5px solid var(--surface-2)" }}/>
                </span>
                <span style={{ fontSize: 12.5, color: "var(--ink-2)" }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, background: "var(--bg)" }}>
        <div style={{ padding: "12px 24px", borderBottom: "1px solid var(--border)", background: "var(--surface)", display: "flex", alignItems: "center", gap: 12 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", fontFamily: "var(--font-mono)" }}># team</div>
            <div style={{ fontSize: 11.5, color: "var(--ink-3)" }}>{neg.bargainingTeam.length} members · private channel</div>
          </div>
          <div style={{ flex: 1 }}/>
          <button style={{ background: "transparent", border: "none", padding: 6, borderRadius: 5, color: "var(--ink-3)", cursor: "pointer" }}><I.Video size={16}/></button>
          <button style={{ background: "transparent", border: "none", padding: 6, borderRadius: 5, color: "var(--ink-3)", cursor: "pointer" }}><I.Users size={16}/></button>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "16px 24px" }}>
          <DayDivider label="Today"/>
          {messages.map(m => (
            <Message key={m.id} m={m}/>
          ))}
        </div>

        <div style={{ padding: "12px 24px 18px", borderTop: "1px solid var(--border)", background: "var(--surface)" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            background: "var(--surface)", border: "1px solid var(--border-2)",
            borderRadius: 8, padding: "8px 10px",
          }}>
            <button style={{ background: "transparent", border: "none", color: "var(--ink-3)", padding: 4, cursor: "pointer" }}><I.Paperclip size={15}/></button>
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="Message # team — type / for actions"
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 13.5 }}/>
            <button style={{ background: "transparent", border: "none", color: "var(--primary)", padding: 4, cursor: "pointer" }} onClick={send}>
              <I.Send size={15}/>
            </button>
          </div>
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 6, display: "flex", gap: 12 }}>
            <span><span style={{ fontFamily: "var(--font-mono)", background: "var(--bg-2)", padding: "1px 4px", borderRadius: 3 }}>/file</span> attach</span>
            <span><span style={{ fontFamily: "var(--font-mono)", background: "var(--bg-2)", padding: "1px 4px", borderRadius: 3 }}>/article</span> link a thread</span>
            <span><span style={{ fontFamily: "var(--font-mono)", background: "var(--bg-2)", padding: "1px 4px", borderRadius: 3 }}>/ai</span> ask AI</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const DayDivider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "10px 0 16px" }}>
    <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
    <span style={{ fontSize: 11, color: "var(--ink-3)", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: "var(--border)" }}/>
  </div>
);

const Message = ({ m }) => (
  <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
    <Avatar name={m.author} initials={m.initials} color={m.color} size={32}/>
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 2 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{m.author}</span>
        <span style={{ fontSize: 11, color: "var(--ink-3)" }}>{m.time}</span>
      </div>
      <div style={{ fontSize: 13.5, color: "var(--ink-2)", lineHeight: 1.55 }}>{m.text}</div>
      {m.attachment && (
        <div style={{ marginTop: 8, display: "inline-flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 7 }}>
          <FileBadge kind={m.attachment.type} size={24}/>
          <div>
            <div style={{ fontSize: 12.5, color: "var(--ink)", fontWeight: 500 }}>{m.attachment.name}</div>
            <div style={{ fontSize: 11, color: "var(--ink-3)" }}>Excel · Cost Models</div>
          </div>
        </div>
      )}
    </div>
  </div>
);

Object.assign(window, { ChatView });
