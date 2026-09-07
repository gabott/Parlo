# Parlo V2 Implementation Architecture

**Status:** Proposed architecture for approval  
**Version:** 1.0  
**Scope:** Evolution of the existing React/Vite/Vercel portal into the Parlo A1 learning platform  
**Constraint:** Preserve the existing production portal while delivering Units 1–3 as a safe vertical slice

**Related documents:** [A1 Specification](./PARLO_A1_SPEC.md) · [Curriculum Matrix](./PARLO_A1_CURRICULUM_MATRIX.md) · [Content Schema](./PARLO_CONTENT_SCHEMA.md) · [Learner-State Contract](./PARLO_LEARNER_STATE_ENGINE.md) · [Unit 1 Production Packet](./PARLO_A1_UNIT_01_PRODUCTION_PACKET.md)

## 1. Executive decision

Parlo V2 will be added to the existing application and deployed through the existing Vercel project. It will not be a separate public product or a rewrite launched all at once.

The architectural direction is:

```text
Existing React/Vite portal on Vercel
        │
        ├── Existing reference library remains usable
        │
        └── New /learn experience
              ├── Versioned compiled curriculum
              ├── Local-first guest learner state
              ├── Deterministic learning engine
              ├── Units 1–3 vertical slice
              └── Later account sync through Supabase
```

Primary decisions:

- Keep React and Vite.
- Migrate incrementally from JavaScript/JSX to strict TypeScript/TSX.
- Use React Router Data Mode for URL-based navigation without changing the build system into a full-stack framework.
- Keep curriculum authored in the repository as reviewed YAML documents, validate them with JSON Schema, and compile immutable runtime JSON bundles.
- Use IndexedDB for durable guest progress and an event-oriented local learner store.
- Add Supabase Auth, Postgres, and private Storage when account synchronization and recordings enter scope.
- Use Vercel Functions only for privileged operations such as AI calls, signed upload workflows, administrative publishing, and operations that require secrets.
- Keep the first learning engine deterministic, pure, versioned, and testable.
- Do not make AI, cloud accounts, or network access prerequisites for the initial A1 learning path.

## 2. Current-state assessment

The current repository is a small client-rendered application:

- React 19 and Vite.
- Plain JavaScript/JSX and CSS.
- State-based navigation in `App.jsx`.
- Content stored as JavaScript arrays under `src/content` and `src/data.js`.
- Static pronunciation files under `public/audio`.
- Static images under `public/images`.
- No router, backend, database, account system, content validation, or automated test suite.
- Vercel Analytics is installed.
- Vercel project metadata is ignored and not present in the working tree, which is expected for local deployment metadata.

The current portal is useful as:

- Brand and visual foundation.
- Reference-library prototype.
- Source of content candidates requiring editorial migration.
- Audio-generation prototype.
- Compatibility baseline for the production deployment.

It is not used as the domain architecture for V2. Current page state, quiz component state, and raw JavaScript arrays will be adapted behind stable interfaces rather than expanded indefinitely.

## 3. Architectural goals

1. Add the learning platform without breaking the live reference portal.
2. Make routes stable, restorable, shareable where appropriate, and compatible with browser navigation.
3. Keep curriculum independent from UI and learner data.
4. Record immutable attempts and derive progress/mastery from evidence.
5. Support reliable guest use before requiring an account.
6. Make future account sync additive rather than a redesign.
7. Permit deterministic offline learning for downloaded/cached content.
8. Validate content and learning rules before deployment.
9. Protect private writing, recordings, and learner histories.
10. Keep engine behavior explainable and replaceable.

## 4. Non-goals of the first vertical slice

- Complete A1 content production.
- AI conversation or automated pronunciation scoring.
- Full offline installability/PWA behavior.
- TEF simulations.
- Social features, leagues, subscriptions, or teacher tooling.
- Server-side rendering migration.
- A microservices architecture.
- A machine-learned recommendation model.
- Replacing every existing reference page.

## 5. System context

```text
┌──────────────────────────────── Browser ────────────────────────────────┐
│ React/Vite UI                                                          │
│  ├─ Portal/library routes                                              │
│  ├─ Learning routes and lesson player                                  │
│  ├─ Compiled content repository                                        │
│  ├─ Learning engine                                                    │
│  ├─ IndexedDB event/state store                                        │
│  └─ Sync client (disabled until accounts phase)                        │
└──────────────────────────────┬──────────────────────────────────────────┘
                               │ HTTPS
                ┌──────────────┴───────────────┐
                │                              │
        Vercel hosting/functions       Supabase platform
        ├─ Static application          ├─ Auth
        ├─ Public content/media        ├─ Postgres + RLS
        ├─ AI/API proxy later          └─ Private recording storage
        └─ Admin operations later
```

