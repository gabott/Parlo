import { Link } from "react-router-dom";
import { imageUrl } from "./pageImages";

export default function LearnPreview() {
  return (
    <div>
      <div className="hero learn-preview" style={{ backgroundImage: `url(${imageUrl("hero-paris.jpg")})` }}>
        <div className="hero-inner">
          <span className="badge">Preview</span>
          <h1>Learn French with a clear path</h1>
          <p className="hero-sub">
            Parlo’s guided A1 course is being built here. Lessons, progress,
            review, and personalized recommendations will arrive in small,
            tested releases while the current Library remains available.
          </p>
          <Link className="btn hero-cta" to="/library/basics">Explore the current Library →</Link>
        </div>
      </div>
      <div className="card plan-card">
        <h2>What is coming first</h2>
        <ol className="plan-list">
          <li>French sounds and first contact</li>
          <li>Introductions and identity</li>
          <li>Personal information</li>
        </ol>
        <p className="page-sub learn-preview-note">
          Your existing vocabulary, grammar, phrases, practice, and audio tools are still available in the Library.
        </p>
      </div>
    </div>
  );
}
