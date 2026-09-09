import { useEffect, useRef, useState } from "react";
import { Button, Card, Feedback, Link, Progress } from "../design-system";
import { useGuestLearner } from "../features/learner/useGuestLearner";
import { speak } from "../speak";

const lessonId = "lesson.fr-general.a1.first-contact.assessment";
const steps = ["Brief", "Listening", "Context", "Writing", "Speaking", "Results"];

type Answers = Record<string, string>;
type ChoiceProps = { id: string; prompt: string; options: readonly string[]; value?: string; onChange: (id: string, value: string) => void };

function Choice({ id, prompt, options, value, onChange }: ChoiceProps) {
  return <fieldset className="assessment-question"><legend>{prompt}</legend><div className="assessment-options">{options.map(option => <button key={option} type="button" className={value === option ? "is-selected" : ""} aria-pressed={value === option} onClick={() => onChange(id, option)}>{option}</button>)}</div></fieldset>;
}

function LimitedAudio({ text, label }: { text: string; label: string }) {
  const [plays, setPlays] = useState(0);
  const play = () => { if (plays >= 2) return; setPlays(current => current + 1); speak(text, { allowBrowserFallback: false }); };
  return <div className="assessment-audio"><Button variant="secondary" disabled={plays >= 2} onClick={play}>▶ {label}</Button><span aria-live="polite">{2 - plays} {2 - plays === 1 ? "play" : "plays"} remaining</span></div>;
}

