# Parlo 🇫🇷 — Learn French, all in one place

**Parlo** is a friendly, beginner‑to‑B2+ French learning portal — one consolidated place to
study instead of hunting across scattered websites. It brings together the alphabet, numbers,
vocabulary, grammar, everyday phrases, practice games and curated videos, **each with native
French pronunciation**.

Built with **React + Vite**, and designed to be simple enough to learn from if you're new to
React.

> Learning target: **A1 → B2+**, geared toward the **TEF Canada** exam.

---

## ✨ Features

- **🧱 Basics** — five foundations in one section:
  - 🔤 **Alphabet** — all 26 letters with their French names + example words, plus accented letters
  - 🔢 **Numbers** — 0–20, tens, and the tricky 70/80/90 (with a plain‑language explainer)
  - 🔥 **Top 100 words** — the most frequent French words, searchable and filterable by type
  - 📅 **Days & Months** — days, months, seasons, and how to say the date
  - ❓ **Question words** — qui, que/quoi, où, quand, comment, pourquoi, combien, quel/quelle — with example questions
- **📚 Vocabulary** — themed words with gender colour‑coding
- **✏️ Grammar** — core topics with worked examples
- **💬 Phrases** — practical everyday sentences
- **🎯 Practice** — Flashcards, Sentence Unscramble, and a Quiz
- **▶️ Videos** — curated YouTube channels to learn and listen
- **🇨🇦 TEF Exam** — an overview of the exam sections
- **🔊 Native pronunciation everywhere** — pre‑generated MP3s from a neural French voice,
  so it sounds native, works offline, and isn't blocked by browser security.

---

## 🚀 Run it locally

```bash
npm install     # first time only (downloads React, Vite, etc.)
npm run dev      # start the dev server, then open the link it prints (e.g. http://localhost:5173/)
```

The page auto‑refreshes when you save a file. Stop the server with `Ctrl + C`.

To build for production:

```bash
npm run build    # outputs a static site into dist/
npm run preview  # preview the production build locally
```

---

## 🔊 How the pronunciation works

Browser text‑to‑speech is unreliable for native French (many PCs only have English voices, and
online voices get blocked by browser security). So Parlo uses **pre‑generated static MP3 files**
instead.

- The generator script reads every French string in the app and creates one MP3 per phrase using
  Microsoft's free neural voice via [`edge-tts`](https://github.com/rany2/edge-tts).
- At runtime, [`src/speak.js`](src/speak.js) plays the matching MP3 from `public/audio/`
  (same‑origin, so it always works). If a file is ever missing, it falls back to the browser voice.

### Regenerating audio after you add content

```bash
pip install edge-tts   # one-time, needs Python + internet
npm run audio          # generates any missing MP3s (existing ones are skipped, so it's fast)
```

The voice is set near the top of [`scripts/gen-audio.mjs`](scripts/gen-audio.mjs)
(`fr-FR-DeniseNeural`). Swap it for `fr-CA-SylvieNeural` for a Canadian accent, then re‑run
`npm run audio`.

---

## 🗂️ Project structure

```
parlo/
├─ index.html              # page shell + Google Fonts
├─ scripts/
│  └─ gen-audio.mjs        # generates native MP3s from the French content
├─ public/
│  ├─ audio/               # pre-generated pronunciation MP3s (deployed)
│  └─ images/              # section photos (deployed)
└─ src/
   ├─ App.jsx              # sidebar shell + simple state-based navigation
   ├─ App.css              # theme + layout (purple brand, one --accent variable)
   ├─ speak.js             # plays native MP3s, browser fallback
   ├─ audioKey.js          # shared text→filename hash (used by app AND generator)
   ├─ Sidebar.jsx, SpeakButton.jsx, PageHeader.jsx
   ├─ pages/               # one component per section (Dashboard, Basics, Vocabulary, …)
   └─ content/             # editable data files (alphabet, numbers, commonWords, …)
```

**To add or edit content**, change the files in `src/content/` — no React knowledge needed —
then run `npm run audio` to generate pronunciation for any new French text.

---

## 🛠️ Tech

- **React 19** + **Vite** (fast dev server & build)
- Plain CSS (no framework) — the whole theme is driven by a couple of `--accent` variables
- No router and no backend — it's a static site, so hosting is free and simple

---

## 📦 Deploy

This is a static Vite site, so it deploys anywhere. The easy path:

1. Push to GitHub (already done 🎉)
2. Import the repo at [vercel.com](https://vercel.com) → Vercel auto‑detects Vite → **Deploy**
3. Every future push auto‑redeploys the live site.

The `public/audio` and `public/images` folders are committed (not git‑ignored), so pronunciation
and photos work on the live site out of the box.

---

*Bonne chance avec ton français ! 🇫🇷*
