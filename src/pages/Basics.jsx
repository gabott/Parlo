// ============================================================
//  Basics — foundations: Alphabet, Numbers, Top 100 words
//  Uses sub-tabs (like the Practice page).
// ============================================================
import { useState } from "react";
import PageHeader from "../PageHeader";
import SpeakButton from "../SpeakButton";
import { alphabet, accents } from "../content/alphabet";
import {
  numbers0to20,
  numbersTens,
  numbersTricky,
  numbersNote,
} from "../content/numbers";
import { commonWords, wordTypes } from "../content/commonWords";
import {
  days,
  months,
  seasons,
  datePhrases,
  dateNote,
} from "../content/daysMonths";
import { questionWords, questionNote } from "../content/questionWords";

const TABS = [
  { id: "alphabet", label: "🔤 Alphabet" },
  { id: "numbers", label: "🔢 Numbers" },
  { id: "common", label: "🔥 Top 100 words" },
  { id: "days", label: "📅 Days & Months" },
  { id: "questions", label: "❓ Question words" },
];

export default function Basics() {
  const [tab, setTab] = useState("alphabet");

  return (
    <div>
      <PageHeader
        image="basics.jpg"
        emoji="🧱"
        title="Basics"
        subtitle="Start here — the alphabet, numbers, key words, days & months, and question words."
      />

      <div className="subtabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={tab === t.id ? "subtab active" : "subtab"}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "alphabet" && <AlphabetTab />}
      {tab === "numbers" && <NumbersTab />}
      {tab === "common" && <CommonTab />}
      {tab === "days" && <DaysTab />}
      {tab === "questions" && <QuestionsTab />}
    </div>
  );
}

