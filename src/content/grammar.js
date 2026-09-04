// ============================================================
//  grammar.js — grammar lessons (CEFR-tagged)
// ------------------------------------------------------------
//  Each topic:
//    { id, title, level, summary, explanation, examples, drill }
//  - explanation: can use \n for new lines
//  - examples: [{ fr, en }]  (each gets a 🔊 button)
//  - drill: one quick multiple-choice question
// ============================================================
export const grammar = [
  {
    id: "etre",
    title: "Le verbe « être » (to be)",
    level: "A1",
    summary: "The most important verb — used to say who/what you are.",
    explanation:
      "être = to be.\n\nje suis (I am)\ntu es (you are, informal)\nil/elle est (he/she is)\nnous sommes (we are)\nvous êtes (you are, formal/plural)\nils/elles sont (they are)",
    examples: [
      { fr: "Je suis étudiant.", en: "I am a student." },
      { fr: "Nous sommes canadiens.", en: "We are Canadian." },
      { fr: "Vous êtes français ?", en: "Are you French?" },
    ],
    drill: { question: "Complete: Elle ___ professeur.", options: ["es", "est", "suis"], answer: "est" },
  },
  {
    id: "avoir",
    title: "Le verbe « avoir » (to have)",
    level: "A1",
    summary: "Used for possession — and for your age (j'ai 25 ans).",
    explanation:
      "avoir = to have.\n\nj'ai (I have)\ntu as (you have)\nil/elle a (he/she has)\nnous avons (we have)\nvous avez (you have)\nils/elles ont (they have)",
    examples: [
      { fr: "J'ai un frère.", en: "I have a brother." },
      { fr: "Tu as vingt ans.", en: "You are twenty (lit. have 20 years)." },
      { fr: "Ils ont une maison.", en: "They have a house." },
    ],
    drill: { question: "Complete: Nous ___ deux enfants.", options: ["as", "avons", "ont"], answer: "avons" },
  },
  {
    id: "articles",
    title: "Les articles (le, la, les, un, une, des)",
    level: "A1",
    summary: "Little words before nouns — French nouns have a gender.",
    explanation:
      "Definite (the): le (m), la (f), l' (before a vowel), les (plural).\nIndefinite (a/some): un (m), une (f), des (plural).\n\nEvery noun is masculine or feminine — learn the article WITH the word.",
    examples: [
      { fr: "le café et la pomme", en: "the coffee and the apple" },
      { fr: "un homme, une femme", en: "a man, a woman" },
      { fr: "des amis", en: "some friends" },
    ],
    drill: { question: "Choose: ___ maison (house is feminine).", options: ["le", "la", "les"], answer: "la" },
  },
  {
    id: "er-verbs",
    title: "Les verbes en -ER (present tense)",
    level: "A1",
    summary: "Most French verbs end in -er and follow one easy pattern.",
    explanation:
      "Take the stem (parler → parl-) and add:\n\nje parle\ntu parles\nil/elle parle\nnous parlons\nvous parlez\nils/elles parlent\n\nThe -e, -es, -ent endings all sound the same!",
    examples: [
      { fr: "Je parle français.", en: "I speak French." },
      { fr: "Nous habitons à Montréal.", en: "We live in Montreal." },
      { fr: "Ils mangent une pomme.", en: "They eat an apple." },
    ],
    drill: { question: "Complete: Vous ___ anglais. (parler)", options: ["parle", "parlez", "parlent"], answer: "parlez" },
  },
  {
    id: "adjective-agreement",
    title: "L'accord des adjectifs (agreement)",
    level: "A1",
    summary: "Adjectives change to match the noun's gender and number.",
    explanation:
      "Feminine usually adds -e; plural usually adds -s.\n\npetit (m) → petite (f) → petits / petites\n\nColours and descriptions follow this rule.",
    examples: [
      { fr: "un petit chat", en: "a small cat (m)" },
      { fr: "une petite maison", en: "a small house (f)" },
      { fr: "des voitures rouges", en: "red cars (plural)" },
    ],
    drill: { question: "Choose: une voiture ___ (green).", options: ["vert", "verte", "verts"], answer: "verte" },
  },
  {
    id: "passe-compose",
    title: "Le passé composé (intro)",
    level: "A2",
    summary: "The main past tense — 'I did / I have done'.",
    explanation:
      "Formula: avoir (present) + past participle.\n\n-er verbs → participle ends in -é: parler → parlé.\n\nj'ai parlé (I spoke), tu as mangé (you ate).\n\nSome verbs use être instead of avoir (movement verbs) — a topic for later.",
    examples: [
      { fr: "J'ai mangé une pomme.", en: "I ate an apple." },
      { fr: "Tu as parlé avec Marie.", en: "You spoke with Marie." },
      { fr: "Nous avons regardé un film.", en: "We watched a film." },
    ],
    drill: { question: "Complete: J'___ mangé.", options: ["ai", "as", "avons"], answer: "ai" },
  },
];
