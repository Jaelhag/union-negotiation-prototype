// Files view — shows the auto-generated 9-folder structure

const FilesView = ({ neg }) => {
  const [activeFolder, setActiveFolder] = React.useState(neg.folders[0].id);
  const [dragOver, setDragOver] = React.useState(false);
  const [uploadFeedback, setUploadFeedback] = React.useState(null);
  const folder = neg.folders.find(f => f.id === activeFolder);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const names = [...(e.dataTransfer?.files || [])].map(f => f.name);
    if (names.length === 0) return;
    setUploadFeedback({ count: names.length, names });
    setTimeout(() => setUploadFeedback(null), 4500);
  };

  return (
    <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
      {/* Folder tree */}
      <div style={{
        width: 280, flexShrink: 0,
        borderRight: "1px solid var(--border)",
        background: "var(--surface-2)",
        display: "flex", flexDirection: "column",
      }}>
        <div style={{ padding: "16px 18px 12px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <div style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)" }}>Workspace</div>
            <button style={{ background: "transparent", border: "none", color: "var(--ink-3)", padding: 4, cursor: "pointer" }} title="New folder">
              <I.Plus size={14}/>
            </button>
          </div>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", display: "flex", alignItems: "center", gap: 5 }}>
            <I.Sparkle size={11} style={{ color: "var(--primary)" }}/>
            Auto-structured for negotiations
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
          {neg.folders.map(f => (
            <FolderTreeItem key={f.id} folder={f}
              active={activeFolder === f.id}
              onClick={() => setActiveFolder(f.id)} />
          ))}
        </div>

        <div style={{ padding: "10px 16px", borderTop: "1px solid var(--border)", fontSize: 11, color: "var(--ink-3)", lineHeight: 1.5 }}>
          Synced to SharePoint · {neg.folders.reduce((acc, f) => acc + (f.children?.length || 0), 0)} files · 12.4 MB
        </div>
      </div>

      {/* Folder contents */}
      <div style={{ flex: 1, overflowY: "auto", background: "var(--bg)" }}>
        <div style={{ padding: "24px 32px 64px", maxWidth: 1100 }}>
          {/* Upload drop zone — top of files */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            style={{
              background: dragOver ? "var(--primary-soft)" : "var(--surface-2)",
              border: "1.5px dashed " + (dragOver ? "var(--primary)" : "var(--border-2)"),
              borderRadius: 10, padding: "14px 18px",
              display: "flex", alignItems: "center", gap: 14,
              transition: "all .15s",
              cursor: "pointer",
              marginBottom: 18,
            }}>
            <div style={{ width: 40, height: 40, borderRadius: 9, background: dragOver ? "var(--primary)" : "var(--bg-2)", color: dragOver ? "#fff" : "var(--ink-3)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <I.Upload size={17}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", display: "flex", alignItems: "center", gap: 8 }}>
                {uploadFeedback ? `Routing ${uploadFeedback.count} file${uploadFeedback.count !== 1 ? 's' : ''}…` : "Drop files anywhere to upload"}
                <I.Sparkle size={12} style={{ color: "var(--primary)" }}/>
              </div>
              <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2, lineHeight: 1.4 }}>
                {uploadFeedback
                  ? `${uploadFeedback.names.slice(0, 2).join(", ")}${uploadFeedback.names.length > 2 ? ` + ${uploadFeedback.names.length - 2} more` : ""} — AI tags and files by article.`
                  : "Word, PDF, Excel, audio. AI auto-routes to the right article folder, summarizes, and updates the proposal history."}
              </div>
            </div>
            <Btn variant="secondary" icon={<I.Upload size={13}/>}>Choose files</Btn>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18, gap: 16 }}>
            <div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 4 }}>
                {neg.name} / Workspace
              </div>
              <h1 style={{ margin: "0 0 4px", fontFamily: "var(--font-serif)", fontSize: 26, fontWeight: 500, letterSpacing: "-0.018em", color: "var(--ink)" }}>{folder.name}</h1>
              <div style={{ fontSize: 13, color: "var(--ink-3)" }}>{folder.meta}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <Btn variant="primary" icon={<I.Plus size={13}/>}>New file</Btn>
            </div>
          </div>

          {/* Folder-specific banner */}
          {folder.id === "by-article" && (
            <div style={{ marginBottom: 18 }}>
              <AINote>
                Each subfolder is an AI-tracked thread for one article. When you upload a proposal — yours or theirs — the AI files it in the right thread, summarizes the move, and updates the back-and-forth history.
              </AINote>
            </div>
          )}
          {folder.id === "caucus" && (
            <div style={{ marginBottom: 18 }}>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--signal-red-soft)", color: "var(--signal-red)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <I.Lock size={16}/>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Caucus Room — private to your side</div>
                  <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>Layered on Teams/Zoom. Recordings transcribed and AI-summarized as caucus notes.</div>
                </div>
                <Btn variant="primary" icon={<I.Video size={13}/>}>Start caucus</Btn>
              </div>
            </div>
          )}

          {/* File grid */}
          <FileList folder={folder}/>
        </div>
      </div>
    </div>
  );
};

