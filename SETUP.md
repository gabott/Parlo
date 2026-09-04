# 🛠️ Parlo — Setup & Workflow Guide

Everything you need to run, edit, and publish Parlo from any machine.
The project lives on GitHub and auto-deploys to Vercel, so nothing depends on a single computer.

- **Live site:** https://parlo-three.vercel.app/
- **Repo:** https://github.com/gabott/Parlo
- **Auto-deploy:** every `git push` to `main` → live in ~1 minute

---

## 📋 Prerequisites (install once)

| Tool | Why | Get it |
|------|-----|--------|
| **Git** | clone + push | https://git-scm.com/downloads |
| **Node.js** (LTS, v20+) | run/build the app | https://nodejs.org |
| **Python 3** | regenerate audio | https://python.org (tick "Add to PATH") |
| **VS Code + GitHub Copilot** | edit with Copilot | https://code.visualstudio.com |

---

## 🚀 Step 1 — Clone & run

```bash
git clone https://github.com/gabott/Parlo.git
cd Parlo
npm install
npm run dev
```

Open the link it prints (usually http://localhost:5173/).
The pronunciation MP3s and images are committed, so audio works immediately after cloning.

Build / preview a production version:

```bash
npm run build
npm run preview
```

---

## 🪪 Step 2 — Set your personal Git identity (important!)

So your commits use your personal email, not a work one:

```bash
git config user.name  "Your Name"
git config user.email "your-personal@email.com"
```

(The first `git push` from a new machine will prompt a GitHub login — approve it once.)

---

## ✏️ Step 3 — The edit → publish loop

```bash
# 1. Make changes (edit files in src/content/, etc.)

# 2. If you ADDED new French text, regenerate audio:
pip install edge-tts   # one-time
npm run audio          # creates only the missing MP3s (fast)

# 3. Publish:
git add -A
git commit -m "describe your change"
git push               # Vercel auto-redeploys the live site
```

---

## 💡 Key things to remember

- **Content lives in `src/content/`** — plain data files (alphabet, numbers, commonWords,
  daysMonths, questionWords, vocabulary, grammar, phrases, videos). No React knowledge needed
  to add words/phrases.
- **After adding French text, always run `npm run audio`** and commit the new files in
  `public/audio/`. Otherwise that text falls back to a non-native browser voice.
- **Never change the hash in `src/audioKey.js`.** It's the shared link between the audio
  generator and the app — if it changes, every existing MP3 filename stops matching and you'd
  have to regenerate all audio.
- **The whole theme is driven by a couple of `--accent` variables** at the top of `src/App.css`
  (brand purple `#6d28d9`). Change those two lines to re-theme the entire site.
- **Voice:** set near the top of `scripts/gen-audio.mjs` (`fr-FR-DeniseNeural`). Swap to
  `fr-CA-SylvieNeural` for a Canadian accent, then re-run `npm run audio`.

---

## 🗂️ Project map

```
parlo/
├─ scripts/gen-audio.mjs   # generates native MP3s from the French content
├─ public/
│  ├─ audio/               # pre-generated pronunciation MP3s (committed & deployed)
│  └─ images/              # section photos (committed & deployed)
└─ src/
   ├─ App.jsx              # sidebar shell + simple state-based navigation
   ├─ App.css              # theme + layout (purple brand, --accent variables)
   ├─ speak.js             # plays native MP3s, browser fallback if missing
   ├─ audioKey.js          # shared text→filename hash (DO NOT change)
   ├─ Sidebar / SpeakButton / PageHeader
   ├─ pages/               # one component per section (Dashboard, Basics, …)
   └─ content/             # editable data files ← add words/phrases here
```

---

## 🤖 Give your Copilot instant context

When you open this project in VS Code, paste this to your Copilot so it's immediately up to speed:

> This is **Parlo**, a React + Vite French learning app (beginner → B2+, TEF Canada).
> Content data files are in `src/content/`. Native pronunciation uses pre-generated MP3s in
> `public/audio/` created by `npm run audio` (edge-tts, voice `fr-FR-DeniseNeural`); the app
> plays them via `src/speak.js` using the shared hash in `src/audioKey.js` — **never change that
> hash** without regenerating all audio. The whole theme is driven by `--accent` variables at the
> top of `src/App.css`. It deploys to Vercel automatically on `git push`. Keep it
> beginner-friendly (no router, no backend, plain CSS).

---

## 💡 Ideas for what to build next

- Add **Colours** and **Greetings / politeness** tabs to Basics.
- Add **progress tracking / streaks / XP** (localStorage) — and introduce a warm "reward"
  accent color for correct answers & celebrations.
- Grow the vocabulary toward the ~5000-word goal, theme by theme (regenerate audio after).
- Optionally switch to the Canadian voice for the TEF Canada accent.

*Bon courage ! 🇫🇷*
