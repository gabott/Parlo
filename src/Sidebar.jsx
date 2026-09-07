import { NavLink } from "react-router-dom";

const NAV = [
  { to: "/", label: "Dashboard", icon: "🏠", end: true },
  { to: "/learn", label: "Learn", icon: "🧭" },
  { to: "/library/basics", label: "Basics", icon: "🧱" },
  { to: "/library/vocabulary", label: "Vocabulary", icon: "📚" },
  { to: "/library/grammar", label: "Grammar", icon: "✏️" },
  { to: "/library/phrases", label: "Phrases", icon: "💬" },
  { to: "/library/practice", label: "Practice", icon: "🎯" },
  { to: "/library/videos", label: "Videos", icon: "▶️" },
  { to: "/tef", label: "TEF Exam", icon: "🇨🇦" },
];

export default function Sidebar({ onNavigate }) {
  return (
    <aside id="primary-navigation" className="sidebar">
      <NavLink className="brand" to="/" onClick={onNavigate} aria-label="Parlo home">
        <span className="brand-name">Parlo</span>
        <span className="brand-flag" aria-hidden="true">🇫🇷</span>
      </NavLink>

      <nav className="nav" aria-label="Primary navigation">
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
            onClick={onNavigate}
          >
            <span className="nav-icon" aria-hidden="true">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-foot">A1 → B2+ · TEF Canada</div>
    </aside>
  );
}