The browser may read/write the signed-in learner's permitted rows through the Supabase client under Row Level Security. Privileged credentials and AI provider keys remain server-side in Vercel Functions or an approved secure function environment.

## 6. Frontend architecture

### 6.1 Application modes

The application has one shell with two product areas:

- **Learn:** Today, A1 course, lessons, review, mistakes, progress, assessments.
- **Library:** Existing basics, vocabulary, grammar, phrases, videos, and future TEF reference pages.

The learning experience becomes the default home only after the vertical slice meets release gates. Until then, `/learn` is a labeled preview and `/` preserves the existing dashboard behavior.

### 6.2 Routing decision

Use React Router in **Data Mode** with `createBrowserRouter`.

Reasons:

- Stable nested URLs and browser Back/Forward behavior.
- Route loaders, pending states, error boundaries, and actions where useful.
- Keeps control of the existing Vite build and local-first data layer.
- Avoids an unnecessary framework/SSR migration during the learning-platform foundation.

Proposed route map:

```text
/
├── /learn
│   ├── /learn/onboarding
│   ├── /learn/today
│   ├── /learn/a1
│   ├── /learn/a1/unit/:unitId
│   ├── /learn/a1/unit/:unitId/lesson/:lessonId
│   ├── /learn/review
│   ├── /learn/mistakes
│   ├── /learn/progress
│   ├── /learn/assessment/:assessmentId
│   └── /learn/results/:resultId
├── /library
│   ├── /library/basics
│   ├── /library/vocabulary
│   ├── /library/grammar
│   ├── /library/phrases
│   └── /library/videos
├── /tef
├── /settings
│   ├── /settings/learning
│   ├── /settings/accessibility
│   └── /settings/privacy
└── /about
```

IDs in URLs are stable public slugs or mapped stable IDs, never database row numbers. Route loaders resolve and validate them through repositories.

### 6.3 Vercel SPA routing

Browser deep links require a Vercel rewrite to the application shell. The implementation phase will add a root `vercel.json` that sends non-file application routes to `index.html` while preserving static assets and function endpoints.

This must be verified in a Vercel Preview deployment before production because local Vite fallback can hide deployment-only routing errors.

### 6.4 UI composition

```text
AppRoot
├── GlobalErrorBoundary
├── ServiceProviders
│   ├── Router
│   ├── ContentRepository
│   ├── LearnerRepository
│   ├── EngineConfiguration
│   └── TelemetryConsent
└── AppShell
    ├── PrimaryNavigation
    ├── RouteOutlet
    └── GlobalFeedback/Announcements
```

The lesson player is activity-driven:

```text
LessonRoute
└── LessonPlayer
    ├── LessonHeader
    ├── ActivityRenderer
    │   └── registry[kind] → activity component
    ├── FeedbackPanel
    ├── ProgressControls
    └── ExitCheckResult
```

Activity components render typed activity definitions and emit learner responses. They do not calculate mastery or directly write storage.

### 6.5 State ownership

| State | Owner | Persistence |
|---|---|---|
| URL/page/lesson identity | Router | URL/history |
| Open menu, temporary UI state | Component | None/session only |
| Current unsent response | Activity component/draft service | Memory; draft storage for productive work |
| Content | Content repository | Compiled bundle + browser cache |
| Attempts and learner preferences | Learner repository | IndexedDB; later synchronized |
| Progress/mastery/review/mistakes | Derived-state engine/repository | IndexedDB; later server projection |
| Authentication session | Supabase client in accounts phase | Provider-supported secure client persistence |
| Server/API data cache | Repository/query layer | Explicit cache; not component-owned |

Avoid one large global context that rerenders the entire application. Use narrow providers and external-store subscriptions for durable learner state.

## 7. TypeScript migration

Use incremental migration with `allowJs` temporarily:

1. Add strict TypeScript configuration and shared domain types.
2. Write all new V2 modules in `.ts`/`.tsx`.
3. Keep existing `.jsx` pages working behind routed adapters.
4. Convert shared shell/navigation/audio utilities when touched.
5. Convert existing library pages by feature, not through a bulk rewrite.
6. Disable `allowJs` only after the old portal is migrated.

Required compiler posture for new code:

- Strict null checking.
- No implicit `any`.
- Indexed-access and override checks where practical.
- Separate generated content types from authoring schema validation.
- No unchecked casting of external/storage data into domain types.

Runtime validation remains required even with TypeScript because content files, local storage, URLs, and network data cross trust boundaries.

## 8. Proposed repository structure

