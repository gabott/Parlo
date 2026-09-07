# Parlo Increment 1: URL Routing and Portal Preservation

**Status:** Implemented and verified in production  
**Date:** 2026-09-07

## Production verification

The GitHub-connected Vercel project deployed commit `56a453d`. Live headless-browser checks confirmed direct loading and rendered page titles/headings for:

- `/learn`
- `/library/vocabulary`
- `/tef`
- An unknown route using the application 404 page

## Implemented

- React Router Data Mode with a shared application shell.
- Stable routes for all existing portal sections.
- Existing dashboard preserved at `/`.
- Future learning entry established at `/learn` with Preview messaging.
- Existing content organized under `/library/*`; TEF available at `/tef`.
- Semantic sidebar links and active-route state.
- Browser Back/Forward and refresh restoration.
- Page-specific document titles.
- Main-content focus after route navigation.
- Accessible mobile menu label, expanded state, controls relationship, Escape handling, and overlay close control.
- Recoverable not-found route.
- Vercel SPA rewrite configuration.

## Route map

```text
/
/learn
/library/basics
/library/vocabulary
/library/grammar
/library/phrases
/library/practice
/library/videos
/tef
```

## Verification

- Existing portal smoke coverage remains in place.
- Added direct-load, refresh, browser-history, Learn Preview, not-found, title, and focus tests.
- Desktop and mobile Chromium coverage remains enabled.
- Lint and production build are required through `npm run check`.

## Remaining release checkpoint

After this increment is committed and pushed, verify on its Vercel Preview URL:

1. Open `/library/vocabulary` directly.
2. Refresh the direct route.
3. Navigate Back/Forward across Library pages.
4. Open `/learn` directly.
5. Open an unknown route and return to the dashboard.
6. Confirm images and pronunciation assets load.
7. Confirm mobile navigation and Escape/overlay dismissal.

The `/learn` page remains a preview placeholder. It does not yet contain lessons, learner progress, or accounts.
