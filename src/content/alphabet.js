// ============================================================
//  alphabet.js — the French alphabet + accented letters
// ------------------------------------------------------------
//  letter   : the capital letter
//  name     : how the letter is SAID in French (rough spelling)
//  example  : a simple French word starting with it
//  exampleEn: the English meaning of that word
// ============================================================
export const alphabet = [
  { letter: "A", name: "a", example: "avion", exampleEn: "airplane" },
  { letter: "B", name: "bé", example: "ballon", exampleEn: "ball" },
  { letter: "C", name: "cé", example: "chat", exampleEn: "cat" },
  { letter: "D", name: "dé", example: "dauphin", exampleEn: "dolphin" },
  { letter: "E", name: "e", example: "éléphant", exampleEn: "elephant" },
  { letter: "F", name: "effe", example: "fromage", exampleEn: "cheese" },
  { letter: "G", name: "gé", example: "gâteau", exampleEn: "cake" },
  { letter: "H", name: "ache", example: "hôtel", exampleEn: "hotel" },
  { letter: "I", name: "i", example: "île", exampleEn: "island" },
  { letter: "J", name: "ji", example: "jardin", exampleEn: "garden" },
  { letter: "K", name: "ka", example: "kangourou", exampleEn: "kangaroo" },
  { letter: "L", name: "elle", example: "lune", exampleEn: "moon" },
  { letter: "M", name: "emme", example: "maison", exampleEn: "house" },
  { letter: "N", name: "enne", example: "neige", exampleEn: "snow" },
  { letter: "O", name: "o", example: "orange", exampleEn: "orange" },
  { letter: "P", name: "pé", example: "pomme", exampleEn: "apple" },
  { letter: "Q", name: "ku", example: "quatre", exampleEn: "four" },
  { letter: "R", name: "erre", example: "robe", exampleEn: "dress" },
  { letter: "S", name: "esse", example: "soleil", exampleEn: "sun" },
  { letter: "T", name: "té", example: "tortue", exampleEn: "turtle" },
  { letter: "U", name: "u", example: "usine", exampleEn: "factory" },
  { letter: "V", name: "vé", example: "voiture", exampleEn: "car" },
  { letter: "W", name: "double vé", example: "wagon", exampleEn: "train car" },
  { letter: "X", name: "iks", example: "xylophone", exampleEn: "xylophone" },
  { letter: "Y", name: "i grec", example: "yaourt", exampleEn: "yogurt" },
  { letter: "Z", name: "zède", example: "zèbre", exampleEn: "zebra" },
];

// The accented letters — essential for spelling French correctly.
export const accents = [
  { symbol: "é", name: "e accent aigu", example: "café", exampleEn: "coffee" },
  { symbol: "è", name: "e accent grave", example: "mère", exampleEn: "mother" },
  { symbol: "ê", name: "e accent circonflexe", example: "fenêtre", exampleEn: "window" },
  { symbol: "ç", name: "c cédille", example: "français", exampleEn: "French" },
  { symbol: "ë", name: "e tréma", example: "Noël", exampleEn: "Christmas" },
  { symbol: "à", name: "a accent grave", example: "voilà", exampleEn: "there it is" },
];
