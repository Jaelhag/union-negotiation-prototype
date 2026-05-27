// Minimal stroke-icon set. Single style — 1.5px stroke, rounded ends, 18px viewBox.

const Icon = ({ d, size = 16, fill, viewBox = "0 0 24 24", style }) => (
  <svg width={size} height={size} viewBox={viewBox} fill="none"
    stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"
    style={style}>
    {typeof d === 'string' ? <path d={d}/> : d}
  </svg>
);

const I = {
  Home:     (p) => <Icon {...p} d="M3 10.5L12 3l9 7.5V21h-6v-6h-6v6H3V10.5z"/>,
  Folder:   (p) => <Icon {...p} d="M3 6.5A1.5 1.5 0 0 1 4.5 5h4l2 2.5h9A1.5 1.5 0 0 1 21 9v9.5A1.5 1.5 0 0 1 19.5 20h-15A1.5 1.5 0 0 1 3 18.5v-12z"/>,
  FolderOpen: (p) => <Icon {...p} d="M3 7.5A1.5 1.5 0 0 1 4.5 6h4l2 2h9A1.5 1.5 0 0 1 21 9.5L19.5 18a2 2 0 0 1-2 1.5h-13A1.5 1.5 0 0 1 3 18V7.5z"/>,
  Inbox:    (p) => <Icon {...p} d="M3 13l3-8h12l3 8M3 13v6h18v-6M3 13h6l1 2h4l1-2h6"/>,
  Calendar: (p) => <Icon {...p} d="M4 6.5A1.5 1.5 0 0 1 5.5 5h13A1.5 1.5 0 0 1 20 6.5v12A1.5 1.5 0 0 1 18.5 20h-13A1.5 1.5 0 0 1 4 18.5v-12zM4 10h16M8 3v4M16 3v4"/>,
  Chat:     (p) => <Icon {...p} d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>,
  Users:    (p) => <Icon {...p} d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM16 3.13a4 4 0 0 1 0 7.75"/>,
  File:     (p) => <Icon {...p} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6"/>,
  Doc:      (p) => <Icon {...p} d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 2v6h6M9 13h6M9 17h6M9 9h2"/>,
  Plus:     (p) => <Icon {...p} d="M12 5v14M5 12h14"/>,
  Search:   (p) => <Icon {...p} d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16zM21 21l-4.35-4.35"/>,
  Bell:     (p) => <Icon {...p} d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0"/>,
  Settings: (p) => <Icon {...p} d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33h0a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82v0a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>,
  ChevronRight: (p) => <Icon {...p} d="M9 18l6-6-6-6"/>,
  ChevronDown:  (p) => <Icon {...p} d="M6 9l6 6 6-6"/>,
  ChevronLeft:  (p) => <Icon {...p} d="M15 18l-6-6 6-6"/>,
  Dot:      (p) => <Icon {...p} d="M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z" />,
  Clock:    (p) => <Icon {...p} d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2"/>,
  Check:    (p) => <Icon {...p} d="M5 13l4 4L19 7"/>,
  CheckCircle: (p) => <Icon {...p} d={<><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></>}/>,
  X:        (p) => <Icon {...p} d="M18 6L6 18M6 6l12 12"/>,
  MoreHorizontal: (p) => <Icon {...p} d="M5 12h.01M12 12h.01M19 12h.01" />,
  Filter:   (p) => <Icon {...p} d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>,
  Upload:   (p) => <Icon {...p} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"/>,
  Download: (p) => <Icon {...p} d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>,
  Star:     (p) => <Icon {...p} d="M12 2l3.1 6.3 7 1-5 4.9 1.2 6.9L12 17.8 5.7 21l1.2-6.9-5-4.9 7-1L12 2z"/>,
  Mic:      (p) => <Icon {...p} d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zM19 11v1a7 7 0 0 1-14 0v-1M12 19v3M8 22h8"/>,
  Video:    (p) => <Icon {...p} d="M23 7l-7 5 7 5V7zM3 5h11a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>,
  Sparkle:  (p) => <Icon {...p} d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"/>,
  ArrowRight: (p) => <Icon {...p} d="M5 12h14M13 5l7 7-7 7"/>,
  ArrowLeft:  (p) => <Icon {...p} d="M19 12H5M12 19l-7-7 7-7"/>,
  Pin:      (p) => <Icon {...p} d="M12 17v5M9 10.76V6a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v4.76l2 2.24v3H7v-3l2-2.24z"/>,
  Lock:     (p) => <Icon {...p} d="M5 11h14a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-8a1 1 0 0 1 1-1zM8 11V7a4 4 0 0 1 8 0v4"/>,
  Scale:    (p) => <Icon {...p} d="M12 3v18M5 7h14M5 7l-3 7a4 4 0 0 0 6 0L5 7zM19 7l-3 7a4 4 0 0 0 6 0l-3-7z"/>,
  Building: (p) => <Icon {...p} d="M3 21h18M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/>,
  Flag:     (p) => <Icon {...p} d="M4 21V4M4 4h11l-1 4 1 4H4"/>,
  Dollar:   (p) => <Icon {...p} d="M12 2v20M17 6H9a3 3 0 0 0 0 6h6a3 3 0 0 1 0 6H7"/>,
  Hourglass: (p) => <Icon {...p} d="M6 2h12v4l-4 6 4 6v4H6v-4l4-6-4-6V2z"/>,
  Send:     (p) => <Icon {...p} d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>,
  Paperclip:(p) => <Icon {...p} d="M21 12.5l-9.2 9.2a6 6 0 0 1-8.5-8.5l9.2-9.2a4 4 0 1 1 5.7 5.7L9 19.5a2 2 0 1 1-2.8-2.8L14.5 8.3"/>,
};

// File-type swatches — colored squares with extension
const FileBadge = ({ kind, size = 28 }) => {
  const map = {
    docx:  { bg: "#E4ECF7", fg: "#2C5AA0", label: "W" },
    pdf:   { bg: "#F6E1DD", fg: "#B0382E", label: "P" },
    xlsx:  { bg: "#E2F0E6", fg: "#2F7D4F", label: "X" },
    audio: { bg: "#F0E6FA", fg: "#7A3F8F", label: "♪" },
    "email-thread": { bg: "#EFECE4", fg: "#6B7280", label: "@" },
    thread: { bg: "#E5EEEC", fg: "#1F4A47", label: "§" },
    placeholder: { bg: "#F4F1E8", fg: "#9CA3AF", label: "·" },
    folder: { bg: "#EFECE4", fg: "#6B7280", label: "▸" },
  };
  const c = map[kind] || map.docx;
  return (
    <div style={{
      width: size, height: size, borderRadius: 6,
      background: c.bg, color: c.fg,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: size * 0.42, fontWeight: 600, fontFamily: "var(--font-mono)",
      flexShrink: 0,
    }}>{c.label}</div>
  );
};

window.I = I;
window.Icon = Icon;
window.FileBadge = FileBadge;
