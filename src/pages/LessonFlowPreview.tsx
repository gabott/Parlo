import { useEffect, useState } from "react";
import type { MediaContent, UnitBundle } from "../domain/content";
import { AudioControl, Button, Card, Feedback, Link, Progress } from "../design-system";
import { contentRepository } from "../repositories/content";
import { speak } from "../speak";
import { useGuestLearner } from "../features/learner/useGuestLearner";

type Activity = UnitBundle["activities"][number];
type Item = UnitBundle["items"][number];

export default function LessonFlowPreview() {
  const lessonId = "lesson.fr-general.a1.first-contact.greetings";
  const learner = useGuestLearner(lessonId);
  const [activity, setActivity] = useState<Activity>();
  const [item, setItem] = useState<Item>();
  const [media, setMedia] = useState<MediaContent>();
  const [selected, setSelected] = useState<string>();
  const [saveError, setSaveError] = useState<string>();

  useEffect(() => {
    void Promise.all([
      contentRepository.getActivity("activity.a1.u01.l01.context"),
      contentRepository.getItems(["item.a1.u01.l01.meaning.001"]),
      contentRepository.resolveMedia("media.image.a1.u01.l01.arrival.v3"),
    ]).then(([nextActivity, items, nextMedia]) => { setActivity(nextActivity); setItem(items[0]); setMedia(nextMedia); });
  }, []);

  if (!activity || !item || !media) return <p role="status">Loading lesson preview…</p>;
  const correct = item.payload.options?.find((option) => option.correct)?.text;
  const answered = Boolean(selected);
  const chooseOption = async (text: string) => {
    setSelected(text);
    speak(text.replace(/[.!?]\s*$/, "").trim());
    if (learner.enrollment) {
      try {
        await learner.repository.submitAttempt({ learnerId: learner.enrollment.learnerId, enrollmentId: learner.enrollment.id, sessionId: "session_lesson-preview", lessonId, activityId: "activity.a1.u01.l01.meaning", itemId: item.id, response: text, correct: text === correct, idempotencyKey: crypto.randomUUID() });
        setSaveError(undefined); await learner.refresh();
      } catch { setSaveError("This attempt could not be saved. Your answer is still shown on this page."); }
    }
  };

  return <article className="lesson-flow">
    <header className="lesson-flow__header">
      <Link to="/learn/a1/unit/first-contact">← Unit 1 outline</Link>
      <p className="learn-preview-kicker">Lesson 1 · Beta preview</p>
      <h1>Greetings and farewells</h1>
      <p className="page-sub">I can choose and use an appropriate greeting or farewell.</p>
      <Progress label="Lesson preview progress" value={1} max={5} />
      {learner.enrollment ? <p className="lesson-save-status" role="status">Saved locally · {learner.progress?.attemptCount ?? 0} practice attempt{learner.progress?.attemptCount === 1 ? "" : "s"}</p> : <p className="lesson-save-status">Preview mode · <Link to="/learn/a1">Start A1 to save progress</Link></p>}
      {learner.error && <Feedback title="Progress is not being saved" tone="error">{learner.error}</Feedback>}
      {saveError && <Feedback title="Save failed" tone="error">{saveError}</Feedback>}
    </header>

    <section className="lesson-scene" aria-labelledby="scene-title">
      <img src={media.uri} alt={media.accessibility_description ?? ""} />
      <div className="lesson-scene__copy">
        <p className="learn-preview-kicker">Step 1 · Meet the language</p>
        <h2 id="scene-title">{activity.title.en}</h2>
        <p>{activity.instructions.en}</p>
        <div className="dialogue" aria-label="Morning greeting dialogue">
          <div><strong>Sofia</strong><span>Bonjour !</span><AudioControl label="Play Sofia saying Bonjour" onPlay={() => speak("Bonjour !")} /></div>
          <div><strong>Ira</strong><span>Bonjour ! Ça va ?</span><AudioControl label="Play Ira saying Bonjour, ça va" onPlay={() => speak("Bonjour ! Ça va ?")} /></div>
        </div>
      </div>
    </section>

    <div className="lesson-flow__grid">
      <Card title="Notice the pattern">
        <p>{activity.body?.en}</p>
        <div className="phrase-contrast"><span><strong>Bonjour</strong><small>arriving · daytime</small></span><span><strong>Au revoir</strong><small>leaving · any time</small></span></div>
      </Card>

      <Card title="Try it">
        <fieldset className="lesson-question">
          <legend>{item.prompt.en}</legend>
          <p className="lesson-audio-hint" id="answer-audio-hint">Choose an answer to hear it in a French voice.</p>
          <div className="lesson-options">
            {item.payload.options?.map((option) => <Button key={option.text} variant={selected === option.text ? "primary" : "secondary"} aria-describedby="answer-audio-hint" aria-pressed={selected === option.text} onClick={() => void chooseOption(option.text)}><span aria-hidden="true">🔊</span>{option.text}</Button>)}
          </div>
        </fieldset>
        {answered && (selected === correct
          ? <Feedback title="Correct" tone="success">Bonjour is the polite daytime greeting.</Feedback>
          : <Feedback title="Try once more" tone="error">Use <strong>bonjour</strong> during the day. Bonsoir is for the evening; au revoir is for leaving.</Feedback>)}
      </Card>
    </div>

    <footer className="lesson-flow__footer">
      <div><strong>What comes next</strong><p>Listening contrast → sentence building → guided speaking → exit check</p></div>
      <Button disabled>More activities coming soon</Button>
    </footer>
  </article>;
}
