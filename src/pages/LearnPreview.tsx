import { useState } from "react";
import { AudioControl, Button, Card, Feedback, Field, Link, Progress, VisuallyHidden } from "../design-system";
import { imageUrl } from "./pageImages";

export default function LearnPreview() {
  const [feedback, setFeedback] = useState<"idle" | "success">("idle");

  return <div className="learn-preview-v2">
    <div className="hero learn-preview" style={{ backgroundImage: `url(${imageUrl("hero-paris.jpg")})` }}>
      <div className="hero-inner">
        <span className="badge">Preview</span>
        <h1>Learn French with a clear path</h1>
        <p className="hero-sub">Parlo’s guided A1 course is being built in small, tested releases. The current Library remains available while the learning path grows.</p>
        <Link to="/library/basics" variant="button">Explore the current Library <span aria-hidden="true">→</span></Link>
      </div>
    </div>

    <div className="learn-preview-grid">
      <Card title="Your first path">
        <p className="learn-preview-kicker">A1 · Unit 1</p>
        <ol className="plan-list">
          <li>French sounds and first contact</li>
          <li>Introductions and identity</li>
          <li>Personal information</li>
        </ol>
        <Progress label="Preview foundation" value={2} max={3} />
        <div className="learn-preview-course-link"><Link to="/learn/a1" variant="button">Preview the A1 course</Link></div>
      </Card>

      <Card title="Try the new controls">
        <div className="learn-preview-controls">
          <Field label="Name for practice" hint="This preview does not save your answer." placeholder="Camille" />
          <div className="learn-preview-actions">
            <Button onClick={() => setFeedback("success")}>Check readiness</Button>
            <AudioControl label="Play Bonjour pronunciation" onPlay={() => window.speechSynthesis?.speak(new SpeechSynthesisUtterance("Bonjour"))} />
          </div>
          {feedback === "success" && <Feedback title="Ready to learn" tone="success">Your learning path will begin here in a later increment.</Feedback>}
        </div>
      </Card>
    </div>

    <p className="learn-preview-note">Your vocabulary, grammar, phrases, practice, and audio tools are still available in the <Link to="/library/basics">Library</Link>.</p>
    <VisuallyHidden>End of Learn preview</VisuallyHidden>
  </div>;
}
