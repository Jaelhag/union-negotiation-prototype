// Sign-in button + signed-in user pill. Sits in the app shell.

function AuthPill({ onAuthChange }) {
  const [user, setUser] = React.useState(() => window.AUTH ? window.AUTH.getAccount() : null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!window.AUTH) return;
    // Refresh on initial mount (in case MSAL hadn't finished initializing
    // when this component first rendered).
    const t = setTimeout(() => setUser(window.AUTH.getAccount()), 200);
    const unsubscribe = window.AUTH.onChange(() => {
      setUser(window.AUTH.getAccount());
    });
    return () => { clearTimeout(t); unsubscribe(); };
  }, []);

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await window.AUTH.signIn();
      if (onAuthChange) onAuthChange();
    } catch (e) {
      alert("Sign-in failed: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await window.AUTH.signOut();
      if (onAuthChange) onAuthChange();
    } catch (e) {
      alert("Sign-out failed: " + (e.message || e));
    } finally {
      setLoading(false);
    }
  };

  // Initials for the avatar
  const initials = user
    ? (user.name || user.username || "").split(/[\s@]+/).filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase()
    : "";

  const baseBtnStyle = {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "6px 12px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 500,
    cursor: "pointer",
    border: "1px solid var(--border-2)",
    background: "var(--surface)",
    color: "var(--ink-2)",
    transition: "all 0.15s",
  };

  if (!user) {
    return (
      <button
        onClick={handleSignIn}
        disabled={loading}
        style={{
          ...baseBtnStyle,
          background: "var(--primary)",
          color: "white",
          border: "1px solid var(--primary)",
          opacity: loading ? 0.6 : 1,
        }}
        title="Sign in with your Microsoft account to load your real negotiation data"
      >
        <MicrosoftLogo/>
        {loading ? "Signing in…" : "Sign in with Microsoft"}
      </button>
    );
  }

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          padding: "4px 4px 4px 10px",
          borderRadius: 999,
          background: "var(--primary-soft)",
          color: "var(--primary-ink)",
          fontSize: 12,
          fontWeight: 500,
          border: "1px solid transparent",
        }}
        title={user.username}
      >
        <span>{user.name || user.username}</span>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22, height: 22,
          borderRadius: "50%",
          background: "var(--primary)",
          color: "white",
          fontSize: 10,
          fontWeight: 600,
          fontFamily: "var(--font-mono)",
        }}>{initials}</span>
      </div>
      <button
        onClick={handleSignOut}
        disabled={loading}
        style={{
          ...baseBtnStyle,
          padding: "6px 10px",
          fontSize: 11,
        }}
        title="Sign out"
      >
        {loading ? "…" : "Sign out"}
      </button>
    </div>
  );
}

const MicrosoftLogo = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" style={{ flexShrink: 0 }}>
    <rect x="0" y="0" width="7" height="7" fill="#F25022"/>
    <rect x="9" y="0" width="7" height="7" fill="#7FBA00"/>
    <rect x="0" y="9" width="7" height="7" fill="#00A4EF"/>
    <rect x="9" y="9" width="7" height="7" fill="#FFB900"/>
  </svg>
);

// Banner shown across the top when running on demo data vs. real data.
function DataSourceBanner({ isLive, isLoading, error, onRetry }) {
  if (isLoading) {
    return (
      <div style={{
        background: "var(--signal-blue-soft)",
        color: "var(--signal-blue)",
        padding: "6px 16px",
        fontSize: 12,
        textAlign: "center",
        borderBottom: "1px solid var(--border)",
      }}>
        Loading your real negotiation data from SharePoint…
      </div>
    );
  }
  if (error) {
    return (
      <div style={{
        background: "var(--signal-red-soft)",
        color: "var(--signal-red)",
        padding: "6px 16px",
        fontSize: 12,
        textAlign: "center",
        borderBottom: "1px solid var(--border)",
      }}>
        Couldn't load real data: {error}.{" "}
        <button onClick={onRetry} style={{
          background: "transparent",
          border: "none",
          color: "inherit",
          textDecoration: "underline",
          cursor: "pointer",
          fontSize: 12,
          padding: 0,
        }}>Retry</button>
        {" — showing demo data."}
      </div>
    );
  }
  if (isLive) {
    return (
      <div style={{
        background: "var(--signal-green-soft)",
        color: "var(--signal-green)",
        padding: "6px 16px",
        fontSize: 12,
        textAlign: "center",
        borderBottom: "1px solid var(--border)",
      }}>
        Live data from SharePoint
      </div>
    );
  }
  return (
    <div style={{
      background: "var(--bg-2)",
      color: "var(--ink-3)",
      padding: "6px 16px",
      fontSize: 12,
      textAlign: "center",
      borderBottom: "1px solid var(--border)",
    }}>
      Showing demo data. Sign in with Microsoft (top right) to load your real negotiations.
    </div>
  );
}
