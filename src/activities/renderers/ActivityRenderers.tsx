import { useId, useState } from "react";
import type { ActivityKind, ResponseEnvelope, ScoredResponse, TextScoringPolicy } from "../../domain/attempts";
import { scoreChoice, scoreFrenchText } from "../../domain/attempts";
import { AudioControl, Button, Feedback } from "../../design-system";
import { speak } from "../../speak";

export interface RendererSubmit { envelope: ResponseEnvelope; evaluation: ScoredResponse }
interface BaseProps { activityId: string; itemId: string; onSubmit: (result: RendererSubmit) => void | Promise<void> }
const envelope = (base: BaseProps, kind: ActivityKind, response: ResponseEnvelope["response"]): ResponseEnvelope => ({ activityId: base.activityId, itemId: base.itemId, kind, response, submittedAt: new Date().toISOString() });

export function MeaningSelectRenderer(props: BaseProps & { prompt: string; options: readonly string[]; answer: string; feedback?: Record<string, string> }) {
  const [selected, setSelected] = useState<string>(); const [final, setFinal] = useState(false);
  const choose = async (response: string) => { if (final) return; setSelected(response); const evaluation = scoreChoice(response, props.answer); setFinal(evaluation.outcome === "correct"); speak(response); await props.onSubmit({ envelope: envelope(props, "meaning_select", response), evaluation }); };
  return <fieldset className="activity-renderer lesson-question"><legend>{props.prompt}</legend><div className="lesson-options">{props.options.map(option => <Button key={option} variant={selected === option ? "primary" : "secondary"} disabled={final} aria-pressed={selected === option} onClick={() => void choose(option)}>{option}</Button>)}</div>{selected && (final ? <Feedback title="Correct" tone="success">{props.feedback?.[selected] ?? "That expression fits."}</Feedback> : <Feedback title="Try once more" tone="error">{props.feedback?.[selected] ?? "That choice does not fit yet. Try another."}</Feedback>)}</fieldset>;
}

export function AudioTextSelectRenderer(props: BaseProps & { audio: string; options: readonly string[]; answer: string; assessment?: boolean; audioAvailable?: boolean; feedback?: Record<string, string> }) {
  if (props.audioAvailable === false) return <div className="activity-renderer">{props.assessment ? <Feedback title="Audio unavailable" tone="error">This assessment item cannot continue because its reviewed audio is missing.</Feedback> : <Feedback title="Audio unavailable" tone="info">Use the accessible transcript: <strong lang="fr">{props.audio}</strong></Feedback>}</div>;
  return <div className="activity-renderer"><AudioControl label="Play the hidden French expression" onPlay={() => speak(props.audio, { allowBrowserFallback: !props.assessment })} onPlaySlow={() => speak(props.audio, { rate: 0.75, allowBrowserFallback: !props.assessment })} /><MeaningSelectRenderer {...props} prompt="Choose the written expression." /></div>;
}

export function TextAudioSelectRenderer(props: BaseProps & { prompt: string; options: readonly string[]; answer: string }) {
  return <div className="activity-renderer"><h3>{props.prompt}</h3><div className="lesson-options">{props.options.map(option => <AudioControl key={option} label={`Play option ${props.options.indexOf(option) + 1}`} onPlay={() => speak(option)} onPlaySlow={() => speak(option, { rate: 0.75 })} />)}</div><MeaningSelectRenderer {...props} options={props.options.map((_, index) => `Option ${index + 1}`)} answer={`Option ${props.options.indexOf(props.answer) + 1}`} prompt="Select the audio option." /></div>;
}

export function SentenceBuildRenderer(props: BaseProps & { prompt: string; tokens: readonly string[]; answer: string }) {
  const [chosen, setChosen] = useState<string[]>([]); const [result, setResult] = useState<ScoredResponse>();
  const available = props.tokens.filter((token, index) => chosen.filter(value => value === token).length <= props.tokens.slice(0, index).filter(value => value === token).length);
  const response = chosen.join(" ");
  const submit = async () => { const evaluation = scoreFrenchText(response, [props.answer], { accents: "required", punctuation: "optional" }); setResult(evaluation); await props.onSubmit({ envelope: envelope(props, "sentence_build", chosen), evaluation }); };
  return <div className="activity-renderer sentence-builder"><h3>{props.prompt}</h3><div className="sentence-builder__answer" aria-label="Your sentence">{chosen.length ? chosen.map((token, index) => <button key={`${token}-${index}`} disabled={Boolean(result)} onClick={() => setChosen(current => current.filter((_, i) => i !== index))}>{token}</button>) : <span>Choose words below…</span>}</div><div className="sentence-builder__tokens">{available.map((token, index) => <Button key={`${token}-${index}`} variant="secondary" disabled={Boolean(result)} onClick={() => setChosen(current => [...current, token])}>{token}</Button>)}</div><Button disabled={!chosen.length || Boolean(result)} onClick={() => void submit()}>Check sentence</Button>{result && <Feedback title={result.outcome === "correct" ? "Well built" : "Try this model"} tone={result.outcome === "correct" ? "success" : "error"}>{props.answer}</Feedback>}</div>;
}

