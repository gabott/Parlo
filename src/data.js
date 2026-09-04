// ============================================================
//  Parlo — Lesson content
// ------------------------------------------------------------
//  This file holds ALL the French content for the app.
//  You do NOT need to know React to edit this file!
//  Just change the text between the quotes, or copy a block
//  to add more. Keep the commas and curly braces where they are.
// ============================================================

// The unit's basic info, shown at the top of the app.
export const unitInfo = {
  level: "A1",
  title: "Se présenter",
  subtitle: "Introducing yourself",
  canDo: "I can greet people, say my name, nationality, age, and where I live.",
};

// --- FLASHCARDS ---------------------------------------------
// Each card has a French side (fr), an English meaning (en),
// and an example sentence. Add as many as you like.
export const flashcards = [
  { fr: "Bonjour", en: "Hello / Good morning", example: "Bonjour, madame." },
  { fr: "Bonsoir", en: "Good evening", example: "Bonsoir, monsieur." },
  { fr: "Salut", en: "Hi / Bye (informal)", example: "Salut ! Ça va ?" },
  { fr: "Au revoir", en: "Goodbye", example: "Au revoir, à demain." },
  { fr: "Je m'appelle…", en: "My name is…", example: "Je m'appelle Léa." },
  { fr: "Enchanté(e)", en: "Nice to meet you", example: "Bonjour ! Enchanté !" },
  { fr: "Je suis…", en: "I am…", example: "Je suis étudiant." },
  { fr: "J'ai … ans", en: "I am … years old", example: "J'ai vingt-cinq ans." },
  { fr: "J'habite à…", en: "I live in…", example: "J'habite à Montréal." },
  { fr: "Je viens de…", en: "I come from…", example: "Je viens de l'Inde." },
];

// --- SENTENCE UNSCRAMBLE ------------------------------------
// "words" are shown shuffled; the learner puts them in order.
// "answer" is the correct full sentence (used to check).
export const unscramble = [
  { words: ["J'", "habite", "à", "Montréal"], answer: "J' habite à Montréal" },
  { words: ["Je", "m'appelle", "Léa"], answer: "Je m'appelle Léa" },
  { words: ["Je", "suis", "canadien"], answer: "Je suis canadien" },
  { words: ["Comment", "vous", "appelez-vous", "?"], answer: "Comment vous appelez-vous ?" },
  { words: ["J'ai", "vingt-cinq", "ans"], answer: "J'ai vingt-cinq ans" },
];

// --- QUIZ ----------------------------------------------------
// Multiple choice. "options" are the buttons; "answer" must
// exactly match one of the options.
export const quiz = [
  {
    question: "Complete: Je ___ étudiant.",
    options: ["es", "est", "suis"],
    answer: "suis",
  },
  {
    question: "Feminine of 'canadien':",
    options: ["canadien", "canadienne", "canadiens"],
    answer: "canadienne",
  },
  {
    question: "Which greeting is for the evening?",
    options: ["Bonjour", "Bonsoir", "Salut"],
    answer: "Bonsoir",
  },
  {
    question: "Choose the FORMAL 'What's your name?'",
    options: ["Comment tu t'appelles ?", "Comment vous appelez-vous ?", "Ça va ?"],
    answer: "Comment vous appelez-vous ?",
  },
  {
    question: "Complete: Nous ___ français.",
    options: ["sommes", "êtes", "sont"],
    answer: "sommes",
  },
];