```text
parlo/
├── api/                              # Vercel Functions; introduced only when needed
│   ├── ai/
│   └── account/
├── content/
│   ├── courses/fr-general/
│   │   ├── course.yaml
│   │   └── a1/
│   │       ├── level.yaml
│   │       ├── concepts/
│   │       ├── lexicon/
│   │       ├── media/
│   │       └── units/
│   │           └── first-contact/
│   │               ├── unit.yaml
│   │               ├── lessons/
│   │               ├── activities/
│   │               └── assessments/
│   ├── schemas/                      # JSON Schema source
│   └── sources/
├── generated/                        # build output; policy decides committed vs CI artifact
│   ├── content-manifest.json
│   └── bundles/
├── public/
│   ├── audio/
│   └── images/
├── scripts/
│   ├── content-build/
│   ├── content-validate/
│   └── audio/
├── src/
│   ├── app/
│   │   ├── router/
│   │   ├── providers/
│   │   ├── shell/
│   │   └── errors/
│   ├── features/
│   │   ├── onboarding/
│   │   ├── today/
│   │   ├── course-map/
│   │   ├── lesson-player/
│   │   ├── review/
│   │   ├── mistakes/
│   │   ├── progress/
│   │   ├── assessment/
│   │   ├── library/
│   │   └── settings/
│   ├── activities/
│   │   ├── registry/
│   │   └── renderers/
│   ├── domain/
│   │   ├── content/
│   │   ├── learner/
│   │   ├── attempts/
│   │   ├── mastery/
│   │   ├── review/
│   │   ├── mistakes/
│   │   ├── planning/
│   │   └── assessment/
│   ├── engine/
│   │   ├── scoring/
│   │   ├── evidence/
│   │   ├── mastery/
│   │   ├── scheduler/
│   │   ├── recommendations/
│   │   └── projections/
│   ├── repositories/
│   │   ├── content/
│   │   ├── learner/
│   │   └── sync/
│   ├── infrastructure/
│   │   ├── indexeddb/
│   │   ├── supabase/
│   │   ├── media/
│   │   └── telemetry/
│   ├── design-system/
│   └── legacy/                       # temporary adapters, removed incrementally
├── tests/
│   ├── fixtures/
│   ├── integration/
│   ├── accessibility/
│   └── e2e/
└── docs/
```

Dependencies flow inward:

```text
UI/features → application services → domain/engine
repositories/infrastructure implement domain ports
domain/engine import neither React nor Supabase
```

## 9. Content architecture

### 9.1 Authoring source of truth

Use reviewed YAML files in the repository for A1.

Reasons:

- Human-readable diffs and pull-request review.
- Curriculum and code can evolve atomically.
- No CMS dependency during initial content production.
- Schema validation can run locally and in CI.
- Content release bundles are reproducible.

A CMS can later become an authoring interface that exports the same schema. It must not introduce a second incompatible content model.

### 9.2 Validation and compilation

```text
YAML authoring
   → parse with duplicate-key rejection
   → validate JSON Schema
   → referential validation
   → pedagogical/language/accessibility rules
   → build normalized runtime entities
   → calculate manifest/checksums
   → emit immutable JSON bundle
```

Use JSON Schema as the canonical machine-readable schema and generate TypeScript types from it or verify parity in CI. This avoids treating TypeScript alone as validation for author-authored files.

Compilation fails on:

- Unknown or duplicate IDs.
- Broken references.
- Invalid accepted answers.
- Cyclic required prerequisites.
- Missing publication reviews/assets.
- Ambiguous selection items.
- Activity/evidence mismatches.
- Required accessibility alternatives missing.

### 9.3 Runtime content repository

The UI uses a `ContentRepository` interface, not raw imports:

```text
getCourse(courseId)
getLevel(levelId)
getUnit(unitId)
getLesson(lessonId)
getActivity(activityId)
getItems(itemIds)
getConcept(conceptId)
resolveMedia(mediaId)
searchLibrary(query, filters)
```

Initial implementation loads a bundled local manifest and lazy unit bundles. Later remote bundle delivery can implement the same interface.

### 9.4 Bundle strategy

- One small course/level manifest.
- One immutable bundle per unit for learning content.
- Shared lexicon/concept indexes split by need, with referenced records included or resolvable.
- Assessment forms may be packaged separately to reduce accidental answer exposure but client-side assessments cannot be considered securely secret.
- Cache keys include content bundle version.
- Existing public audio remains supported through a media resolver while stable manifests are introduced.

## 10. Learning engine architecture

The engine is a set of pure functions plus orchestration services.

```text
submitAttempt(response)
  → score(response, item, policy)
  → append attempt/evaluation
  → project activity/lesson progress
  → apply mastery evidence
  → update memory schedule
  → update mistake lifecycle
  → invalidate recommendations
```

Modules:

