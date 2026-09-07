# Parlo Increment 0 Baseline

**Status:** Implemented baseline  
**Purpose:** Protect current portal behavior before the routing and V2 learning-platform work begins.

## Current application

- React/Vite client-rendered portal.
- Eight primary destinations represented through component state: Dashboard, Basics, Vocabulary, Grammar, Phrases, Practice, Videos, and TEF Exam.
- Static images and generated MP3 pronunciation assets.
- No URL router, learner persistence, backend, or automated test suite before this increment.

## Automated browser baseline

The Playwright suite protects:

- Dashboard rendering and navigation to all existing sections.
- Vocabulary search and theme filtering.
- Grammar topic opening, drill feedback, and return navigation.
- Full quiz completion and restart.
- Pronunciation requests to a local MP3 path.
- Mobile navigation and overlay dismissal.
- Desktop and mobile horizontal-overflow checks.

External fonts, analytics, and YouTube requests are blocked in baseline tests. Audio playback is mocked so tests verify the application request without depending on browser audio hardware.

Failure artifacts include screenshots, traces, and video. They are diagnostic artifacts rather than committed pixel-perfect snapshots because the existing visual design will be progressively formalized in Increment 2.

## Baseline commands

```bash
npm run lint
npm run test:e2e
npm run build
```

Or run all three:

```bash
npm run check
```

## Known current-state constraints

- Navigation is state-based, so refresh and browser history do not preserve the selected section.
- Mobile-menu semantics and focus management need improvement in the routing increment.
- The current portal has no persisted learner state.
- Existing content is not yet represented by the approved V2 schema.
- Browser tests intentionally capture current behavior and do not imply full accessibility conformance.

These are planned V2 changes, not Increment 0 regressions.
