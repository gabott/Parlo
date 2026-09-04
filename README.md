# Parlo 🇫🇷 — Your French Learning App

A simple, beginner-friendly **React** app for learning French (A1 level, "Se présenter").
Three activities: **Flashcards**, **Sentence Unscramble**, and a **Quiz** — each with
🔊 **native French pronunciation**.

This README is written for someone **new to React**. Read it top to bottom and you'll
understand your own project.

---

## 1. How to run the app

```bash
npm install     # only the first time (downloads React etc.)
npm run dev     # start the app, then open the link it prints (usually http://localhost:5173/)
```

The page **auto-refreshes** when you save a file. Stop the server with `Ctrl + C`.

Other commands:
- `npm run build` — make an optimized version in `dist/` (used for hosting).
- `npm run preview` — preview that built version locally.
- `npm run audio` — (re)generate the native French MP3s. See §6.

---

## 2. The big picture: what is React?

React builds a page out of **components** — reusable UI pieces, like LEGO bricks:

```
App  ← the whole page (header + tabs)
 ├── Flashcards   ← flashcard activity
 ├── Unscramble   ← sentence puzzle
 └── Quiz         ← multiple-choice quiz
```

Each component is a function that **returns what to show** (the HTML-looking code is **JSX**).
When data changes, React re-draws the screen for you.

---

## 3. The two React ideas you need

**a) `useState` — a component's memory**
```jsx
const [score, setScore] = useState(0);
```
- `score` = current value (starts at `0`).
- `setScore` = the only way to change it; calling it also tells React to redraw.
  (Never write `score = 5` directly — React won't notice.)

**b) Props — passing data into a component.** A parent gives values to a child,
e.g. `<Card word="Bonjour" />`. (We mostly read from `data.js` instead, to keep things simple.)

That's most of what you need. Everything else is normal JavaScript.

---

## 4. File-by-file tour

### 📄 `src/data.js` — **START HERE. This is your content.**
All the French lives here: flashcards, sentences, quiz questions.
**Edit this without knowing any React** — it's just lists of text. Example: add a flashcard by
adding one line to the `flashcards` list:
```js
{ fr: "Merci", en: "Thank you", example: "Merci beaucoup !" },
```
Save → the app instantly shows the new card. (Run `npm run audio` to add its pronunciation.)

### 📄 `src/App.jsx` — the home base
Shows the header and the three tab buttons, and remembers which tab is open:
```jsx
{tab === "quiz" && <Quiz />}   // "if tab is quiz, show the Quiz component"
```

### 📄 `src/Flashcards.jsx` — flip cards + 🔊 buttons
Remembers the current card (`index`) and whether it's flipped (`flipped`).
The 🔊 buttons call `speak(...)` to pronounce the word/example.

### 📄 `src/Unscramble.jsx` — build the sentence
`pool` = words you can pick, `picked` = words you placed. "Check" compares your
sentence to the answer. 🔊 "Hear it" plays the correct sentence.

### 📄 `src/Quiz.jsx` — multiple choice + score
Tracks the question `index`, your `selected` answer, the `score`, and whether you're `done`.
Colors the right option green and a wrong pick red.

### 📄 `src/speak.js` — pronunciation (see §5)
### 📄 `src/audioKey.js` — turns a phrase into its MP3 filename (don't edit).
### 📄 `src/App.css` — all colors/layout. Change the purple `#6d28d9` to re-theme.
### 📄 `src/main.jsx` — the starter switch. Leave as-is.

---

## 5. How pronunciation works 🔊

Clicking a 🔊 button calls `speak(text)` in `src/speak.js`, which:
1. **Plays a pre-made native MP3** from `public/audio/` (made with Microsoft's free neural
   voice). Sounds native, works offline, isn't blocked by browsers.
2. **Falls back** to the browser's built-in voice only if that MP3 is missing.

> Why pre-made files? Browsers now block streaming from free online TTS URLs (CORS/ORB),
> and your PC may not have a French voice installed — so bundling real MP3s is the reliable
> way to get **native** sound for everyone.

---

## 6. Generating / changing the audio

The MP3s are created by a small script using the `edge-tts` tool.

**One-time setup:**
```bash
pip install edge-tts     # (or: python -m pip install edge-tts)
```

**Generate the audio** (needs internet; existing files are skipped):
```bash
npm run audio
```

This reads every French phrase in `data.js` and writes MP3s into `public/audio/`.
Re-run it whenever you add or change French content.

**Change the voice:** edit `VOICE` near the top of `scripts/gen-audio.mjs`. Options include:
- `fr-FR-DeniseNeural` (France, female — default)
- `fr-FR-HenriNeural` (France, male)
- `fr-CA-SylvieNeural` (Canada, female)
- `fr-CA-JeanNeural` (Canada, male)

Since your goal is **TEF Canada**, you may prefer the `fr-CA-…` voices. After changing the
voice, delete the old files in `public/audio/` and run `npm run audio` again.

---

## 7. Optional: install a Windows French voice (for the fallback voice)

The app already sounds native via the MP3s, so this is **optional**. But if you want the
browser's *built-in* voice (the fallback) to also be French:

1. **Settings → Time & Language → Language & region**
2. **Add a language** → choose **Français (France)** (or **Français (Canada)**)
3. Click it → **Language options** → install the **Speech** pack
4. Restart your browser

After that, Windows has real French voices (e.g. Hortense/Paul), used automatically if an
MP3 is ever missing.

---

## 8. Try these small edits (great practice)

1. **Add a flashcard** in `data.js`, then run `npm run audio`.
2. **Add a quiz question** — copy a `{ question, options, answer }` block; make sure `answer`
   exactly matches one of the `options`.
3. **Re-theme** — in `App.css`, replace `#6d28d9` with another color.
4. **Rename the app** — in `App.jsx`, change the `<h1>` text.

Save after each edit and watch the browser update instantly. Errors show the file + line.

---

## 9. Where this is going

This is Phase 1 (a "vertical slice") of a bigger A1→B2+ portal with progress tracking,
more puzzles, listening/video hubs, and **TEF Canada exam prep**. See `plan.md` for the
full vision — we grow it one small, working piece at a time.

---

## 10. Hosting it later (free)

1. Push this folder to a **GitHub** repo.
2. Connect the repo to **Vercel** (free) — it auto-builds and gives you a live URL.
3. Every push updates the live site automatically. (Vercel recognizes Vite/React automatically.)

The `public/audio/` MP3s are committed with the project, so pronunciation works on the
hosted site too.

---

**Bon courage, et bon apprentissage ! 🇫🇷**
