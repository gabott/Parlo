// ============================================================
//  audioKey.js — turn a French string into a stable filename
// ------------------------------------------------------------
//  Both the audio GENERATOR (Node) and the app (browser) use
//  this same function, so they always agree on the filename
//  for a given piece of text. You won't normally edit this.
// ============================================================

export function audioKey(text) {
  const s = String(text);
  // djb2 hash (simple + deterministic) → short hex filename.
  let h = 5381;
  for (let i = 0; i < s.length; i++) {
    h = (((h << 5) + h) ^ s.charCodeAt(i)) >>> 0;
  }
  return "a" + h.toString(16);
}
