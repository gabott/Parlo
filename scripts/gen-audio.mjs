// ============================================================
//  gen-audio.mjs — pre-generate native French MP3s
// ------------------------------------------------------------
//  Reads all the French text from src/data.js, and creates one
//  MP3 per phrase in public/audio/ using Microsoft's free
//  neural voice (via the `edge-tts` Python tool).
//
//  RUN IT WITH:   npm run audio
//
//  Re-run this whenever you add/change French content in
//  data.js. Existing files are skipped, so it's fast.
// ============================================================
import { flashcards, unscramble } from "../src/data.js";
import { vocabulary } from "../src/content/vocabulary.js";
import { phrases } from "../src/content/phrases.js";
import { grammar } from "../src/content/grammar.js";
import { alphabet, accents } from "../src/content/alphabet.js";
import { numbers0to20, numbersTens, numbersTricky } from "../src/content/numbers.js";
import { commonWords } from "../src/content/commonWords.js";
import { days, months, seasons, datePhrases } from "../src/content/daysMonths.js";
import { questionWords } from "../src/content/questionWords.js";
import { colors } from "../src/content/colors.js";
import { audioKey } from "../src/audioKey.js";
import unitOneBundle from "../generated/bundles/a1-0.1.0-draft.json" with { type: "json" };
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

// Which native voice to use. Some nice French options:
//   fr-FR-DeniseNeural (female), fr-FR-HenriNeural (male),
//   fr-CA-SylvieNeural (Canadian female), fr-CA-JeanNeural (Canadian male)
const VOICE = "fr-FR-DeniseNeural";

const outDir = path.resolve("public/audio");
mkdirSync(outDir, { recursive: true });

// Collect every French string the app might speak.
// We keep the ORIGINAL text as the key (so the app matches it),
// but clean it slightly before sending to the voice.
const texts = new Set();
for (const c of flashcards) {
  texts.add(c.fr);
  if (c.example) texts.add(c.example);
}
for (const u of unscramble) {
  texts.add(u.answer);
}
for (const w of vocabulary) {
  texts.add(w.fr);
}
for (const p of phrases) {
  texts.add(p.fr);
}
for (const g of grammar) {
  for (const ex of g.examples) texts.add(ex.fr);
}
// Basics: alphabet (letter names + example words), numbers, common words.
for (const l of alphabet) {
  texts.add(l.letter);
  texts.add(l.example);
}
for (const a of accents) {
  texts.add(a.example);
}
for (const x of [...numbers0to20, ...numbersTens, ...numbersTricky]) {
  texts.add(x.fr);
}
for (const w of commonWords) {
  texts.add(w.fr);
}
// Days, months, seasons, and date phrases.
for (const d of days) texts.add(d.fr);
for (const m of months) texts.add(m.fr);
for (const s of seasons) texts.add(s.fr);
for (const p of datePhrases) texts.add(p.fr);
// Question words (spoken form drops the "/ alt") + their example sentences.
for (const q of questionWords) {
  texts.add(q.fr.replace(/ \/ .*$/, ""));
  for (const ex of q.examples) texts.add(ex.fr);
}
for (const c of colors) {
  texts.add(c.fr);
  texts.add(c.phrase);
}
// Compiled Learn content: reviewed phrases plus visible activity options.
for (const phrase of unitOneBundle.phrases) {
  texts.add(phrase.french.text);
  texts.add(phrase.french.text.replace(/[.!?]\s*$/, "").trim());
}
for (const item of unitOneBundle.items) {
  for (const option of item.payload.options ?? []) {
    texts.add(option.text);
    texts.add(option.text.replace(/[.!?]\s*$/, "").trim());
  }
  if (item.payload.audio_text) {
    texts.add(item.payload.audio_text);
    texts.add(item.payload.audio_text.replace(/[.!?]\s*$/, "").trim());
  }
}
// Dialogue lines are authored as presentation copy until dialogue entities land.
texts.add("Bonjour ! Ça va ?");
texts.add("Ça va ?");
texts.add("Ça va bien, merci.");
texts.add("À demain ! Bonne journée !");
texts.add("Au revoir ! À demain !");
texts.add("Bonjour ! Bonjour ! Ça va ? Ça va bien, merci.");
texts.add("Au revoir ! À demain ! Bonne journée !");
// Lesson 2: reception dialogue, spelling chunks, and name sequences.
texts.add("Bonjour. Votre prénom ? Ira. Comment ça s'écrit ? I, R, A. Merci.");
texts.add("Votre prénom ?");
texts.add("Comment ça s'écrit ?");
texts.add("Ça s'écrit I, R, A.");
for (const spelling of ["L, É, A", "A, M, I, R", "S, O, F, I, A", "H, U, G, O"]) texts.add(spelling);

// Remove the "…" placeholder so the voice doesn't stumble.
function clean(t) {
  return t.replace(/…/g, "").replace(/\s+/g, " ").trim();
}

let made = 0;
let skipped = 0;

for (const text of texts) {
  const file = path.join(outDir, audioKey(text) + ".mp3");
  if (existsSync(file)) {
    skipped++;
    continue;
  }
  const spoken = clean(text);
  if (!spoken) continue;

  process.stdout.write(`generating: "${spoken}" ... `);
  try {
    execFileSync(
      "python",
      ["-m", "edge_tts", "--voice", VOICE, "--text", spoken, "--write-media", file],
      { stdio: ["ignore", "ignore", "inherit"] }
    );
    console.log("done");
    made++;
  } catch {
    console.log("FAILED (needs internet + edge-tts installed)");
  }
}
console.log(`\nAudio ready. Created ${made}, skipped ${skipped} existing.`);
