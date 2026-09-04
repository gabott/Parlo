// ============================================================
//  questionWords.js — the essential French question words
// ------------------------------------------------------------
//  These 8 words unlock almost every question you'll ask.
//  Each has a couple of real example questions to hear.
// ============================================================

export const questionWords = [
  {
    fr: "qui",
    en: "who",
    note: "For people.",
    examples: [
      { fr: "Qui est-ce ?", en: "Who is it?" },
      { fr: "Qui parle français ?", en: "Who speaks French?" },
    ],
  },
  {
    fr: "que / quoi",
    en: "what",
    note: "« que » before a verb, « quoi » after.",
    examples: [
      { fr: "Que fais-tu ?", en: "What are you doing?" },
      { fr: "C'est quoi ?", en: "What is it? (casual)" },
    ],
  },
  {
    fr: "où",
    en: "where",
    note: "Note the accent: où (where) vs ou (or).",
    examples: [
      { fr: "Où habites-tu ?", en: "Where do you live?" },
      { fr: "Où sont les toilettes ?", en: "Where is the toilet?" },
    ],
  },
  {
    fr: "quand",
    en: "when",
    note: "For time.",
    examples: [
      { fr: "Quand arrives-tu ?", en: "When do you arrive?" },
      { fr: "C'est quand, ton anniversaire ?", en: "When is your birthday?" },
    ],
  },
  {
    fr: "comment",
    en: "how",
    note: "Also used to ask names: Comment tu t'appelles ?",
    examples: [
      { fr: "Comment ça va ?", en: "How are you?" },
      { fr: "Comment tu t'appelles ?", en: "What's your name?" },
    ],
  },
  {
    fr: "pourquoi",
    en: "why",
    note: "Answer with « parce que » (because).",
    examples: [
      { fr: "Pourquoi ?", en: "Why?" },
      { fr: "Pourquoi apprends-tu le français ?", en: "Why are you learning French?" },
    ],
  },
  {
    fr: "combien",
    en: "how much / how many",
    note: "Often « combien de… » (how many of…).",
    examples: [
      { fr: "Combien ça coûte ?", en: "How much does it cost?" },
      { fr: "Combien de personnes ?", en: "How many people?" },
    ],
  },
  {
    fr: "quel / quelle",
    en: "which / what",
    note: "Agrees with the noun: quel (m), quelle (f).",
    examples: [
      { fr: "Quelle heure est-il ?", en: "What time is it?" },
      { fr: "Quel est ton nom ?", en: "What is your name?" },
    ],
  },
];

// A short note shown on the tab.
export const questionNote =
  "Two easy ways to ask a question in French:\n" +
  "• Put « est-ce que » in front of a statement: Est-ce que tu parles français ?\n" +
  "• Or just raise your voice at the end: Tu parles français ?\n" +
  "Both are correct — the second is more casual.";