const FolderTreeItem = ({ folder, active, onClick }) => {
  const folderColor = {
    "our-proposals":  "var(--primary)",
    "their-proposals": "var(--ink-2)",
    "by-article":     "var(--accent-amber)",
    "caucus":         "var(--signal-red)",
    "review":         "var(--signal-blue)",
    "tentative":      "var(--accent-amber)",
    "final":          "var(--signal-green)",
    "research":       "var(--ink-3)",
    "correspondence": "var(--ink-3)",
  }[folder.id] || "var(--ink-3)";

  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left",
      padding: "8px 14px 8px 18px",
      background: active ? "var(--surface)" : "transparent",
      borderLeft: "3px solid " + (active ? folderColor : "transparent"),
      border: "none",
      display: "flex", alignItems: "center", gap: 10,
      cursor: "pointer",
      transition: "background .1s",
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--bg-2)"; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}>
      <div style={{
        width: 22, height: 22, borderRadius: 5,
        background: active ? folderColor : "color-mix(in oklab, " + folderColor + " 12%, transparent)",
        color: active ? "#fff" : folderColor,
        display: "flex", alignItems: "center", justifyContent: "center",
        flexShrink: 0,
      }}>
        {folder.id === "caucus" ? <I.Lock size={11}/> :
         folder.id === "final" ? <I.Check size={12}/> :
         folder.id === "by-article" ? <I.Sparkle size={11}/> :
         folder.id === "correspondence" ? <I.Inbox size={11}/> :
         <I.Folder size={12}/>}
      </div>
      <div style={{ flex: 1, minWidth: 0, fontSize: 12.5, fontWeight: active ? 600 : 500, color: active ? "var(--ink)" : "var(--ink-2)", lineHeight: 1.3 }}>
        {folder.name}
      </div>
      {folder.children && (
        <span style={{ fontSize: 10.5, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>
          {folder.children.length}
        </span>
      )}
    </button>
  );
};

const FileList = ({ folder }) => {
  if (!folder.children || folder.children.length === 0) {
    return <Empty title="Empty folder" body="Drag files here, or use Upload."/>;
  }

  // Article threads — render special
  if (folder.id === "by-article") {
    return (
      <div style={{ display: "grid", gap: 8 }}>
        {folder.children.map(child => (
          <ArticleThreadRow key={child.id} thread={child}/>
        ))}
      </div>
    );
  }

  return (
    <Card padding={0}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 110px 100px 110px",
        padding: "10px 18px", borderBottom: "1px solid var(--border)",
        fontSize: 11, fontWeight: 600, color: "var(--ink-3)",
        textTransform: "uppercase", letterSpacing: "0.06em",
        background: "var(--surface-2)",
      }}>
        <div>Name</div>
        <div>Size</div>
        <div>Modified</div>
        <div></div>
      </div>
      {folder.children.map((f, i, arr) => (
        f.kind === "folder" ? (
          <SubfolderRow key={f.id} folder={f} last={i === arr.length - 1}/>
        ) : (
          <FileRow key={f.id} file={f} folder={folder} last={i === arr.length - 1}/>
        )
      ))}
    </Card>
  );
};

const FileRow = ({ file, folder, last }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "1fr 110px 100px 110px", alignItems: "center",
    padding: "10px 18px",
    borderBottom: last ? "none" : "1px solid var(--border)",
    cursor: "pointer", transition: "background .1s",
  }}
  onMouseEnter={(e) => e.currentTarget.style.background = "var(--surface-2)"}
  onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>
    <div style={{ display: "flex", alignItems: "center", gap: 12, minWidth: 0 }}>
      <FileBadge kind={file.kind}/>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{file.name}</div>
        {file.taDate && (
          <div style={{ fontSize: 11, color: "var(--signal-green)", marginTop: 2 }}>TA'd {file.taDate}</div>
        )}
        {file.count && (
          <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 2 }}>{file.count} messages</div>
        )}
      </div>
    </div>
    <div style={{ fontSize: 12, color: "var(--ink-3)", fontFamily: "var(--font-mono)" }}>{file.size || "—"}</div>
    <div style={{ fontSize: 12, color: "var(--ink-3)" }}>{file.modified || "—"}</div>
    <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
      <button style={fileBtn} title="Download"><I.Download size={13}/></button>
      <button style={fileBtn} title="More"><I.MoreHorizontal size={13}/></button>
    </div>
  </div>
);

const SubfolderRow = ({ folder, last }) => (
  <div style={{
    display: "grid", gridTemplateColumns: "1fr 110px 100px 110px", alignItems: "center",
    padding: "10px 18px",
    borderBottom: last ? "none" : "1px solid var(--border)",
    cursor: "pointer", background: "var(--surface-2)",
  }}>
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, background: "var(--bg-2)", color: "var(--ink-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <I.Folder size={14}/>
      </div>
      <div>
        <div style={{ fontSize: 13.5, color: "var(--ink)", fontWeight: 500 }}>{folder.name}</div>
        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 1 }}>{folder.children?.length} items</div>
      </div>
    </div>
    <div></div><div></div><div></div>
  </div>
);

const ArticleThreadRow = ({ thread }) => (
  <Card padding={0} interactive style={{
    transition: "border-color .15s, transform .15s",
  }}>
    <div style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 14 }}
      onMouseEnter={(e) => e.currentTarget.parentElement.style.borderColor = "var(--border-2)"}
      onMouseLeave={(e) => e.currentTarget.parentElement.style.borderColor = "var(--border)"}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: "var(--primary-soft)", color: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <I.Sparkle size={16}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{thread.name}</div>
        <div style={{ fontSize: 12, color: "var(--ink-3)", marginTop: 2 }}>
          {thread.proposals} proposals tracked · history maintained by AI · {thread.status === "ta" ? "TA'd" : thread.status === "tentative" ? "near TA" : "open"}
        </div>
      </div>
      <Pill kind={thread.status}/>
      <I.ChevronRight size={16} style={{ color: "var(--ink-4)" }}/>
    </div>
  </Card>
);

const fileBtn = {
  width: 26, height: 26, borderRadius: 5,
  background: "transparent", border: "none",
  display: "inline-flex", alignItems: "center", justifyContent: "center",
  color: "var(--ink-3)", cursor: "pointer",
};

Object.assign(window, { FilesView });
