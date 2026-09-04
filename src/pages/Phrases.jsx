// ============================================================
//  Phrases — useful sentences by situation, with audio
// ============================================================
import { useState } from "react";
import { phrases, phraseCategories } from "../content/phrases";
import SpeakButton from "../SpeakButton";
import PageHeader from "../PageHeader";

export default function Phrases() {
  const [category, setCategory] = useState("All");

  const list = phrases.filter(
    (p) => category === "All" || p.category === category
  );

  return (
    <div>
      <PageHeader
        image="phrases.jpg"
        emoji="💬"
        title="Phrases"
        subtitle="Ready-to-use sentences for real situations. Tap 🔊 to listen."
      />

      {/* Category filter as pill buttons */}
      <div className="pills">
        <button
          className={category === "All" ? "pill active" : "pill"}
          onClick={() => setCategory("All")}
        >
          All
        </button>
        {phraseCategories.map((c) => (
          <button
            key={c}
            className={category === c ? "pill active" : "pill"}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="phrase-list">
        {list.map((p, i) => (
          <div key={i} className="phrase-card">
            <div>
              <div className="phrase-fr">{p.fr}</div>
              <div className="phrase-en">{p.en}</div>
            </div>
            <div className="phrase-right">
              <span className="tag level">{p.level}</span>
              <SpeakButton text={p.fr} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
