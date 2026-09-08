# Parlo Increment 5 — Scoring and Activity Renderers

## Outcome

Increment 5 provides the reusable deterministic activity layer required by Unit 1. Lesson content emits response envelopes; centralized scorers evaluate them; feature orchestration—not individual renderers—owns persistence.

## Delivered

- Registry-backed renderers for presentation/dialogue, meaning selection, audio-to-text, text-to-audio, matching, sentence building, typed recall, dictation, and guided speaking/self-review.
- Response envelopes with stable activity/item identity, activity kind, response, and submission time.
- Deterministic choice and French-text scoring.
- NFC normalization, straight/curly apostrophe handling, whitespace/contraction normalization, optional punctuation, and objective-controlled accent behavior.
- Explicit `correct`, `incorrect`, and `needs_review` outcomes.
- Retry feedback followed by a locked final correct state.
- Keyboard-operable, non-drag sentence building and matching.
- Normal and learner-speed native-audio controls.
- Explicit transcript fallback for learning audio and a blocking error for missing assessment audio.
- Progressive dialogue support: audio first, French transcript second, English support third.
- Structured speaking self-review without automated pronunciation claims.
- A development-only `/debug/activities` fixture gallery.

## Boundaries

Increment 5 evaluates activity responses but does not calculate mastery, schedule review, orchestrate complete lessons, or perform automated speech scoring. Those remain in later increments.

## Verification

`npm run check` validates content, scoring, renderer behavior, browser interaction, accessibility semantics, and the production build.
