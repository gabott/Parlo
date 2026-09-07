# ADR 0001: React Router Data Mode

**Status:** Accepted  
**Date:** 2026-09-07

## Context

The original Parlo portal selected pages through component state. This prevented stable URLs, direct links, refresh restoration, and browser Back/Forward navigation. Parlo V2 needs nested learning routes while retaining the existing Vite application and local-first data architecture.

## Decision

Use React Router Data Mode with `createBrowserRouter` and a shared application shell.

The current portal is exposed through stable Library routes, the existing dashboard remains at `/`, and the future learning experience begins at `/learn`.

## Consequences

- Pages can be linked, refreshed, and restored through browser history.
- Vercel needs an SPA rewrite to `index.html` for direct route loading.
- Existing sidebar buttons become semantic navigation links.
- Route transitions can consistently update the document title and main-content focus.
- The application remains a Vite SPA; no SSR or full-stack framework migration is introduced.

## Alternatives considered

- Keep component-state navigation: rejected because it cannot support the learning route hierarchy.
- React Router Framework Mode: deferred because Data Mode provides the required routing behavior without changing the current build and server boundaries.
- Full framework rewrite: rejected for this increment because it would add risk without improving the initial learning loop.
