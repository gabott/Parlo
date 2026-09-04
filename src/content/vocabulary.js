// ============================================================
//  vocabulary.js — the word bank
// ------------------------------------------------------------
//  Each word:  { fr, en, gender, theme, level }
//    gender: "m" (le), "f" (la), or null (not a noun)
//    theme:  used by the filter dropdown
//    level:  "A1", "A2", ...
//
//  This is where you grow toward thousands of words. Just keep
//  adding lines. After adding, run  npm run audio  to create
//  the pronunciation files.
// ============================================================
export const vocabulary = [
  // --- Salutations ---
  { fr: "bonjour", en: "hello / good morning", gender: null, theme: "Salutations", level: "A1" },
  { fr: "bonsoir", en: "good evening", gender: null, theme: "Salutations", level: "A1" },
  { fr: "salut", en: "hi / bye (informal)", gender: null, theme: "Salutations", level: "A1" },
  { fr: "au revoir", en: "goodbye", gender: null, theme: "Salutations", level: "A1" },
  { fr: "merci", en: "thank you", gender: null, theme: "Salutations", level: "A1" },
  { fr: "s'il vous plaît", en: "please (formal)", gender: null, theme: "Salutations", level: "A1" },
  { fr: "pardon", en: "sorry / excuse me", gender: null, theme: "Salutations", level: "A1" },
  { fr: "oui", en: "yes", gender: null, theme: "Salutations", level: "A1" },
  { fr: "non", en: "no", gender: null, theme: "Salutations", level: "A1" },
  { fr: "enchanté", en: "nice to meet you", gender: null, theme: "Salutations", level: "A1" },

  // --- La famille ---
  { fr: "la famille", en: "family", gender: "f", theme: "Famille", level: "A1" },
  { fr: "le père", en: "father", gender: "m", theme: "Famille", level: "A1" },
  { fr: "la mère", en: "mother", gender: "f", theme: "Famille", level: "A1" },
  { fr: "le frère", en: "brother", gender: "m", theme: "Famille", level: "A1" },
  { fr: "la sœur", en: "sister", gender: "f", theme: "Famille", level: "A1" },
  { fr: "le fils", en: "son", gender: "m", theme: "Famille", level: "A1" },
  { fr: "la fille", en: "daughter / girl", gender: "f", theme: "Famille", level: "A1" },
  { fr: "le mari", en: "husband", gender: "m", theme: "Famille", level: "A1" },
  { fr: "la femme", en: "wife / woman", gender: "f", theme: "Famille", level: "A1" },
  { fr: "les parents", en: "parents", gender: null, theme: "Famille", level: "A1" },

  // --- La nourriture ---
  { fr: "le pain", en: "bread", gender: "m", theme: "Nourriture", level: "A1" },
  { fr: "l'eau", en: "water", gender: "f", theme: "Nourriture", level: "A1" },
  { fr: "le café", en: "coffee", gender: "m", theme: "Nourriture", level: "A1" },
  { fr: "le vin", en: "wine", gender: "m", theme: "Nourriture", level: "A1" },
  { fr: "le fromage", en: "cheese", gender: "m", theme: "Nourriture", level: "A1" },
  { fr: "la pomme", en: "apple", gender: "f", theme: "Nourriture", level: "A1" },
  { fr: "le lait", en: "milk", gender: "m", theme: "Nourriture", level: "A1" },
  { fr: "le poulet", en: "chicken", gender: "m", theme: "Nourriture", level: "A1" },
  { fr: "le poisson", en: "fish", gender: "m", theme: "Nourriture", level: "A1" },
  { fr: "le riz", en: "rice", gender: "m", theme: "Nourriture", level: "A1" },

  // --- Les nombres ---
  { fr: "un", en: "one", gender: null, theme: "Nombres", level: "A1" },
  { fr: "deux", en: "two", gender: null, theme: "Nombres", level: "A1" },
  { fr: "trois", en: "three", gender: null, theme: "Nombres", level: "A1" },
  { fr: "quatre", en: "four", gender: null, theme: "Nombres", level: "A1" },
  { fr: "cinq", en: "five", gender: null, theme: "Nombres", level: "A1" },
  { fr: "six", en: "six", gender: null, theme: "Nombres", level: "A1" },
  { fr: "sept", en: "seven", gender: null, theme: "Nombres", level: "A1" },
  { fr: "huit", en: "eight", gender: null, theme: "Nombres", level: "A1" },
  { fr: "neuf", en: "nine", gender: null, theme: "Nombres", level: "A1" },
  { fr: "dix", en: "ten", gender: null, theme: "Nombres", level: "A1" },

  // --- Les couleurs ---
  { fr: "rouge", en: "red", gender: null, theme: "Couleurs", level: "A1" },
  { fr: "bleu", en: "blue", gender: null, theme: "Couleurs", level: "A1" },
  { fr: "vert", en: "green", gender: null, theme: "Couleurs", level: "A1" },
  { fr: "jaune", en: "yellow", gender: null, theme: "Couleurs", level: "A1" },
  { fr: "noir", en: "black", gender: null, theme: "Couleurs", level: "A1" },
  { fr: "blanc", en: "white", gender: null, theme: "Couleurs", level: "A1" },
  { fr: "gris", en: "grey", gender: null, theme: "Couleurs", level: "A1" },

  // --- Le temps ---
  { fr: "aujourd'hui", en: "today", gender: null, theme: "Temps", level: "A1" },
  { fr: "demain", en: "tomorrow", gender: null, theme: "Temps", level: "A1" },
  { fr: "hier", en: "yesterday", gender: null, theme: "Temps", level: "A1" },
  { fr: "le matin", en: "morning", gender: "m", theme: "Temps", level: "A1" },
  { fr: "le soir", en: "evening", gender: "m", theme: "Temps", level: "A1" },
  { fr: "la nuit", en: "night", gender: "f", theme: "Temps", level: "A1" },
  { fr: "la semaine", en: "week", gender: "f", theme: "Temps", level: "A1" },
  { fr: "le jour", en: "day", gender: "m", theme: "Temps", level: "A1" },

  // --- Les lieux ---
  { fr: "la ville", en: "city / town", gender: "f", theme: "Lieux", level: "A1" },
  { fr: "la maison", en: "house / home", gender: "f", theme: "Lieux", level: "A1" },
  { fr: "l'école", en: "school", gender: "f", theme: "Lieux", level: "A1" },
  { fr: "le travail", en: "work", gender: "m", theme: "Lieux", level: "A1" },
  { fr: "le magasin", en: "shop / store", gender: "m", theme: "Lieux", level: "A1" },
  { fr: "la gare", en: "train station", gender: "f", theme: "Lieux", level: "A1" },
  { fr: "la rue", en: "street", gender: "f", theme: "Lieux", level: "A1" },

  // --- Les verbes (common) ---
  { fr: "être", en: "to be", gender: null, theme: "Verbes", level: "A1" },
  { fr: "avoir", en: "to have", gender: null, theme: "Verbes", level: "A1" },
  { fr: "aller", en: "to go", gender: null, theme: "Verbes", level: "A1" },
  { fr: "faire", en: "to do / make", gender: null, theme: "Verbes", level: "A1" },
  { fr: "parler", en: "to speak", gender: null, theme: "Verbes", level: "A1" },
  { fr: "manger", en: "to eat", gender: null, theme: "Verbes", level: "A1" },
  { fr: "boire", en: "to drink", gender: null, theme: "Verbes", level: "A1" },
  { fr: "habiter", en: "to live", gender: null, theme: "Verbes", level: "A1" },
];

// A helper the pages use to build the theme filter dropdown.
export const vocabThemes = [...new Set(vocabulary.map((w) => w.theme))];