export function TypedRecallRenderer(props: BaseProps & { prompt: string; answers: readonly string[]; policy: TextScoringPolicy; kind?: "typed_recall" | "dictation" }) {
  const id = useId(); const [value, setValue] = useState(""); const [result, setResult] = useState<ScoredResponse>(); const kind = props.kind ?? "typed_recall";
  const submit = async () => { const evaluation = scoreFrenchText(value, props.answers, props.policy); setResult(evaluation); await props.onSubmit({ envelope: envelope(props, kind, value), evaluation }); };
  return <div className="activity-renderer typed-recall"><label htmlFor={id}>{props.prompt}</label><input id={id} lang="fr" value={value} onChange={event => setValue(event.target.value)} /><Button disabled={!value.trim() || Boolean(result)} onClick={() => void submit()}>Check answer</Button>{result && <Feedback title={result.outcome === "correct" ? "Correct" : result.outcome === "needs_review" ? "Review needed" : "Keep practising"} tone={result.outcome === "correct" ? "success" : "error"}>{result.outcome === "correct" ? "Your French matches the model." : `Model: ${props.answers[0]}`}</Feedback>}</div>;
}

export function DictationRenderer(props: BaseProps & { audio: string; answers: readonly string[]; policy: TextScoringPolicy }) { return <div className="activity-renderer"><AudioControl label="Play dictation" onPlay={() => speak(props.audio)} onPlaySlow={() => speak(props.audio, { rate: 0.75 })} /><TypedRecallRenderer {...props} kind="dictation" prompt="Type what you hear." /></div>; }

export function MatchingRenderer(props: BaseProps & { pairs: readonly (readonly [string, string])[] }) {
  const [left, setLeft] = useState<string>(); const [matches, setMatches] = useState<Record<string, string>>({});
  const chooseRight = async (right: string) => { if (!left) return; const evaluation = scoreChoice(right, props.pairs.find(pair => pair[0] === left)?.[1] ?? ""); const next = { ...matches, [left]: right }; setMatches(next); await props.onSubmit({ envelope: envelope(props, "matching", next), evaluation }); setLeft(undefined); };
  return <div className="activity-renderer matching-renderer"><div>{props.pairs.map(([value]) => <Button key={value} variant={left === value ? "primary" : "secondary"} onClick={() => setLeft(value)}>{value}</Button>)}</div><div>{props.pairs.map(([, value]) => <Button key={value} variant="secondary" disabled={!left} onClick={() => void chooseRight(value)}>{value}</Button>)}</div></div>;
}

export function GuidedSpeakingRenderer(props: BaseProps & { prompt: string; model: string }) {
  const [checks, setChecks] = useState([false, false, false]); const [submitted, setSubmitted] = useState(false); const labels = ["The expression fits the situation", "I can understand my words", "I spoke it as one short group"];
  const toggle = (index: number) => setChecks(current => current.map((value, i) => i === index ? !value : value));
  const submit = async () => { const score = checks.filter(Boolean).length / checks.length; setSubmitted(true); await props.onSubmit({ envelope: envelope(props, "guided_speaking", checks.map(String)), evaluation: { outcome: score >= 2 / 3 ? "correct" : "needs_review", score } }); };
  return <div className="activity-renderer speaking-practice"><h3>{props.prompt}</h3><AudioControl label="Hear speaking model" onPlay={() => speak(props.model)} onPlaySlow={() => speak(props.model, { rate: 0.75 })} />{labels.map((label, index) => <label key={label}><input type="checkbox" disabled={submitted} checked={checks[index]} onChange={() => toggle(index)} /> {label}</label>)}<Button disabled={submitted || !checks.some(Boolean)} onClick={() => void submit()}>Submit self-review</Button>{submitted && <Feedback title="Self-review saved" tone="success">Use the model once more if you want another comparison.</Feedback>}</div>;
}

export function PresentationDialogueRenderer({ lines }: { lines: readonly { speaker: string; french: string; english: string }[] }) {
  const [support, setSupport] = useState<"none" | "french" | "english">("none"); const full = lines.map(line => line.french).join(" ");
  return <div className="activity-renderer"><AudioControl label="Play full dialogue" onPlay={() => speak(full)} onPlaySlow={() => speak(full, { rate: 0.75 })} /><div className="lesson-inline-actions"><Button variant="secondary" onClick={() => setSupport("french")}>Show French</Button><Button variant="secondary" disabled={support === "none"} onClick={() => setSupport("english")}>Show English support</Button></div>{support !== "none" && <div className="dialogue">{lines.map(line => <div key={`${line.speaker}-${line.french}`}><strong>{line.speaker}</strong><span><b lang="fr">{line.french}</b>{support === "english" && <small>{line.english}</small>}</span><AudioControl label={`Play ${line.speaker}'s line`} onPlay={() => speak(line.french)} onPlaySlow={() => speak(line.french, { rate: 0.75 })} /></div>)}</div>}</div>;
}
