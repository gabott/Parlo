# ADR 0002: Commit generated content bundles

- Status: Accepted
- Date: 2026-09-07

## Context

Parlo authors A1 content in reviewed YAML, while the browser must load validated, immutable JSON without parsing authoring files. Preview and production builds must use the same source state and fail when invalid content is present.

## Decision

Commit deterministic files under `generated/` and regenerate them with `npm run content:build`. The production build runs the compiler before Vite, while CI and local checks run validation explicitly. The application accesses these files only through `ContentRepository`; it never imports YAML.

Each unit bundle and the course manifest contain SHA-256 checksums calculated from recursively key-sorted JSON. Repeated builds from the same sources must be byte-identical.

## Consequences

- Content changes show both author-friendly YAML and runtime JSON in review.
- Deployments do not require a YAML parser or schema validator in the browser.
- Reviewers can detect stale generated output in diffs and CI can reproduce it.
- Bundle updates intentionally increase repository size; bundles may move to release storage later without changing the repository interface.
