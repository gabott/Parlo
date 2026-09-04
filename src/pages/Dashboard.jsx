// ============================================================
//  Dashboard — the welcome / overview page
// ============================================================
import { unitInfo } from "../data";
import { vocabulary } from "../content/vocabulary";
import { grammar } from "../content/grammar";
import { phrases } from "../content/phrases";
import { videos } from "../content/videos";
import { imageUrl } from "./pageImages";

export default function Dashboard({ onNavigate }) {
  // Section cards with a photo, count, and where they lead.
  const sections = [
    { label: "Basics", value: 5, unit: "starters", page: "basics", icon: "🧱", img: "basics.jpg" },
    { label: "Vocabulary", value: vocabulary.length, unit: "words", page: "vocabulary", icon: "📚", img: "vocab.jpg" },
    { label: "Grammar", value: grammar.length, unit: "topics", page: "grammar", icon: "✏️", img: "grammar.jpg" },
    { label: "Phrases", value: phrases.length, unit: "phrases", page: "phrases", icon: "💬", img: "phrases.jpg" },
    { label: "Practice", value: 3, unit: "games", page: "practice", icon: "🎯", img: "practice.jpg" },
    { label: "Videos", value: videos.length, unit: "channels", page: "videos", icon: "▶️", img: "videos.jpg" },
    { label: "TEF Exam", value: 4, unit: "sections", page: "exam", icon: "🇨🇦", img: "exam.jpg" },
  ];

  return (
    <div>
      {/* Hero with a Paris photo background */}
      <div
        className="hero"
        style={{ backgroundImage: `url(${imageUrl("hero-paris.jpg")})` }}
      >
        <div className="hero-inner">
          <h1>Bienvenue ! 👋</h1>
          <p className="hero-sub">
            Your one place to learn French — from <strong>A1 to B2+</strong>.
            Vocabulary, grammar, phrases, practice games and curated videos,
            all with native pronunciation.
          </p>
          <div className="hero-current">
            <span className="badge">{unitInfo.level}</span>
            Current unit: <strong>{unitInfo.title}</strong> — {unitInfo.subtitle}
          </div>
          <p className="cando">🎯 {unitInfo.canDo}</p>
          <button className="btn hero-cta" onClick={() => onNavigate("vocabulary")}>
            Start learning →
          </button>
        </div>
      </div>

      <h2 className="section-h">Explore</h2>
      <div className="section-grid">
        {sections.map((s) => (
          <button
            key={s.label}
            className="section-card"
            onClick={() => onNavigate(s.page)}
          >
            <div
              className="section-img"
              style={{ backgroundImage: `url(${imageUrl(s.img)})` }}
            >
              <span className="section-badge">{s.icon}</span>
            </div>
            <div className="section-body">
              <div className="section-name">{s.label}</div>
              <div className="section-count">
                <strong>{s.value}</strong> {s.unit}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Today's suggested plan */}
      <div className="card plan-card">
        <h2>Today's plan</h2>
        <ol className="plan-list">
          <li>Review 10 words in <button className="link" onClick={() => onNavigate("vocabulary")}>Vocabulary</button></li>
          <li>Study one topic in <button className="link" onClick={() => onNavigate("grammar")}>Grammar</button></li>
          <li>Practice with <button className="link" onClick={() => onNavigate("practice")}>Flashcards & puzzles</button></li>
          <li>Listen to a video in <button className="link" onClick={() => onNavigate("videos")}>Videos</button></li>
        </ol>
      </div>
    </div>
  );
}
