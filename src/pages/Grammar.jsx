// ============================================================
//  Grammar — list of topics; click one to open the lesson
// ============================================================
import { useState } from "react";
import { grammar } from "../content/grammar";
import SpeakButton from "../SpeakButton";
import PageHeader from "../PageHeader";

export default function Grammar() {
  // Which topic is open (null = show the list).
  const [openId, setOpenId] = useState(null);
  const topic = grammar.find((g) => g.id === openId);

  // --- Detail view (one topic) ---
  if (topic) {
    return (
      <div>
        <button className="back" onClick={() => setOpenId(null)}>← All topics</button>
        <h1 className="page-title">{topic.title}</h1>
        <span className="tag level">{topic.level}</span>

        {/* explanation: we split on new lines so it reads nicely */}
        <div className="card">
          {topic.explanation.split("\n").map((line, i) => (
            <p key={i} className="explain-line">{line || "\u00A0"}</p>
          ))}
        </div>

        <h2 className="section-h">Examples</h2>
        <div className="card">
          {topic.examples.map((ex, i) => (
            <div key={i} className="example-row">
              <div>
                <div className="example-fr">{ex.fr}</div>
                <div className="example-en">{ex.en}</div>
              </div>
              <SpeakButton text={ex.fr} />
            </div>
          ))}
        </div>

        <h2 className="section-h">Quick check</h2>
        <MiniDrill drill={topic.drill} />
      </div>
    );
  }

  // --- List view (all topics) ---
  return (
    <div>
      <PageHeader
        image="grammar.jpg"
        emoji="✏️"
        title="Grammar"
        subtitle="CEFR-tagged lessons. Click a topic to open it."
      />
      <div className="topic-list">
        {grammar.map((g) => (
          <button key={g.id} className="topic-card" onClick={() => setOpenId(g.id)}>
            <div className="topic-head">
              <span className="topic-title">{g.title}</span>
              <span className="tag level">{g.level}</span>
            </div>
            <div className="topic-summary">{g.summary}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

// A tiny multiple-choice check shown at the bottom of each topic.
function MiniDrill({ drill }) {
  const [picked, setPicked] = useState(null);

  return (
    <div className="card">
      <p className="drill-q">{drill.question}</p>
      <div className="drill-options">
        {drill.options.map((opt) => {
          let cls = "option";
          if (picked) {
            if (opt === drill.answer) cls += " correct";
            else if (opt === picked) cls += " wrong";
          }
          return (
            <button key={opt} className={cls} onClick={() => setPicked(opt)}>
              {opt}
            </button>
          );
        })}
      </div>
      {picked && (
        <p className={picked === drill.answer ? "feedback good" : "feedback bad"}>
          {picked === drill.answer ? "✅ Correct !" : `❌ The answer is “${drill.answer}”.`}
        </p>
      )}
    </div>
  );
}
