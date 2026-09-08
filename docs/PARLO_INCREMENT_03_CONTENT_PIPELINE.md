# Parlo Increment 3 — Content Schema, Validator, and Compiler

## Outcome

Increment 3 turns the approved content contract into an executable repository-authored pipeline and exposes its first compiled Unit 1 outline through Learn.

## Authoring and runtime flow

```text
content/courses/**/*.yaml
  → duplicate-key-safe YAML parsing
  → JSON Schema validation
  → references, cycles, answers, tokenization, publication, and accessibility checks
  → deterministic generated/content-manifest.json
  → immutable generated/bundles/*.json
  → ContentRepository
  → /learn/a1 and /learn/a1/unit/first-contact
```

The initial packet includes the seven-part Unit 1 structure and a small reviewed Lesson 1 pool. It remains draft or in review and is labeled accordingly in the UI. Complete lesson authoring and the lesson player are excluded from this increment.

Lesson 1 includes a public beta preview of the intended lesson rhythm. Beta availability does not change the source entities from `in_review` to `published` and does not represent completed linguistic, pedagogical, or accessibility approval.

## Commands

- `npm run content:validate` validates without writing output.
- `npm run content:build` validates and writes deterministic runtime JSON.
- `npm run build` compiles content before building the application.
- `npm run check` includes content validation in the repository gate.

## Authoring errors

Failures include the source filename, entity ID when available, field, problem, and suggested correction. Invalid content stops the production build.

## Runtime boundary

The UI reads compiled JSON through `ContentRepository`. YAML and authoring dependencies are never shipped as runtime parsing code.