- **Scoring:** Objective-answer normalization and rubric handoff.
- **Evidence:** Converts evaluated attempts into weighted evidence.
- **Mastery:** Updates concept/skill estimates and confidence.
- **Scheduler:** Creates and updates spaced-review items.
- **Mistakes:** Groups, reinforces, resolves, or dismisses error records.
- **Progress projections:** Derives activity, lesson, unit, and level summaries.
- **Planning:** Produces Today plans from candidates, constraints, and reason codes.
- **Assessment:** Enforces form snapshots, section state, passing policies, and capability results.

Every engine module accepts an explicit versioned configuration and returns decision reason codes. It does not read the clock, random generator, database, or network implicitly; these dependencies are passed in so tests are deterministic.

## 11. Local-first learner persistence

### 11.1 Decision

Use IndexedDB for guest and offline-capable learner state. Do not use `localStorage` for core progress because its synchronous string storage is unsuitable for growing event histories, indexes, recordings metadata, and migrations.

Use a small, maintained IndexedDB wrapper rather than application-wide direct browser API calls. The wrapper is confined to `infrastructure/indexeddb` and implements learner repository ports.

### 11.2 Local stores

Initial logical stores:

```text
metadata
profiles
goals
enrollments
sessions
attempts
evaluations
activity_progress
lesson_progress
unit_progress
concept_mastery
memory_states
review_items
mistakes
assessment_attempts
capability_results
plans
recommendations
outbox
tombstones
```

Indexes prioritize:

- Learner + course/enrollment.
- Unprocessed event/order.
- Review due time/status.
- Content/concept lookup.
- Open mistake category/concept.
- Sync status/idempotency key.

### 11.3 Transaction boundary

Attempt submission and its immediate deterministic projections occur in one local transaction where practical:

1. Append attempt/evaluation.
2. Update projections/mastery/review/mistake state.
3. Add an outbox event if synchronization is enabled.

If projection fails, retain the attempt and mark recalculation required rather than lose learner evidence.

### 11.4 Local migrations

- Every local database has an integer schema version.
- Migrations are forward-only and tested against fixtures from every supported prior version.
- Before destructive transformation, create a verified export/snapshot where the platform permits.
- Failed migrations stop writes and offer recovery/export; they never silently clear all progress.

## 12. Cloud architecture

### 12.1 Decision

Adopt Supabase when authenticated synchronization begins:

- Supabase Auth for identity/session management.
- Postgres for learner events and derived state.
- Row Level Security and least-privilege grants for every exposed learner table.
- Private Supabase Storage for learner recordings.
- Database migrations stored and reviewed in the repository.

This is a planned V2 dependency, not required for the first local Units 1–3 slice.

### 12.2 Database shape

Postgres tables mirror the learner-state contract without copying public curriculum bodies into learner tables:

```text
profiles
learning_goals
course_enrollments
learning_sessions
attempts
attempt_evaluations
activity_progress
lesson_progress
unit_progress
concept_mastery
lexical_memory
review_items
mistakes
rubric_results
assessment_attempts
capability_results
daily_plans
recommendations
sync_cursors
deletion_jobs
```

Core principles:

- UUID/opaque primary keys.
- `user_id` ownership on every learner-owned root row.
- Foreign keys and uniqueness constraints enforce idempotency.
- Append-only attempt/response history; evaluation revisions supersede rather than overwrite.
- JSON columns only for bounded versioned payloads, not as a substitute for all relational structure.
- Content IDs/revisions remain strings referencing released content manifests.
- Timestamps stored in UTC; plan dates retain timezone.

### 12.3 Row-level security

- Enable RLS on every exposed learner table.
- Revoke unnecessary default grants.
- Write explicit select/insert/update/delete policies.
- Require authenticated ownership for learner data.
- Keep administrative/service credentials server-side only.
- Test positive and negative policies in CI against multiple users.
- Treat views and storage policies as part of the same security review.

### 12.4 Server-owned operations

The browser may submit learner-owned events under strict constraints. Operations requiring broader authority go through server functions:

- AI provider calls.
- Signed/private recording workflows where direct policies are insufficient.
- Human-review assignment and moderation.
- Content publishing and bundle promotion.
- Account export/deletion orchestration.
- Administrative recalculation or migration.
- Abuse/rate-limit enforcement.

Never expose Supabase service-role credentials or AI provider keys to browser code.

## 13. Synchronization architecture

Use an outbox/event synchronization model:

```text
Local attempt/event
  → local transaction and projection
  → durable outbox
  → authenticated batch upload
  → server idempotency validation
  → append canonical event
  → server projections
  → cursor-based changes returned
  → local merge/reprojection
```

Rules:

