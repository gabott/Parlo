// ============================================================
//  Vocabulary — searchable, filterable word bank with audio
// ============================================================
import { useState } from "react";
import { vocabulary, vocabThemes } from "../content/vocabulary";
import SpeakButton from "../SpeakButton";
import PageHeader from "../PageHeader";

export default function Vocabulary() {
  const [search, setSearch] = useState("");   // text typed in the search box
  const [theme, setTheme] = useState("All");  // selected theme filter

  // Filter the word list by search text AND theme.
  const words = vocabulary.filter((w) => {
    const matchesTheme = theme === "All" || w.theme === theme;
    const text = (w.fr + " " + w.en).toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());
    return matchesTheme && matchesSearch;
  });

  return (
    <div>
      <PageHeader
        image="vocab.jpg"
        emoji="📚"
        title="Vocabulary"
        subtitle="Build your word bank — tap 🔊 to hear native pronunciation."
      />
      <p className="page-sub">
        {words.length} word{words.length === 1 ? "" : "s"} —{" "}
        <span className="hint-m">blue = le (m)</span>,{" "}
        <span className="hint-f">red = la (f)</span>.
      </p>

      {/* Search + filter controls */}
      <div className="controls">
        <input
          className="search"
          placeholder="Search a word…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="select" value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="All">All themes</option>
          {vocabThemes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Word grid */}
      <div className="vocab-grid">
        {words.map((w) => (
          <div key={w.fr} className="vocab-card">
            <div className="vocab-top">
              <span
                className={
                  "vocab-fr " +
                  (w.gender === "m" ? "male" : w.gender === "f" ? "female" : "")
                }
              >
                {w.fr}
              </span>
              <SpeakButton text={w.fr} />
            </div>
            <div className="vocab-en">{w.en}</div>
            <div className="vocab-meta">
              <span className="tag">{w.theme}</span>
              <span className="tag level">{w.level}</span>
            </div>
          </div>
        ))}
      </div>

      {words.length === 0 && <p className="empty">No words match your search.</p>}
    </div>
  );
}
