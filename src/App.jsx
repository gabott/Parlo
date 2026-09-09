import { useEffect, useRef, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import "./App.css";

const PAGE_TITLES = {
  "/": "Dashboard",
  "/library/basics": "Basics",
  "/library/vocabulary": "Vocabulary",
  "/library/grammar": "Grammar",
  "/library/phrases": "Phrases",
  "/library/practice": "Practice",
  "/library/videos": "Videos & resources",
  "/tef": "TEF Exam",
  "/learn": "Learn Preview",
  "/learn/a1": "Beginner A1",
  "/learn/a1/unit/first-contact": "French sounds and first contact",
  "/learn/a1/unit/first-contact/lesson/greetings": "Greetings and farewells",
  "/learn/a1/unit/first-contact/lesson/names-alphabet": "Names and alphabet",
  "/debug/activities": "Activity renderer gallery",
};

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const mainRef = useRef(null);
  const menuButtonRef = useRef(null);

  useEffect(() => {
    document.title = `${PAGE_TITLES[location.pathname] ?? "Page not found"} · Parlo`;
    mainRef.current?.focus();
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return undefined;

    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <div className={menuOpen ? "layout menu-open" : "layout"}>
      <Sidebar onNavigate={() => setMenuOpen(false)} />

      <div className="main-wrap">
        <header className="topbar">
          <button
            ref={menuButtonRef}
            className="menu-btn"
            type="button"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            aria-controls="primary-navigation"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((value) => !value)}
          >
            <span aria-hidden="true">☰</span>
          </button>
          <span className="topbar-title">Parlo 🇫🇷</span>
        </header>

        <main ref={mainRef} className="main" tabIndex="-1">
          <Outlet />
        </main>
      </div>

      {menuOpen && (
        <button
          className="overlay"
          type="button"
          aria-label="Close navigation"
          onClick={() => {
            setMenuOpen(false);
            menuButtonRef.current?.focus();
          }}
        />
      )}
      <Analytics />
    </div>
  );
}