- Valid attempts from different devices merge; mastery never uses last-write-wins.
- Idempotency keys prevent duplicate evidence.
- Server time records receipt; client time remains informational with skew bounds.
- Server projection is authoritative for signed-in synchronized state.
- Local optimistic projections keep lessons responsive.
- Divergence triggers deterministic reprojection, not manual row overwrites.
- Preference changes use explicit revisions.
- Deletion tombstones prevent an old device from restoring removed private records.

Account linking:

1. Create/sign in to account.
2. Inventory local guest data and remote account data.
3. Explain whether data will merge.
4. Upload immutable guest events with their original IDs.
5. Server deduplicates and reprojects.
6. Confirm synchronization before replacing the guest identity mapping.

## 14. Audio and media architecture

### 14.1 Public course media

- Continue serving reviewed course audio/images as immutable public assets through Vercel/CDN paths initially.
- Introduce stable media manifests mapping IDs to versioned URIs/checksums.
- Cache immutable filenames aggressively.
- Do not overwrite an asset at an existing immutable URI; create a new version.
- Lazy-load dialogue and unit media.
- Preload only the current/next short audio where it improves interaction.

### 14.2 Audio generation

Refactor the existing generator into a manifest-driven pipeline:

```text
Published French text/media request
  → stable request record
  → generate missing candidates
  → store candidate metadata
  → human exception review
  → approve and include in release manifest
```

Generation must not automatically make an asset publishable.

### 14.3 Learner recordings

- Store short-lived local blobs while recording/reviewing.
- Upload only with consent and authenticated ownership.
- Use a private storage bucket and policies scoped to owner paths.
- Keep storage object operations through supported APIs.
- Store metadata/retention state in learner tables.
- Background deletion jobs remove expired objects and metadata coherently.
- Signed URLs are short-lived and never placed in analytics/logs.

## 15. API and function boundaries

The deterministic foundation does not need a general custom API. When functions are added, use narrow endpoints:

```text
/api/ai/conversation-turn
/api/ai/writing-feedback
/api/ai/pronunciation-feedback
/api/recordings/upload-intent
/api/account/export
/api/account/delete
/api/admin/content/publish
```

Each endpoint requires:

- Authentication where private state is involved.
- Schema validation.
- Authorization independent of client-provided ownership fields.
- Rate and payload limits.
- Request correlation IDs without raw private content in ordinary logs.
- Timeout/cancellation and user-safe failure behavior.
- Versioned response contract.
- Explicit provider/data-retention boundary for AI.

AI endpoints retrieve only the minimum approved learner/content context and return structured feedback. They may propose mistakes/mastery evidence, but deterministic policy decides whether and how proposals affect learner state.

## 16. Styling and design system

Preserve the existing brand while extracting reusable foundations:

- Color, spacing, typography, radius, shadow, motion, and breakpoint tokens.
- Button, link, input, select, card, dialog, tabs, progress, feedback, and media controls.
- Explicit interaction states: hover, focus-visible, active, disabled, correct, incorrect, pending.
- Semantic status colors accompanied by icon/text.
- Reduced-motion variants.
- High-contrast verification.

Use CSS Modules or clearly scoped feature styles for new components while retaining global tokens. Avoid a full styling-framework migration during the vertical slice.

## 17. Accessibility architecture

Accessibility is built into shared primitives and activity contracts:

- Route changes manage document title, main heading, focus, and announcements.
- Activity renderers must declare keyboard behavior and alternatives.
- Feedback uses live regions carefully without repeated noise.
- Sentence building uses ordered buttons/list controls, not drag-only interaction.
- Dialogues expose speaker-labeled transcripts.
- Audio controls expose playback state, speed, and descriptive labels.
- Assessment timing, if later introduced, supports defined accommodations.
- Automated checks run in component/integration tests; keyboard and screen-reader scenarios remain manual release gates.

An activity type cannot join the registry until it has accessibility behavior, scoring rules, event semantics, and tests.

## 18. Error handling and resilience

Error classes:

- Content load/validation failure.
- Unsupported content bundle.
- Local storage unavailable/quota failure.
- Attempt projection/recalculation failure.
- Audio/media failure.
- Offline/sync conflict.
- Authentication expiry.
- Server/AI evaluation failure.

Required behavior:

- Preserve submitted learner work before showing an error where possible.
- Allow deterministic learning to continue offline when content is present.
- Fall back from missing static audio to browser speech only in learning mode and label reduced quality; never silently substitute in assessments.
- Quarantine invalid content bundles and retain the last known valid bundle.
- Mark derived state for recalculation rather than discard attempts.
- Provide actionable recovery, retry, and export paths.
- Error boundaries operate at app, route, and activity levels so one defective activity does not destroy the full session.

