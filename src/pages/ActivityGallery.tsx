import { useState } from "react";
import type { RendererSubmit } from "../activities/registry";
import { AudioTextSelectRenderer, DictationRenderer, GuidedSpeakingRenderer, MatchingRenderer, MeaningSelectRenderer, PresentationDialogueRenderer, SentenceBuildRenderer, TextAudioSelectRenderer, TypedRecallRenderer } from "../activities/registry";

export default function ActivityGallery() {
  const [last, setLast] = useState<RendererSubmit>();
  const common = { activityId: "activity.fixture", onSubmit: setLast };
  return <div className="activity-gallery"><p className="learn-preview-kicker">Development only</p><h1>Activity renderer gallery</h1><p>Fixtures cover unanswered, correct, incorrect/retry, pending, error, and accessible-alternative states.</p>{last && <output className="gallery-output">Last response: {last.envelope.kind} · {last.evaluation.outcome}</output>}
    <section><h2>Presentation dialogue · progressive support</h2><PresentationDialogueRenderer lines={[{ speaker: "Sofia", french: "Bonjour !", english: "Hello!" }, { speaker: "Ira", french: "Bonjour !", english: "Hello!" }]} /></section>
    <section><h2>Meaning selection · unanswered/retry/correct</h2><MeaningSelectRenderer {...common} itemId="fixture.meaning" prompt="Choose the daytime greeting." options={["Bonjour !", "Bonsoir !"]} answer="Bonjour !" feedback={{ "Bonsoir !": "Bonsoir is for evening." }} /></section>
    <section><h2>Audio-to-text · normal/slow</h2><AudioTextSelectRenderer {...common} itemId="fixture.audio-text" audio="Bonjour !" options={["Bonjour !", "Bonsoir !"]} answer="Bonjour !" /></section>
    <section><h2>Text-to-audio</h2><TextAudioSelectRenderer {...common} itemId="fixture.text-audio" prompt="Which option says hello?" options={["Bonjour !", "Au revoir !"]} answer="Bonjour !" /></section>
    <section><h2>Keyboard matching</h2><MatchingRenderer {...common} itemId="fixture.matching" pairs={[["Bonjour", "Hello"], ["Au revoir", "Goodbye"]]} /></section>
    <section><h2>Sentence builder · non-drag alternative</h2><SentenceBuildRenderer {...common} itemId="fixture.builder" prompt="Build ‘See you tomorrow!’" tokens={["demain", "!", "À"]} answer="À demain !" /></section>
    <section><h2>Typed recall</h2><TypedRecallRenderer {...common} itemId="fixture.typed" prompt="Type ‘See you soon!’" answers={["À bientôt !"]} policy={{ accents: "required", punctuation: "optional" }} /></section>
    <section><h2>Dictation</h2><DictationRenderer {...common} itemId="fixture.dictation" audio="Bonsoir !" answers={["Bonsoir !"]} policy={{ accents: "required", punctuation: "optional" }} /></section>
    <section><h2>Guided speaking · structured self-review</h2><GuidedSpeakingRenderer {...common} itemId="fixture.speaking" prompt="Greet your teacher." model="Bonjour !" /></section>
    <section><h2>System states</h2><div className="gallery-states"><p role="status">Pending: evaluating response…</p><p role="alert">Error: audio unavailable. A transcript alternative is provided.</p><p>Accessible alternative: read “Bonjour !” when audio cannot be used.</p></div></section>
  </div>;
}
