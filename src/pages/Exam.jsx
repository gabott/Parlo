// ============================================================
//  Exam — TEF Canada overview (full mocks coming later)
// ============================================================

import PageHeader from "../PageHeader";

const SECTIONS = [
  { code: "CE", name: "Compréhension écrite", detail: "Reading — 50 questions / 60 min", icon: "📖" },
  { code: "CO", name: "Compréhension orale", detail: "Listening — 60 questions / 40 min", icon: "🎧" },
  { code: "EE", name: "Expression écrite", detail: "Writing — 2 tasks / 60 min", icon: "✍️" },
  { code: "EO", name: "Expression orale", detail: "Speaking — 2 tasks / 15 min", icon: "🗣️" },
];

export default function Exam() {
  return (
    <div>
      <PageHeader
        image="exam.jpg"
        emoji="🇨🇦"
        title="TEF Canada — Exam center"
        subtitle="Four sections mapped to NCLC/CLB. Full timed mocks coming soon."
      />

      <div className="exam-grid">
        {SECTIONS.map((s) => (
          <div key={s.code} className="exam-card">
            <span className="exam-icon">{s.icon}</span>
            <div>
              <div className="exam-name">
                <strong>{s.code}</strong> — {s.name}
              </div>
              <div className="exam-detail">{s.detail}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card soon">
        <h2>Coming soon</h2>
        <ul>
          <li>Timed section drills (CE / CO auto-scored)</li>
          <li>Writing & speaking tasks with rubric self-scoring</li>
          <li>Score → NCLC estimate + gap to your target</li>
          <li>Study-plan generator from your exam date</li>
        </ul>
      </div>
    </div>
  );
}
