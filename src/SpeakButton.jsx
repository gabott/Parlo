// ============================================================
//  SpeakButton — a small reusable 🔊 button
// ------------------------------------------------------------
//  Used all over the app. Give it the French text to pronounce.
//  Example:  <SpeakButton text="Bonjour" />
// ============================================================
import { speak } from "./speak";

export default function SpeakButton({ text, label = "" }) {
  return (
    <button
      className="speak-btn"
      title="Listen"
      onClick={(e) => {
        e.stopPropagation(); // don't trigger clicks on a parent card
        speak(text);
      }}
    >
      🔊{label ? ` ${label}` : ""}
    </button>
  );
}
