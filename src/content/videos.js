// ============================================================
//  videos.js — curated YouTube learning resources
// ------------------------------------------------------------
//  We LINK to great free channels (legal + free). Each card
//  opens the channel/video on YouTube in a new tab.
//
//  Each item: { title, channel, url, level, theme, note, youtubeId? }
//   - url:       where "Open on YouTube" goes
//   - youtubeId: (optional) if you paste a specific video ID,
//                the app embeds that video directly in a player.
//                Leave it out to just show a link card.
//
//  To embed a video: open it on YouTube, copy the part after
//  "watch?v=" and paste it as youtubeId.
// ============================================================
export const videos = [
  {
    title: "InnerFrench — learn with slow, clear French",
    channel: "InnerFrench",
    url: "https://www.youtube.com/@innerFrench",
    level: "B1",
    theme: "Listening",
    note: "Intermediate podcast-style videos entirely in French. Perfect for training your ear toward B1–B2.",
  },
  {
    title: "Easy French — real street interviews with subtitles",
    channel: "Easy French",
    url: "https://www.youtube.com/@Easyfrench",
    level: "A2",
    theme: "Listening",
    note: "Authentic French from real people, with French + English subtitles. Great for everyday vocabulary.",
  },
  {
    title: "Français Authentique — think in French",
    channel: "Français Authentique",
    url: "https://www.youtube.com/@FrancaisAuthentique",
    level: "A2",
    theme: "Listening",
    note: "Natural French explained simply, with a focus on useful expressions and speaking naturally.",
  },
  {
    title: "Learn French with Alexa — friendly beginner lessons",
    channel: "Learn French With Alexa",
    url: "https://www.youtube.com/@learnfrenchwithalexa",
    level: "A1",
    theme: "Grammar",
    note: "Clear beginner grammar and vocabulary lessons in English — ideal for your very first steps.",
  },
  {
    title: "Français avec Pierre — grammar & pronunciation",
    channel: "Français avec Pierre",
    url: "https://www.youtube.com/@Francaisavecpierre",
    level: "A2",
    theme: "Grammar",
    note: "Thorough explanations of grammar, pronunciation and vocabulary, mostly in simple French.",
  },
  {
    title: "TV5MONDE — Apprendre le français (graded media)",
    channel: "TV5MONDE",
    url: "https://apprendre.tv5monde.com/en",
    level: "B1",
    theme: "Exam prep",
    note: "Authentic news clips with exercises sorted by CEFR level (A1–B2). Excellent TEF/TCF listening practice.",
  },
  {
    title: "RFI — Le journal en français facile",
    channel: "RFI",
    url: "https://francaisfacile.rfi.fr/fr/",
    level: "B1",
    theme: "Exam prep",
    note: "Daily news read slowly with transcripts — superb for building B1–B2 listening + reading stamina.",
  },
  {
    title: "Piece of French — vlogs in natural French",
    channel: "Piece of French",
    url: "https://www.youtube.com/@Pieceoffrench",
    level: "B1",
    theme: "Listening",
    note: "Real-life vlogs spoken naturally with subtitles — bridges the gap toward native-speed French.",
  },
];

export const videoLevels = ["A1", "A2", "B1", "B2"];
