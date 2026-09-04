// ============================================================
//  Sidebar — the left navigation menu
// ------------------------------------------------------------
//  Shows the app name and a button for each section. The active
//  section is highlighted. Clicking a button tells App.jsx to
//  switch pages (via the "onNavigate" function passed in).
// ============================================================

// The list of sections. Add one here to add a new menu item.
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "🏠" },
  { id: "basics", label: "Basics", icon: "🧱" },
  { id: "vocabulary", label: "Vocabulary", icon: "📚" },
  { id: "grammar", label: "Grammar", icon: "✏️" },
  { id: "phrases", label: "Phrases", icon: "💬" },
  { id: "practice", label: "Practice", icon: "🎯" },
  { id: "videos", label: "Videos", icon: "▶️" },
  { id: "exam", label: "TEF Exam", icon: "🇨🇦" },
];

export default function Sidebar({ page, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-name">Parlo</span>
        <span className="brand-flag">🇫🇷</span>
      </div>

      <nav className="nav">
        {NAV.map((item) => (
          <button
            key={item.id}
            className={page === item.id ? "nav-item active" : "nav-item"}
            onClick={() => onNavigate(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">A1 → B2+ · TEF Canada</div>
    </aside>
  );
}
