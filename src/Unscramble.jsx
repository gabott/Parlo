// ============================================================
//  Sentence Unscramble — click words to build the sentence,
//  then check if the order is correct.
// ============================================================
import { useState } from "react";
import { unscramble } from "./data";
import { speak } from "./speak";

// Small helper: shuffle a copy of an array (so we don't change the original).
function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Unscramble() {
  const [index, setIndex] = useState(0);              // which sentence
  const [pool, setPool] = useState(() => shuffle(unscramble[0].words)); // shuffled words to pick from
  const [picked, setPicked] = useState([]);           // words chosen, in order
  const [result, setResult] = useState(null);         // "correct" | "wrong" | null

  const current = unscramble[index];

  // Move a word from the pool into the picked list.
  function pickWord(word, i) {
    setPicked([...picked, word]);
    setPool(pool.filter((_, idx) => idx !== i));
    setResult(null);
  }

  // Put the last picked word back (simple undo).
  function undo() {
    if (picked.length === 0) return;
    const last = picked[picked.length - 1];
    setPicked(picked.slice(0, -1));
    setPool([...pool, last]);
    setResult(null);
  }

  // Check the built sentence against the correct answer.
  function check() {
    const built = picked.join(" ");
    setResult(built === current.answer ? "correct" : "wrong");
  }

  // Load the next sentence (wraps around) and reset everything.
  function next() {
    const nextIndex = (index + 1) % unscramble.length;
    setIndex(nextIndex);
    setPool(shuffle(unscramble[nextIndex].words));
    setPicked([]);
    setResult(null);
  }

  return (
    <div className="panel">
      <p className="counter">
        Sentence {index + 1} of {unscramble.length} — tap the words in order
      </p>

      {/* The sentence being built */}
      <div className="build-area">
        {picked.length === 0 ? (
          <span className="placeholder">Your sentence appears here…</span>
        ) : (
          picked.map((w, i) => (
            <span key={i} className="chip picked">{w}</span>
          ))
        )}
      </div>

      {/* Word bank */}
      <div className="word-pool">
        {pool.map((w, i) => (
          <button key={i} className="chip" onClick={() => pickWord(w, i)}>
            {w}
          </button>
        ))}
      </div>

      <div className="row">
        <button className="btn" onClick={undo}>Undo</button>
        <button className="btn primary" onClick={check}>Check</button>
        <button className="btn" onClick={() => speak(current.answer)}>🔊 Hear it</button>
        <button className="btn" onClick={next}>Skip / Next →</button>
      </div>

      {/* Feedback message */}
      {result === "correct" && <p className="feedback good">✅ Correct! Bravo !</p>}
      {result === "wrong" && (
        <p className="feedback bad">❌ Not quite. Correct answer: “{current.answer}”</p>
      )}
    </div>
  );
}
