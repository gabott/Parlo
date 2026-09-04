// ============================================================
//  Quiz — multiple-choice questions with a final score.
// ============================================================
import { useState } from "react";
import { quiz } from "./data";

export default function Quiz() {
  const [index, setIndex] = useState(0);        // current question
  const [selected, setSelected] = useState(null); // the option the user clicked
  const [score, setScore] = useState(0);        // how many correct so far
  const [done, setDone] = useState(false);      // finished the quiz?

  const current = quiz[index];

  // When the user clicks an option.
  function choose(option) {
    if (selected) return; // ignore extra clicks once answered
    setSelected(option);
    if (option === current.answer) {
      setScore(score + 1);
    }
  }

  // Move to the next question, or finish.
  function next() {
    if (index + 1 < quiz.length) {
      setIndex(index + 1);
      setSelected(null);
    } else {
      setDone(true);
    }
  }

  // Start over.
  function restart() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setDone(false);
  }

  // The end screen.
  if (done) {
    return (
      <div className="panel center">
        <h2>Quiz complete! 🎉</h2>
        <p className="score-big">
          {score} / {quiz.length}
        </p>
        <p>{score === quiz.length ? "Parfait ! Perfect score!" : "Bien joué — try again to improve!"}</p>
        <button className="btn primary" onClick={restart}>Try again</button>
      </div>
    );
  }

  return (
    <div className="panel">
      <p className="counter">
        Question {index + 1} of {quiz.length}
      </p>
      <h3 className="question">{current.question}</h3>

      <div className="options">
        {current.options.map((option) => {
          // Decide the button's colour after an answer is chosen.
          let className = "option";
          if (selected) {
            if (option === current.answer) className += " correct";
            else if (option === selected) className += " wrong";
          }
          return (
            <button
              key={option}
              className={className}
              onClick={() => choose(option)}
            >
              {option}
            </button>
          );
        })}
      </div>

      {/* Only show "Next" once an answer is picked */}
      {selected && (
        <div className="row">
          <button className="btn primary" onClick={next}>
            {index + 1 < quiz.length ? "Next question →" : "See results"}
          </button>
        </div>
      )}
    </div>
  );
}
