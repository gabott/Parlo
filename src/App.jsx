// ============================================================
//  Parlo — main app shell
// ------------------------------------------------------------
//  Left sidebar for navigation + main area that shows the
//  selected page. We use a simple useState (no router) to keep
//  things beginner-friendly.
// ============================================================
import { useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import Sidebar from "./Sidebar";
import Dashboard from "./pages/Dashboard";
import Basics from "./pages/Basics";
import Vocabulary from "./pages/Vocabulary";
import Grammar from "./pages/Grammar";
import Phrases from "./pages/Phrases";
import Practice from "./pages/Practice";
import Videos from "./pages/Videos";
import Exam from "./pages/Exam";
import "./App.css";

export default function App() {
  // Which page is showing. Starts on the dashboard.
  const [page, setPage] = useState("dashboard");
  // On mobile, whether the sidebar is open.
  const [menuOpen, setMenuOpen] = useState(false);

  // Go to a page and close the mobile menu.
  const go = (id) => {
    setPage(id);
    setMenuOpen(false);
  };

  return (
    <div className={menuOpen ? "layout menu-open" : "layout"}>
      <Sidebar page={page} onNavigate={go} />

      <div className="main-wrap">
        {/* Small top bar — mainly for the mobile menu button */}
        <div className="topbar">
          <button className="menu-btn" onClick={() => setMenuOpen((v) => !v)}>
            ☰
          </button>
          <span className="topbar-title">Parlo 🇫🇷</span>
        </div>

        <main className="main">
          {page === "dashboard" && <Dashboard onNavigate={go} />}
          {page === "basics" && <Basics />}
          {page === "vocabulary" && <Vocabulary />}
          {page === "grammar" && <Grammar />}
          {page === "phrases" && <Phrases />}
          {page === "practice" && <Practice />}
          {page === "videos" && <Videos />}
          {page === "exam" && <Exam />}
        </main>
      </div>

      {/* Dark overlay behind the mobile menu */}
      {menuOpen && <div className="overlay" onClick={() => setMenuOpen(false)} />}
      <Analytics />
    </div>
  );
}
