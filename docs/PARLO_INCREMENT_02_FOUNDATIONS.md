# Parlo Increment 2 — TypeScript, Test, and Design Foundations

## Outcome

Increment 2 establishes typed, testable foundations for new V2 work while leaving the legacy Library in JavaScript.

## Delivered

- Strict TypeScript checking with temporary `allowJs` compatibility.
- Shared domain utilities for branded stable IDs, localized text, result values, clocks, and deterministic randomness.
- Vitest, React Testing Library, and an isolated `tests/unit` configuration that does not collect Playwright suites.
- V2 design tokens and typed primitives: Button, Link, Field, Card, Progress, Feedback, AudioControl, and VisuallyHidden.
- Explicit visible-focus, disabled, semantic feedback, progress, and reduced-motion behavior.
- A `/learn` preview composed from the new primitives without changing legacy Library pages.
- Component accessibility checks powered by axe-core, plus keyboard and semantic tests. The jsdom suite excludes axe's canvas-dependent color-contrast rule; contrast is inspected in a real browser at the Preview checkpoint.

Tabs were intentionally not added because this increment has no interface with true tab semantics.

## Verification

Run the complete local gate with:

```bash
npm run check
```

The Vercel Preview checkpoint remains a deployment workflow step after the increment is committed and pushed.

## Rollback

The TypeScript/test configuration, `src/domain/shared`, `src/design-system`, and `/learn` preview changes are isolated from learner data and can be reverted together.