## 19. Testing strategy

### 19.1 Test layers

1. **Content validation tests:** schema, references, answer uniqueness, lesson/assessment coverage, media manifests.
2. **Domain unit tests:** scoring, normalization, evidence, mastery, review, mistakes, planning, migrations.
3. **Component tests:** each activity renderer and feedback/accessibility behavior.
4. **Repository integration tests:** IndexedDB transactions, migrations, retries, and idempotency.
5. **Route integration tests:** deep links, restoration, loading/error states, legacy routes.
6. **End-to-end tests:** onboarding through lesson, review, Today plan, unit assessment, refresh, offline/resume.
7. **Security tests:** RLS ownership, cross-user denial, storage policies, function authorization.
8. **Accessibility tests:** automated rules plus documented keyboard/screen-reader flows.
9. **Deployment smoke tests:** Vercel Preview deep links, static media, analytics consent, and environment configuration.

### 19.2 Tool direction

- Vitest for TypeScript/domain tests because it integrates with Vite.
- React Testing Library for user-centered component tests.
- Playwright for browser/end-to-end and key accessibility flows.
- An accessibility assertion library integrated with component/E2E tests.
- JSON Schema validator plus custom cross-entity validation for content.

Exact packages and versions are selected during implementation and locked in the repository. Architecture depends on capabilities, not a transient version number.

### 19.3 Mandatory golden scenarios

Implement the eight acceptance scenarios from the learner-state contract as integration tests, plus:

- Directly open `/learn/a1/unit/first-contact/lesson/greetings` on a Vercel Preview.
- Complete an exit check, refresh, and retain completion/review state.
- Submit the same attempt twice and receive one evidence update.
- Correct a contraction/apostrophe variant without accepting invalid word order.
- Fail a lesson check and receive bounded remediation.
- Complete Unit 1 assessment Form A and preserve its content snapshot.
- Upgrade a local database fixture without losing attempts.
- Use the lesson player fully by keyboard.

## 20. Observability and analytics

Separate three concerns:

- **Operational telemetry:** failures, latency, content bundle, engine version, route/function health.
- **Learning state:** private attempts/mastery records required for the product.
- **Optional product analytics:** navigation/engagement collected under the approved consent model.

Do not send raw answers, writings, transcripts, recordings, names, email addresses, or signed media URLs to general analytics.

Operational events should include correlation ID, anonymous/session-safe identifiers where allowed, app release, content bundle, engine version, error code, and duration.

Vercel Analytics can remain for approved aggregate web analytics, but its event use must be reconciled with the product privacy/consent design before adding detailed learner events.

## 21. Security architecture

### Browser

- Treat all content/network/local-storage values as untrusted at runtime boundaries.
- Never embed privileged keys.
- Use a restrictive Content Security Policy compatible with required media/providers.
- Sanitize or render AI/user text as text, not arbitrary HTML.
- Limit recording size/duration and accepted MIME types.
- Avoid sensitive values in URLs.

### Backend/database

- Least-privilege grants plus RLS on every exposed table.
- Server-side authorization for privileged functions.
- Secrets only in managed environment variables.
- Rate limits and abuse controls on costly endpoints.
- Audit administrative access to learner work.
- Automated dependency and secret scanning.
- Tested backup/restore and deletion workflows.

### Content supply chain

- Content changes use pull requests and required reviews.
- Build bundles only from validated content.
- Release manifests contain checksums.
- Generated media/content records preserve provenance.
- Never commit ChatGPT exports, local `.env` files, or private learner fixtures.

## 22. Deployment environments

```text
Local development
  → Git feature branch
  → Vercel Preview deployment
  → optional Supabase preview/staging backend
  → reviewed production merge
  → existing Vercel production project
```

Environments:

- **Local:** fixture content/data; optionally local backend tooling later.
- **Preview:** per-branch Vercel URL, non-production database/project, synthetic learner data.
- **Production:** existing public URL, production content releases, production backend.

Rules:

- Preview must never connect by default to the production learner database.
- Environment validation fails startup/build when required values are absent or malformed.
- Production content bundles are immutable and promoted, not rebuilt differently after approval.
- Database migrations run through a reviewed release procedure before code that depends on them.
- Rollback must preserve newer learner events; application rollback must not require destructive database rollback.

## 23. CI/CD quality gates

Every pull request:

1. Install from lockfile.
2. Lint and type-check.
3. Validate and compile content.
4. Run unit/component/integration tests.
5. Build production assets.
6. Run content/media reference checks.
7. Deploy Vercel Preview.
8. Run deep-link and smoke tests against Preview.
9. Report accessibility/security checks.

Production promotion additionally requires:

