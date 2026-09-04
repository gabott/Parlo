// ============================================================
//  numbers.js — French numbers
// ------------------------------------------------------------
//  Grouped so the Basics page can show them in sensible blocks.
// ============================================================

// 0 to 20 — learn these first, each one is its own word.
export const numbers0to20 = [
  { n: 0, fr: "zéro" },
  { n: 1, fr: "un" },
  { n: 2, fr: "deux" },
  { n: 3, fr: "trois" },
  { n: 4, fr: "quatre" },
  { n: 5, fr: "cinq" },
  { n: 6, fr: "six" },
  { n: 7, fr: "sept" },
  { n: 8, fr: "huit" },
  { n: 9, fr: "neuf" },
  { n: 10, fr: "dix" },
  { n: 11, fr: "onze" },
  { n: 12, fr: "douze" },
  { n: 13, fr: "treize" },
  { n: 14, fr: "quatorze" },
  { n: 15, fr: "quinze" },
  { n: 16, fr: "seize" },
  { n: 17, fr: "dix-sept" },
  { n: 18, fr: "dix-huit" },
  { n: 19, fr: "dix-neuf" },
  { n: 20, fr: "vingt" },
];

// The tens — count by tens up to 100.
export const numbersTens = [
  { n: 10, fr: "dix" },
  { n: 20, fr: "vingt" },
  { n: 30, fr: "trente" },
  { n: 40, fr: "quarante" },
  { n: 50, fr: "cinquante" },
  { n: 60, fr: "soixante" },
  { n: 70, fr: "soixante-dix" },
  { n: 80, fr: "quatre-vingts" },
  { n: 90, fr: "quatre-vingt-dix" },
  { n: 100, fr: "cent" },
];

// The famous "tricky" numbers (70/80/90 use maths!) + big round numbers.
export const numbersTricky = [
  { n: 21, fr: "vingt et un" },
  { n: 22, fr: "vingt-deux" },
  { n: 71, fr: "soixante et onze" },
  { n: 80, fr: "quatre-vingts" },
  { n: 81, fr: "quatre-vingt-un" },
  { n: 91, fr: "quatre-vingt-onze" },
  { n: 99, fr: "quatre-vingt-dix-neuf" },
  { n: 100, fr: "cent" },
  { n: 200, fr: "deux cents" },
  { n: 1000, fr: "mille" },
];

// A short plain-language note shown on the Numbers tab.
export const numbersNote =
  "French counts 70, 80, 90 with maths:\n" +
  "• 70 = soixante-dix (60 + 10)\n" +
  "• 80 = quatre-vingts (4 × 20)\n" +
  "• 90 = quatre-vingt-dix (4 × 20 + 10)\n" +
  "So 75 = soixante-quinze (60 + 15) and 95 = quatre-vingt-quinze (4 × 20 + 15).";
