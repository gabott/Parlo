// ============================================================
//  Flashcards — flip a card to reveal the meaning + example
// ============================================================
import { useState } from "react";
import { flashcards } from "./data";
import { speak } from "./speak";

export default function Flashcards() {
  // "index" = which card we are on. "flipped" = is it showing the back?
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const card = flashcards[index];

  // Go to the next card (wraps back to the start at the end).
  function next() {
    setFlipped(false);
    setIndex((index + 1) % flashcards.length);
  }

  // Go to the previous card.
  function prev() {
    setFlipped(false);
    setIndex((index - 1 + flashcards.length) % flashcards.length);
  }

  return (
    <div className="panel">
      <p className="counter">
        Card {index + 1} of {flashcards.length}
      </p>

      {/* Clicking the card flips it */}
      <button className="card" onClick={() => setFlipped(!flipped)}>
        {flipped ? (
          <div>
            <div className="card-en">{card.en}</div>
            <div className="card-example">“{card.example}”</div>
          </div>
        ) : (
          <div className="card-fr">{card.fr}</div>
        )}
        <div className="card-hint">
          {flipped ? "click to hide" : "click to reveal"}
        </div>
      </button>

      {/* 🔊 Pronounce the French. This is OUTSIDE the card button
          above, so clicking it speaks without flipping the card. */}
      <div className="row">
        <button className="btn" onClick={() => speak(card.fr)}>
          🔊 Say the word
        </button>
        <button className="btn" onClick={() => speak(card.example)}>
          🔊 Say the example
        </button>
      </div>

      <div className="row">
        <button className="btn" onClick={prev}>← Previous</button>
        <button className="btn primary" onClick={next}>Next →</button>
      </div>
    </div>
  );
}