- Human product/UX review of changed learner flows.
- Required content/editorial approvals.
- Database/RLS review when affected.
- Migration/rollback plan.
- No unresolved high-severity accessibility or security issue.
- Vertical-slice release checklist.

## 24. Migration of the existing portal

### Stage 1 — Route the existing pages without redesign

- Introduce the router and map current page states to Library routes.
- Preserve visual appearance and content behavior.
- Add legacy redirects or route aliases where needed.
- Add the Vercel SPA rewrite and Preview deep-link tests.
- Replace button-only navigation with links while retaining accessible mobile behavior.

### Stage 2 — Establish V2 foundations

- Add TypeScript/domain boundaries.
- Add content schema/validator/compiler.
- Add content and learner repository interfaces.
- Add IndexedDB guest storage and migration infrastructure.
- Add test foundation and design-system primitives.

### Stage 3 — Migrate reusable content

Classify every current record:

```text
reuse unchanged | edit then reuse | reference-only | duplicate | retire
```

- Assign stable IDs and sources/review status.
- Split slash-separated meanings into senses where required.
- Normalize noun articles/gender and phrase registers.
- Connect reviewed audio through media manifests.
- Keep legacy source files until migrated features pass parity checks.

### Stage 4 — Add `/learn` preview

- Onboarding and guest profile.
- Today dashboard.
- A1 course map.
- Lesson player/activity registry.
- Unit 1 content and learning loop.
- Review, mistakes, progress, and assessment.

### Stage 5 — Units 2–3 vertical slice

- Add reviewed content for Units 2 and 3.
- Exercise prerequisites and cross-unit review.
- Test longer-lived mastery, scheduling, and learner migration.
- Pilot before making Learn the default.

### Stage 6 — Accounts and synchronization

- Provision Supabase environments.
- Implement Auth, database migrations, RLS, private storage, outbox sync, export/deletion.
- Migrate/merge guest state only through an explicit user flow.

No stage deletes the existing portal experience before its replacement is accepted.

## 25. Units 1–3 vertical-slice milestones

### Milestone 1 — Navigable shell

- Stable routes and preserved Library.
- `/learn` preview route.
- Route-level error/loading/focus behavior.
- Vercel deep-link support.

### Milestone 2 — Content pipeline

- Schema files and validator.
- Unit 1 serialized content.
- Runtime bundle and repository.
- Content fixtures and CI validation.

### Milestone 3 — Lesson loop

- Lesson player.
- Presentation, selection, audio selection, builder, typed recall, dictation, matching, and basic speaking/self-review renderers.
- Attempt creation, scoring, feedback, exit check, and persistence.

### Milestone 4 — Learning intelligence

- Concept/lexical evidence projection.
- Deterministic review scheduler.
- Mistake notebook.
- Today-plan generator and reason codes.
- Progress/capability dashboard.

### Milestone 5 — Unit 1 completion

- Integrated review.
- Assessment Form A and alternate remediation/retry path.
- Audio manifest integration.
- Accessibility and pilot readiness.

### Milestone 6 — Cross-unit proof

- Units 2 and 3 content packets serialized.
- Prerequisite and cross-unit review behavior.
- Placement/manual start behavior at a bounded level.
- Content and local database migration demonstration.

### Milestone 7 — Preview pilot

- Vercel Preview deployment behind a clear preview entry.
- Synthetic and volunteer pilot flows.
- Fix critical usability, learning, accessibility, and data-loss issues.
- Decide whether to begin complete A1 production and account synchronization.

## 26. Performance budgets

Initial targets for the learning routes, measured and refined in Preview:

- Route-level code splitting for learning features and activity renderers.
- Initial app JavaScript kept within an approved budget, with a target below 250 KB compressed excluding optional feature chunks.
- Course manifest small enough for initial load; unit bundles lazy-loaded.
- No page loads a grid of active YouTube embeds until requested.
- Audio begins promptly from cached/CDN media and is cancelable.
- IndexedDB queries use bounded indexed reads; never load full attempt history for routine dashboard rendering.
- Derived projections prevent replaying all history on every startup.

Budgets are enforced in CI only after baseline measurement so arbitrary thresholds do not block useful work.

## 27. Architectural decision records

Create short ADRs for decisions that would be costly to reverse:

1. React Router Data Mode.
2. Repository-authored YAML plus compiled JSON bundles.
3. Local-first IndexedDB event store.
4. Supabase for account persistence and private storage.
5. Event/projection learner model.
6. Deterministic first learning engine.
7. Vercel SPA rather than SSR/framework migration.
8. Public course media vs private learner media.

Each ADR records context, decision, alternatives, consequences, and replacement triggers.

## 28. Alternatives considered

### Full rewrite in Next.js or another full-stack framework

