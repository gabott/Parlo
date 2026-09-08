// ============================================================
//  speak.js — pronounce French text in a NATIVE voice
// ------------------------------------------------------------
//  How it works:
//   1) First choice: play a pre-generated native French MP3
//      from /public/audio (made by `npm run audio`, using
//      Microsoft's neural voice). Sounds native, works offline,
//      and isn't blocked by browser security.
//   2) Fallback: if no MP3 exists for this text, use the
//      browser's built-in voice.
//
//  To (re)generate the MP3s after editing data.js, run:
//      npm run audio
// ============================================================
import { audioKey } from "./audioKey";

// Keep a reference so a new click can stop the previous audio.
let currentAudio = null;

// Speak a piece of French text aloud.
export function speak(text, { rate = 1, allowBrowserFallback = true } = {}) {
  if (!text) return;

  // Stop anything already playing (audio or browser voice).
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }

  // --- 1) Play the pre-generated native MP3 ----------------
  // BASE_URL keeps this working both locally and when hosted.
  const file = `${import.meta.env.BASE_URL}audio/${audioKey(text)}.mp3`;
  const audio = new Audio(file);
  audio.playbackRate = rate;
  currentAudio = audio;
  let fallbackStarted = false;
  const fallbackOnce = () => {
    if (fallbackStarted) return;
    fallbackStarted = true;
    if (allowBrowserFallback) browserFallback(text, rate);
  };

  // If the MP3 is missing, fall back to the browser voice.
  audio.onerror = fallbackOnce;
  audio.play().catch(fallbackOnce);
}

// --- 2) Browser built-in voice (used only if MP3 missing) ---
function browserFallback(text, rate = 0.9) {
  if (!("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";   // French pronunciation
  utterance.rate = rate;

  // Try to pick an actual French voice if one is installed.
  const frenchVoice = window.speechSynthesis
    .getVoices()
    .find((v) => v.lang && v.lang.toLowerCase().startsWith("fr"));
  if (frenchVoice) {
    utterance.voice = frenchVoice;
  }

  // Say it!
  window.speechSynthesis.speak(utterance);
}