// ---------- Alphabet ----------
function AlphabetTab() {
  return (
    <div>
      <p className="page-sub">
        26 letters. Tap 🔊 to hear the letter's name, or tap the example word.
      </p>
      <div className="letter-grid">
        {alphabet.map((l) => (
          <div key={l.letter} className="letter-card">
            <div className="letter-top">
              <span className="letter-big">{l.letter}</span>
              <SpeakButton text={l.letter} />
            </div>
            <div className="letter-name">“{l.name}”</div>
            <div className="letter-ex">
              <SpeakButton text={l.example} />
              <span>
                <span className="letter-ex-fr">{l.example}</span>
                <span className="letter-ex-en">{l.exampleEn}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      <h2 className="section-h">Accented letters</h2>
      <p className="page-sub">These change pronunciation — and meaning!</p>
      <div className="letter-grid">
        {accents.map((a) => (
          <div key={a.symbol} className="letter-card">
            <div className="letter-top">
              <span className="letter-big accent">{a.symbol}</span>
              <SpeakButton text={a.example} />
            </div>
            <div className="letter-name">{a.name}</div>
            <div className="letter-ex-static">
              <span className="letter-ex-fr">{a.example}</span>
              <span className="letter-ex-en">{a.exampleEn}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------- Numbers ----------
function NumbersTab() {
  return (
    <div>
      <p className="page-sub">Tap any number to hear it.</p>

      <h2 className="section-h">0 – 20</h2>
      <div className="num-grid">
        {numbers0to20.map((x) => (
          <NumberCard key={x.n} n={x.n} fr={x.fr} />
        ))}
      </div>

      <h2 className="section-h">Counting by tens</h2>
      <div className="num-grid">
        {numbersTens.map((x) => (
          <NumberCard key={x.n} n={x.n} fr={x.fr} />
        ))}
      </div>

      <div className="card note-card">
        <h3>💡 The tricky ones (70, 80, 90)</h3>
        {numbersNote.split("\n").map((line, i) => (
          <p key={i} className="explain-line">{line}</p>
        ))}
      </div>

      <h2 className="section-h">Tricky & big numbers</h2>
      <div className="num-grid">
        {numbersTricky.map((x) => (
          <NumberCard key={x.n} n={x.n} fr={x.fr} />
        ))}
      </div>
    </div>
  );
}

function NumberCard({ n, fr }) {
  return (
    <div className="num-card">
      <div className="num-value">{n}</div>
      <div className="num-fr">{fr}</div>
      <SpeakButton text={fr} />
    </div>
  );
}

// ---------- Top 100 words ----------
function CommonTab() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const list = commonWords.filter((w) => {
    const matchesType = type === "All" || w.type === type;
    const text = (w.fr + " " + w.en).toLowerCase();
    return matchesType && text.includes(search.toLowerCase());
  });

  return (
    <div>
      <p className="page-sub">
        The {commonWords.length} most common words — these cover a huge part of
        everyday French. The number is roughly the frequency rank.
      </p>

      <div className="controls">
        <input
          className="search"
          placeholder="Search a word…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="All">All types</option>
          {wordTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      <div className="common-grid">
        {list.map((w) => {
          const rank = commonWords.indexOf(w) + 1;
          return (
            <div key={w.fr} className="common-card">
              <span className="common-rank">{rank}</span>
              <div className="common-body">
                <span className="common-fr">{w.fr}</span>
                <span className="common-en">{w.en}</span>
              </div>
              <span className="tag">{w.type}</span>
              <SpeakButton text={w.fr} />
            </div>
          );
        })}
      </div>

      {list.length === 0 && <p className="empty">No words match your search.</p>}
    </div>
  );
}

// ---------- Days & Months ----------
function DaysTab() {
  return (
    <div>
      <p className="page-sub">Tap any word to hear it. (Days & months are lowercase in French!)</p>

      <h2 className="section-h">The 7 days</h2>
      <div className="word-grid">
        {days.map((d) => (
          <WordCard key={d.fr} fr={d.fr} en={d.en} />
        ))}
      </div>

      <h2 className="section-h">The 12 months</h2>
      <div className="word-grid">
        {months.map((m) => (
          <WordCard key={m.fr} fr={m.fr} en={m.en} />
        ))}
      </div>

      <h2 className="section-h">The 4 seasons</h2>
      <div className="word-grid">
        {seasons.map((s) => (
          <WordCard key={s.fr} fr={s.fr} en={s.en} emoji={s.emoji} />
        ))}
      </div>

      <h2 className="section-h">Saying the date</h2>
      <div className="phrase-list">
        {datePhrases.map((p) => (
          <div key={p.fr} className="phrase-row">
            <SpeakButton text={p.fr} />
            <div className="phrase-body">
              <span className="phrase-fr">{p.fr}</span>
              <span className="phrase-en">{p.en}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="card note-card">
        <h3>💡 Good to know</h3>
        {dateNote.split("\n").map((line, i) => (
          <p key={i} className="explain-line">{line}</p>
        ))}
      </div>
    </div>
  );
}

function WordCard({ fr, en, emoji }) {
  return (
    <div className="word-card">
      {emoji && <div className="word-emoji">{emoji}</div>}
      <div className="word-fr">{fr}</div>
      <div className="word-en">{en}</div>
      <SpeakButton text={fr} />
    </div>
  );
}

// ---------- Question words ----------
function QuestionsTab() {
  return (
    <div>
      <p className="page-sub">
        Master these 8 words and you can ask almost anything. Tap 🔊 to hear each word or example.
      </p>

      <div className="q-grid">
        {questionWords.map((q) => (
          <div key={q.fr} className="q-card">
            <div className="q-top">
              <span className="q-word">{q.fr}</span>
              <SpeakButton text={q.fr.replace(/ \/ .*$/, "")} />
            </div>
            <div className="q-en">{q.en}</div>
            {q.note && <div className="q-note">{q.note}</div>}
            <div className="q-examples">
              {q.examples.map((ex) => (
                <div key={ex.fr} className="q-example">
                  <SpeakButton text={ex.fr} />
                  <div className="phrase-body">
                    <span className="phrase-fr">{ex.fr}</span>
                    <span className="phrase-en">{ex.en}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="card note-card">
        <h3>💡 How to turn any sentence into a question</h3>
        {questionNote.split("\n").map((line, i) => (
          <p key={i} className="explain-line">{line}</p>
        ))}
      </div>
    </div>
  );
}
