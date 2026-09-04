// ============================================================
//  pageImages.js — the banner image for each section
// ------------------------------------------------------------
//  Images live in public/images/. Swap a filename here to
//  change a section's banner picture.
// ============================================================
export const pageImages = {
  vocabulary: "vocab.jpg",
  grammar: "grammar.jpg",
  phrases: "phrases.jpg",
  practice: "practice.jpg",
  videos: "videos.jpg",
  exam: "exam.jpg",
};

// Helper to build the correct URL (works in dev and when deployed).
export function imageUrl(file) {
  return `${import.meta.env.BASE_URL}images/${file}`;
}
