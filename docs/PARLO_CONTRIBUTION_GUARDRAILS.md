# Parlo Contribution Guardrails

These rules apply to human- and AI-assisted changes.

## Before changing behavior

- Read the relevant product and architecture documents in `docs/`.
- Inspect the current implementation and working tree.
- Preserve unrelated and uncommitted user changes.
- Keep each change focused and reviewable.
- State any assumption that changes product behavior or data compatibility.

## Required checks

For changes that can affect the application, run:

```bash
npm run lint
npm run test:e2e
npm run build
```

Use `npm run check` to run the complete baseline sequence.

Changes to future domain modules will also require type-check, unit, component, content-validation, and integration checks as those scripts are introduced.

## Learner data

- Never commit real learner responses, names, recordings, emails, exports, or conversation history.
- Use obviously synthetic fixtures.
- Never clear or destructively rewrite learner progress as a migration shortcut.
- Keep attempt history immutable and make derived state reproducible.
- Do not send private responses to general analytics or logs.

## Curriculum and AI-assisted content

- AI-generated material remains draft until linguistic and pedagogical review.
- Preserve source and generation provenance.
- Do not publish an answer key that has not been checked for ambiguity.
- Do not claim official CEFR or TEF certification or scoring.
- Keep deterministic alternatives for required learning flows.

## Accessibility

- All interactions must work by keyboard.
- Do not communicate meaning through color alone.
- Dynamic feedback needs appropriate text and announcements.
- Audio/video learning content needs transcripts or a declared equivalent path.
- New activity types require documented keyboard, scoring, feedback, and alternative behavior.

## Deployment

- Test application changes in a Vercel Preview before production.
- Verify direct URL loading, refresh, static media, mobile layout, and primary learner flows.
- Preserve the existing portal while `/learn` is under development.
- Rollbacks must not require deletion of learner records.
