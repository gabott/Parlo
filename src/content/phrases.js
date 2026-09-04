// ============================================================
//  phrases.js — ready-to-use sentences / statements
// ------------------------------------------------------------
//  Each phrase: { fr, en, category, level }
//  Grouped by real-life situations. Each has a 🔊 button.
// ============================================================
export const phrases = [
  // --- Se présenter ---
  { fr: "Bonjour, je m'appelle Marie.", en: "Hello, my name is Marie.", category: "Se présenter", level: "A1" },
  { fr: "Enchanté de faire votre connaissance.", en: "Pleased to meet you.", category: "Se présenter", level: "A1" },
  { fr: "Je viens du Canada.", en: "I come from Canada.", category: "Se présenter", level: "A1" },
  { fr: "J'apprends le français.", en: "I am learning French.", category: "Se présenter", level: "A1" },
  { fr: "Je ne comprends pas.", en: "I don't understand.", category: "Se présenter", level: "A1" },
  { fr: "Pouvez-vous répéter, s'il vous plaît ?", en: "Can you repeat, please?", category: "Se présenter", level: "A1" },
  { fr: "Bravo, Indira !", en: "Well done, Indira!", category: "Se présenter", level: "A1", featured: true },

  // --- Au restaurant ---
  { fr: "Une table pour deux, s'il vous plaît.", en: "A table for two, please.", category: "Au restaurant", level: "A1" },
  { fr: "Je voudrais un café, s'il vous plaît.", en: "I would like a coffee, please.", category: "Au restaurant", level: "A1" },
  { fr: "L'addition, s'il vous plaît.", en: "The bill, please.", category: "Au restaurant", level: "A1" },
  { fr: "C'était délicieux !", en: "It was delicious!", category: "Au restaurant", level: "A1" },

  // --- Les directions ---
  { fr: "Où est la gare, s'il vous plaît ?", en: "Where is the train station, please?", category: "Directions", level: "A1" },
  { fr: "C'est à gauche.", en: "It's on the left.", category: "Directions", level: "A1" },
  { fr: "C'est tout droit.", en: "It's straight ahead.", category: "Directions", level: "A1" },
  { fr: "Je cherche l'hôtel.", en: "I'm looking for the hotel.", category: "Directions", level: "A1" },

  // --- Au travail ---
  { fr: "Je travaille dans un bureau.", en: "I work in an office.", category: "Au travail", level: "A2" },
  { fr: "J'ai une réunion à dix heures.", en: "I have a meeting at ten o'clock.", category: "Au travail", level: "A2" },
  { fr: "Pouvez-vous m'aider ?", en: "Can you help me?", category: "Au travail", level: "A1" },
  { fr: "Je suis d'accord avec vous.", en: "I agree with you.", category: "Au travail", level: "A2" },

  // --- Urgences ---
  { fr: "Au secours !", en: "Help!", category: "Urgences", level: "A1" },
  { fr: "J'ai besoin d'un médecin.", en: "I need a doctor.", category: "Urgences", level: "A1" },
  { fr: "Appelez la police, s'il vous plaît.", en: "Call the police, please.", category: "Urgences", level: "A1" },
];

export const phraseCategories = [...new Set(phrases.map((p) => p.category))];