Not selected now. It would add migration risk without solving the immediate curriculum, mastery, and content-quality problems. Reconsider if public content SEO, server rendering, or a unified server-component model becomes a measured requirement.

### React Router Framework Mode

Not selected for the initial migration. It offers additional framework features, but Data Mode provides routing/data primitives while retaining the current Vite application boundaries. Reconsider after the vertical slice if framework-level rendering/code-splitting benefits justify migration.

### Cloud-only accounts from day one

Not selected. It increases privacy, sync, and onboarding scope before the learning loop is validated. The local event model is explicitly designed to synchronize later.

### `localStorage` for progress

Rejected for core learner state because of synchronous access, limited structure/indexing, and weak migration support.

### CMS as the initial source of truth

Not selected. Repository-authored content provides stronger initial review/version coupling. Reconsider when non-technical author volume makes repository workflows the bottleneck.

### AI-first recommendation and scoring

Rejected for the foundation. It is harder to validate, explain, test, and operate offline. AI is added behind structured contracts after deterministic behavior works.

## 29. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Content scope overwhelms engineering | Delayed coherent release | Units 1–3 vertical slice; production packets; content gates |
| Architecture becomes over-engineered | Slow delivery | Implement interfaces only when exercised by vertical slice; pure modules, no microservices |
| Local data loss | Loss of trust | IndexedDB transactions, migrations, export, recovery tests |
| Guest-to-account merge duplicates evidence | Incorrect mastery | Immutable IDs, idempotency, server reprojection |
| RLS misconfiguration | Cross-user exposure | Least grants, explicit policies, multi-user negative tests |
| Audio mismatch/quality issues | Incorrect learning | Manifest/version checks and human audio review |
| Existing portal breaks during routing migration | Production regression | Route-only first change, parity E2E, Preview smoke tests |
| AI costs or outages block learning | Broken core course | Deterministic completion path and narrow server boundaries |
| Mastery appears falsely precise | Misleading learners | Confidence/evidence floors, explanations, calibration |
| Private responses leak into analytics/logs | Privacy harm | Data classification, redaction, schema-limited telemetry |

## 30. Approval decisions

This proposal recommends approving the following together:

1. Evolve the existing Vercel application rather than create a second app.
2. Keep React/Vite and add React Router Data Mode.
3. Use an incremental strict TypeScript migration.
4. Author reviewed curriculum in YAML and compile validated immutable JSON bundles.
5. Use IndexedDB for the initial guest/local learner store.
6. Use event attempts plus derived projections for progress/mastery.
7. Use deterministic, versioned scoring/review/planning engines first.
8. Plan Supabase Auth/Postgres/private Storage for the accounts phase.
9. Reserve Vercel Functions for privileged/server-secret operations.
10. Release `/learn` as a preview and validate Units 1–3 before changing the default home.

Items intentionally deferred until implementation planning:

- Exact package versions.
- Supabase project provisioning and paid tier.
- Authentication methods.
- AI model/provider selection.
- PWA/service-worker strategy.
- Monetization and entitlements.

## 31. Definition of architecture complete

Architecture is approved when:

- Product owner accepts the ten decisions above.
- Any rejected decision has a documented replacement.
- Unit 1 packet can be represented without schema exceptions.
- The learner-state acceptance scenarios map to modules and storage.
- Existing portal routes have a safe migration path.
- Preview, production, database, and private-media boundaries are understood.
- The first implementation plan can be written without inventing major product behavior.

## 32. Next artifact

After approval, create the **Units 1–3 Vertical-Slice Implementation Plan** containing:

- Ordered, reviewable increments.
- File/module scope for each increment.
- Database/content migrations when applicable.
- Tests and acceptance criteria per increment.
- Vercel Preview checkpoints.
- Rollback/compatibility expectations.
- Explicit “not included” boundaries.

That plan is the last artifact before application implementation begins.

## 33. Official capability references

- React Router documents Declarative, Data, and Framework modes and positions Data Mode for applications that want data APIs while retaining control of bundling and server abstractions: <https://reactrouter.com/start/modes>
- Vercel documents Vite deployment and the rewrite required for deep linking in a client-rendered SPA: <https://vercel.com/docs/frameworks/frontend/vite>
- Supabase documents its Auth architecture: <https://supabase.com/docs/guides/auth/architecture>
- Supabase documents Postgres Row Level Security, grants, and policies: <https://supabase.com/docs/guides/database/postgres/row-level-security>
- Supabase documents frontend/API security and the requirement to keep secret/service-role keys off the client: <https://supabase.com/docs/guides/database/secure-data>
- Supabase documents private object storage and access control: <https://supabase.com/docs/guides/storage>
