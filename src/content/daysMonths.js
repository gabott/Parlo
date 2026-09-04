// ============================================================
//  daysMonths.js — days of the week, months, seasons + dates
// ------------------------------------------------------------
//  French days and months are NOT capitalised (unlike English).
//  We keep them lowercase here on purpose.
// ============================================================

// The 7 days. French weeks start on Monday (lundi).
export const days = [
  { fr: "lundi", en: "Monday" },
  { fr: "mardi", en: "Tuesday" },
  { fr: "mercredi", en: "Wednesday" },
  { fr: "jeudi", en: "Thursday" },
  { fr: "vendredi", en: "Friday" },
  { fr: "samedi", en: "Saturday" },
  { fr: "dimanche", en: "Sunday" },
];

// The 12 months.
export const months = [
  { fr: "janvier", en: "January" },
  { fr: "février", en: "February" },
  { fr: "mars", en: "March" },
  { fr: "avril", en: "April" },
  { fr: "mai", en: "May" },
  { fr: "juin", en: "June" },
  { fr: "juillet", en: "July" },
  { fr: "août", en: "August" },
  { fr: "septembre", en: "September" },
  { fr: "octobre", en: "October" },
  { fr: "novembre", en: "November" },
  { fr: "décembre", en: "December" },
];

// The 4 seasons (with the little emoji for colour).
export const seasons = [
  { fr: "le printemps", en: "spring", emoji: "🌸" },
  { fr: "l'été", en: "summer", emoji: "☀️" },
  { fr: "l'automne", en: "autumn / fall", emoji: "🍂" },
  { fr: "l'hiver", en: "winter", emoji: "❄️" },
];

// Handy full sentences for talking about days & dates.
export const datePhrases = [
  { fr: "Quel jour sommes-nous ?", en: "What day is it?" },
  { fr: "Aujourd'hui, c'est lundi.", en: "Today is Monday." },
  { fr: "Quelle est la date aujourd'hui ?", en: "What is the date today?" },
  { fr: "C'est le 3 septembre.", en: "It's September 3rd." },
  { fr: "Mon anniversaire est le 12 mai.", en: "My birthday is May 12th." },
  { fr: "On est en automne.", en: "It's autumn." },
];

// A short plain-language note shown on the tab.
export const dateNote =
  "A few things to remember:\n" +
  "• Days and months are written in lowercase in French.\n" +
  "• Dates use normal numbers: le 3 septembre (not '3rd').\n" +
  "• The one exception is the 1st: le 1er (premier) mai.\n" +
  "• The French week starts on Monday (lundi), not Sunday.";