const clean = (value = "") => value.trim().toLocaleLowerCase("fr").replace(/[.!?]/g, "").replace(/[’]/g, "'").replace(/\s+/g, " ");
const plain = (value = "") => clean(value).normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export default function CapabilityAssessment() {
  const learner = useGuestLearner(lessonId);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [saveError, setSaveError] = useState<string>();
  const set = (id: string, value: string) => setAnswers(current => ({ ...current, [id]: value }));
  useEffect(() => { headingRef.current?.focus(); }, [step]);

  const complete = (...ids: string[]) => ids.every(id => answers[id] !== undefined && answers[id] !== "");
  const listeningReady = complete("l1", "l2", "l3", "l4", "l5", "l6");
  const contextReady = complete("r1", "r2", "r3", "r4");
  const writingReady = complete("w1", "w2", "w3");
  const speakingReady = complete("s1", "s2", "s3", "s4", "repair");

  const listening = [answers.l1 === "Evening arrival", answers.l2 === "Leaving with a daytime wish", answers.l3 === "Maya", answers.l4 === "u", answers.l5 === "é", answers.l6 === "Nasal vowel"].filter(Boolean).length;
  const reading = [answers.r1 === "Je ne comprends pas.", answers.r2 === "Plus lentement, s’il vous plaît.", answers.r3 === "Merci.", answers.r4 === "Excusez-moi."].filter(Boolean).length;
  const w1 = clean(answers.w1) === "inès" ? 2 : plain(answers.w1) === "ines" ? 1 : 0;
  const w2 = clean(answers.w2) === "à demain" ? 1.5 : plain(answers.w2) === "a demain" ? 1 : 0;
  const repeat = plain(answers.w3).includes("pouvez-vous repeter") && plain(answers.w3).includes("s'il vous plait");
  const w3 = repeat ? (clean(answers.w3).includes("répéter") && clean(answers.w3).includes("s'il vous plaît") ? 1.5 : 1) : 0;
  const writing = w1 + w2 + w3;
  const speaking = ["s1", "s2", "s3", "s4"].reduce((sum, id) => sum + Number(answers[id] ?? 0), 0);
  const total = listening + reading + writing + speaking;
  const passed = total >= 17 && listening >= 4 && speaking >= 5 && answers.repair === "yes";

  const submit = async () => {
    try { if (learner.enrollment) { await learner.repository.saveLessonPosition(lessonId, 5); if (passed) await learner.repository.completeLesson(lessonId); await learner.refresh(); } setStep(5); }
    catch { setSaveError("Your result could not be saved locally. It is still shown below."); setStep(5); }
  };
  const retry = () => { setAnswers({}); setSaveError(undefined); setStep(0); };
  if (learner.loading) return <p role="status">Loading capability assessment…</p>;

  return <article className="lesson-flow lesson-player capability-assessment"><header className="lesson-flow__header"><Link to="/learn/a1/unit/first-contact">← Unit 1 outline</Link><p className="learn-preview-kicker">Unit 1 · Capability assessment · {steps[step]}</p><h1>Handle a first-contact exchange</h1><p className="page-sub">Show what you can understand and say without lesson hints. Results appear only after submission.</p><Progress label="Assessment progress" value={step} max={5}/><ol className="lesson-stepper" aria-label="Assessment steps">{steps.map((label,index)=><li key={label} className={index===step?"is-current":index<step?"is-done":""}><span>{index+1}</span>{label}</li>)}</ol>{saveError&&<Feedback title="Save issue" tone="error">{saveError}</Feedback>}</header>

  {step===0&&<section className="lesson-stage lesson-scene lesson-two-scene"><img src="/images/course/a1/unit-01/capability-assessment-workshop-v1.png" alt="Sofia receives a document from Morgan as an evening French workshop begins."/><div className="lesson-scene__copy"><div className="lesson-stage-intro"><p className="learn-preview-kicker">Sofia meets Morgan</p><h2 ref={headingRef} tabIndex={-1}>One new exchange, all your Unit 1 skills</h2><p>You will complete 14 tasks worth 23 points. Listening clips can be played twice. There are no hints or correctness signals until you submit.</p></div><div className="summary-grid"><Card title="Readiness target"><p>17/23 overall, at least 4/6 in listening, and at least 5/8 in speaking with a repair phrase attempted.</p></Card><Card title="About speaking"><p>Say the exchange aloud, then score it honestly with the four visible criteria. Recording is not required.</p></Card></div><Button onClick={()=>setStep(1)}>Begin assessment →</Button></div></section>}

  {step===1&&<section className="lesson-stage"><p className="learn-preview-kicker">6 points</p><h2 ref={headingRef} tabIndex={-1}>Listening and sound</h2><p>Each clip is available twice. Select the best answer; your choices are not marked yet.</p><div className="activity-stack"><div><LimitedAudio text="Bonsoir" label="Play clip 1"/><Choice id="l1" prompt="What situation fits?" options={["Evening arrival","Morning arrival","Daytime departure"]} value={answers.l1} onChange={set}/></div><div><LimitedAudio text="Bonne journée" label="Play clip 2"/><Choice id="l2" prompt="What is the speaker doing?" options={["Leaving with a daytime wish","Arriving in the evening","Asking for help"]} value={answers.l2} onChange={set}/></div><div><LimitedAudio text="M, A, Y, A" label="Play clip 3"/><Choice id="l3" prompt="Which name was spelled?" options={["Maya","Mia","Aya"]} value={answers.l3} onChange={set}/></div><div><LimitedAudio text="rue" label="Play clip 4"/><Choice id="l4" prompt="Which vowel sound is in the word?" options={["u","ou"]} value={answers.l4} onChange={set}/></div><div><LimitedAudio text="été" label="Play clip 5"/><Choice id="l5" prompt="Which sound begins the word?" options={["é","è"]} value={answers.l5} onChange={set}/></div><div><LimitedAudio text="sans" label="Play clip 6"/><Choice id="l6" prompt="What kind of vowel do you hear?" options={["Nasal vowel","Oral vowel"]} value={answers.l6} onChange={set}/></div></div></section>}

  {step===2&&<section className="lesson-stage"><p className="learn-preview-kicker">4 points</p><h2 ref={headingRef} tabIndex={-1}>Reading and context</h2><div className="activity-stack"><Choice id="r1" prompt="You did not understand the instruction." options={["Je ne comprends pas.","Je comprends.","De rien."]} value={answers.r1} onChange={set}/><Choice id="r2" prompt="Morgan is speaking too quickly." options={["Plus lentement, s’il vous plaît.","Comment ça s’écrit ?","Bonne journée."]} value={answers.r2} onChange={set}/><Choice id="r3" prompt="Morgan gives Sofia the handout." options={["Merci.","Pardon.","Bonsoir."]} value={answers.r3} onChange={set}/><Choice id="r4" prompt="Sofia needs to interrupt politely." options={["Excusez-moi.","Au revoir.","De rien."]} value={answers.r4} onChange={set}/></div></section>}

  {step===3&&<section className="lesson-stage"><p className="learn-preview-kicker">5 points</p><h2 ref={headingRef} tabIndex={-1}>Writing</h2><p>Accents contribute to the score, but a correct phrase without them can still earn partial credit.</p><div className="assessment-writing"><label><span>Listen, then type the name.</span><LimitedAudio text="I, N, È, S" label="Play spelled name"/><input value={answers.w1??""} onChange={event=>set("w1",event.target.value)} autoComplete="off"/></label><label><span>Write “See you tomorrow” in French.</span><input value={answers.w2??""} onChange={event=>set("w2",event.target.value)} autoComplete="off"/></label><label><span>Politely ask someone to repeat.</span><input value={answers.w3??""} onChange={event=>set("w3",event.target.value)} autoComplete="off"/></label></div></section>}

  {step===4&&<section className="lesson-stage"><p className="learn-preview-kicker">8 points</p><h2 ref={headingRef} tabIndex={-1}>Speaking interaction</h2><div className="role-play"><strong>Your situation</strong><p>You arrive at the evening workshop. Greet Morgan, ask them to repeat or slow down, thank them, and leave appropriately.</p><p className="assessment-model"><strong>Say your response aloud now.</strong> Take your time; no recording is stored.</p></div><p>Score each part from 0 to 2: <strong>0</strong> not yet, <strong>1</strong> understandable with effort, <strong>2</strong> clear and appropriate.</p><div className="activity-stack">{[["s1","Greeting fit the evening situation"],["s2","Repair request was understandable"],["s3","Thanks fit naturally"],["s4","Farewell fit the situation"]].map(([id,prompt])=><Choice key={id} id={id} prompt={prompt} options={["0","1","2"]} value={answers[id]} onChange={set}/>)}</div><Choice id="repair" prompt="Did you attempt a repetition or slower-speech phrase aloud?" options={["yes","no"]} value={answers.repair} onChange={set}/><Button disabled={!speakingReady} onClick={()=>void submit()}>Submit assessment</Button></section>}

  {step===5&&<section className="lesson-stage lesson-summary"><p className="lesson-celebration">{passed?"✓":"↻"}</p><p className="learn-preview-kicker">Assessment submitted</p><h2 ref={headingRef} tabIndex={-1}>{passed?"Unit 1 ready":"A little more practice will help"}</h2><p className="assessment-score"><strong>{total}/23</strong> points</p><div className="summary-grid"><Card title={`Listening · ${listening}/6`}><p>{listening>=4?"Readiness target met.":"Revisit names, greetings, and sound contrasts."}</p></Card><Card title={`Context · ${reading}/4`}><p>{reading>=3?"Context choices are working well.":"Review courtesy and repair situations."}</p></Card><Card title={`Writing · ${writing}/5`}><p>{writing>=3.5?"Core written phrases are ready.":"Practise accents and the full repetition request."}</p></Card><Card title={`Speaking · ${speaking}/8`}><p>{speaking>=5&&answers.repair==="yes"?"Interaction target met.":"Repeat the scenario and include a repair phrase."}</p></Card></div><Feedback title={passed?"Ready for the next unit":"Recommended next move"} tone={passed?"success":"info"}>{passed?"You met the overall, listening, and speaking thresholds.":"Use the section notes above, revisit the relevant lesson, then try this assessment again."}</Feedback><div className="lesson-inline-actions"><Button onClick={retry}>Try a fresh attempt</Button><Link to="/learn/a1/unit/first-contact">Back to Unit 1 →</Link></div></section>}

  {step>0&&step<5&&<nav className="lesson-navigation" aria-label="Assessment navigation"><Button variant="secondary" onClick={()=>setStep(step-1)}>← Previous</Button>{step<4&&<Button disabled={(step===1&&!listeningReady)||(step===2&&!contextReady)||(step===3&&!writingReady)} onClick={()=>setStep(step+1)}>Continue to {steps[step+1]} →</Button>}</nav>}
  </article>;
}
