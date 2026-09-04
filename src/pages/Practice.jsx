// ============================================================
//  Practice — sub-tabs wrapping the 3 activities
// ============================================================
import { useState } from "react";
import Flashcards from "../Flashcards";
import Unscramble from "../Unscramble";
import Quiz from "../Quiz";
import PageHeader from "../PageHeader";

const TABS = [
  { id: "flashcards", label: "🃏 Flashcards" },
  { id: "unscramble", label: "🧩 Unscramble" },
  { id: "quiz", label: "✅ Quiz" },
];

export default function Practice() {
  const [tab, setTab] = useState("flashcards");

  return (
    <div>
      <PageHeader
        image="practice.jpg"
        emoji="🎯"
        title="Practice"
        subtitle="Train what you learned with games and quizzes."
      />

      <div className="subtabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "subtab active" : "subtab"}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="subtab-body">
        {tab === "flashcards" && <Flashcards />}
        {tab === "unscramble" && <Unscramble />}
        {tab === "quiz" && <Quiz />}
      </div>
    </div>
  );
}
