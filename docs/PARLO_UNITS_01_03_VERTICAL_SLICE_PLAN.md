# Parlo Units 1–3 Vertical-Slice Implementation Plan

**Status:** Proposed execution plan for approval  
**Version:** 1.0  
**Scope:** Preserve the existing portal and deliver a preview-quality learning loop for A1 Units 1–3  
**Implementation begins only after this plan is approved.**

**Related documents:** [A1 Specification](./PARLO_A1_SPEC.md) · [Curriculum Matrix](./PARLO_A1_CURRICULUM_MATRIX.md) · [Content Schema](./PARLO_CONTENT_SCHEMA.md) · [Learner-State Contract](./PARLO_LEARNER_STATE_ENGINE.md) · [Unit 1 Packet](./PARLO_A1_UNIT_01_PRODUCTION_PACKET.md) · [V2 Architecture](./PARLO_V2_IMPLEMENTATION_ARCHITECTURE.md)

## 1. Outcome

At the end of this plan, the existing Parlo deployment will contain a labeled `/learn` preview where a guest learner can:

1. Start or resume A1.
2. Navigate stable course, unit, lesson, review, mistake, progress, and assessment routes.
3. Complete reviewed lessons across Units 1–3.
4. Receive deterministic scoring and useful feedback.
5. Preserve progress after refresh/browser restart.
6. Build concept and vocabulary memory evidence.
7. Receive spaced reviews and an explainable Today plan.
8. See automatically captured and later resolved mistakes.
9. Complete Unit 1's integrated review and capability assessment.
10. Exercise prerequisites and cross-unit review through Units 2 and 3.

The existing Basics, Vocabulary, Grammar, Phrases, Practice, Videos, and TEF areas remain available as the Library throughout implementation.

## 2. Delivery strategy

Work is divided into small, reviewable increments. Each increment should normally produce one focused pull request and one Vercel Preview deployment.

```text
Safety baseline
  → Routes and existing-portal parity
  → Type/test/design foundations
  → Content compiler
  → Local learner event store
  → Activity renderers and scoring
  → Lesson completion
  → Mastery/review/mistakes
  → Today/progress
  → Unit 1 assessment
  → Units 2–3 cross-unit proof
  → Pilot hardening
```

Rules for every increment:

- Preserve unrelated user changes.
- No production deployment before its Preview checks pass.
- Schema/storage migrations are forward-only and tested.
- New behavior has automated tests proportional to risk.
- Accessibility behavior is part of completion, not postponed cleanup.
- Any architectural departure is recorded before implementation continues.
- A pull request must remain revertible without destroying learner records.

## 3. Branch and deployment model

Suggested branches:

```text
main
├── codex/v2-01-safety-baseline
├── codex/v2-02-routing
├── codex/v2-03-types-tests-design
├── codex/v2-04-content-pipeline
├── codex/v2-05-learner-store
├── codex/v2-06-lesson-player
├── codex/v2-07-learning-engine
├── codex/v2-08-today-progress
├── codex/v2-09-unit1-assessment
├── codex/v2-10-units2-3
└── codex/v2-11-pilot-hardening
```

Actual branch names may be shorter, but each should identify one increment. Later branches begin from the merged predecessor unless genuinely independent.

Vercel environments:

- Feature branch → Vercel Preview.
- `main` → existing production application.
- `/learn` remains visibly Preview/Beta until the pilot release gate is passed.
- Preview uses synthetic/local learner data; it must not connect to a future production learner database.

## 4. Definition of done for every increment

An increment is complete only when:

- Acceptance criteria pass.
- Lint, type-check, tests, content validation, and production build pass as applicable.
- Direct route loading works in the Vercel Preview.
- New keyboard interactions work without a mouse.
- Error/loading/empty states are addressed.
- No secrets or private learner data are committed/logged.
- Documentation/ADR is updated if behavior or architecture changed.
- Rollback impact is understood.
- Existing portal smoke tests pass.

## 5. Increment 0 — Repository safety baseline

### Goal

Create a measurable compatibility baseline before structural changes.

### Scope

- Document current public routes/page states and primary interactions.
- Add smoke coverage for the existing dashboard and every current section.
- Capture representative responsive screenshots or visual baselines where practical.
- Record current build output size and primary-route performance baseline.
- Resolve the existing minor lint warning or explicitly track it.
- Add a short contribution checklist for generated/AI-assisted changes.

### Likely files/modules

```text
tests/e2e/legacy-portal.spec.*
tests/fixtures/
playwright.config.*
docs/adr/
package.json
```

No application behavior should intentionally change.

### Required tests

- Dashboard renders.
- Each navigation item opens its current page.
- Mobile menu opens, navigates, and closes.
- One audio action is attempted with media mocked or controlled.
- Vocabulary search/filter works.
- Grammar topic opens and returns.
- Practice quiz can finish and restart.

### Preview checkpoint

- Existing Vercel Preview looks and behaves like current production at desktop and mobile widths.
- Production build succeeds from a clean install.

### Rollback

Safe code-only revert; no data/content migration.

### Excluded

- Routing refactor.
- TypeScript conversion.
- UI redesign.

## 6. Increment 1 — URL routing and portal preservation

### Goal

Replace page-only component state with stable routes while preserving the current portal.

### Scope

- Add React Router Data Mode.
- Create root shell, route-level error boundary, and Library routes.
- Convert sidebar navigation controls to semantic links.
- Preserve active navigation and mobile close behavior.
- Add `/learn` placeholder/preview landing page.
- Add route titles, main-focus handling, and navigation announcements.
- Add Vercel SPA rewrite configuration.
- Add redirects/aliases from any old link format that exists.

### Target routes

```text
/
/library/basics
/library/vocabulary
/library/grammar
/library/phrases
/library/practice
/library/videos
/tef
/learn
```

### Likely files/modules

```text
src/app/router/
src/app/shell/
src/features/library/
src/features/learn-preview/
src/main.*
src/App.*
src/Sidebar.*
vercel.json
tests/e2e/routing.spec.*
```

### Required tests

- Existing baseline remains green.
- Browser Back/Forward works.
- Refresh preserves the current route.
- Unknown route shows recoverable 404 state.
- Mobile navigation manages focus and expanded state.
- Direct deep links work locally and in Vercel Preview.

### Preview checkpoint

Open every route directly by URL, including a hard refresh. Confirm static audio/images and analytics still load.

### Rollback

Revert router and `vercel.json`; current state navigation remains recoverable from the previous commit.

### Excluded

- Learner progress.
- Actual lessons.
- Restyling existing pages.

## 7. Increment 2 — TypeScript, test, and design foundations

### Goal

Establish strict foundations for all new V2 modules without bulk-rewriting the portal.

### Scope

- Add strict TypeScript configuration with temporary JavaScript compatibility.
- Add shared branded ID, result/error, localization, and clock/random interfaces.
- Add Vitest and React Testing Library.
- Configure Playwright from the baseline increment.
- Establish design tokens and new-component styling convention.
- Build accessible V2 primitives: Button, Link, Field, Card, Progress, Feedback, Tabs only if true tab behavior is required, AudioControl, and VisuallyHidden.
- Add automated accessibility assertions for primitives.

### Likely files/modules

```text
tsconfig*.json
vite.config.*
src/domain/shared/
src/design-system/
src/app/providers/
tests/setup.*
package.json
```

### Required tests

- Strict type-check succeeds for new modules.
- Primitive keyboard/focus/disabled behavior.
- Feedback status is exposed through text/semantics, not color alone.
- Reduced-motion styles are respected.
- Current JavaScript pages still build.

### Preview checkpoint

No visible regression; `/learn` placeholder uses the new primitives and passes keyboard/contrast inspection.

### Rollback

Tooling/config and isolated primitives can be reverted without content or learner-data impact.

### Excluded

- Converting all legacy files.
- Choosing a broad UI framework.

## 8. Increment 3 — Content schema, validator, and compiler

### Goal

Turn the approved content contract into an executable, validated content pipeline.

### Scope

- Implement JSON Schemas for the subset exercised by Unit 1, while preserving extension points from the full schema.
- Define stable ID/ref validation and controlled taxonomies.
- Parse repository-authored YAML with duplicate-key rejection.
- Implement structural, referential, activity-answer, dependency-cycle, media-reference, and publication-state checks.
- Compile normalized immutable JSON bundles and a course manifest.
- Generate or verify runtime TypeScript types.
- Serialize Unit 1's course, level, unit, concepts, lexicon, lesson manifests, and initial item pools.
- Add author-friendly validation errors containing source file, entity ID, field, and suggested correction.

### Likely files/modules

```text
content/schemas/
content/courses/fr-general/
scripts/content-validate/
scripts/content-build/
src/domain/content/
src/repositories/content/
generated/content-manifest.json
generated/bundles/
tests/content/
```

### Runtime policy

- Generated files are reproducible.
- Decide in this increment whether runtime bundles are committed or CI-generated; document the decision in an ADR.
- Application code reads through `ContentRepository`, never imports YAML.

### Required tests

- Valid Unit 1 fixture compiles deterministically.
- Duplicate IDs/keys fail.
- Broken reference and prerequisite cycle fail.
- Ambiguous selection answer fails.
- Sentence tokenization preserves contractions.
- Missing required transcript/accessibility alternative fails publication.
- Repeated build produces identical checksums.

### Preview checkpoint

- `/learn/a1` reads its title/unit summary from the compiled manifest.
- `/learn/a1/unit/first-contact` loads the Unit 1 bundle lazily.
- Invalid content cannot produce a deployable build.

### Rollback

The existing Library remains independent. Remove content routes/pipeline without learner-state migration.

### Excluded

- Complete Unit 1 item authoring.
- CMS.
- Database content storage.

## 9. Increment 4 — Guest learner repository and event store

### Goal

Persist guest identity, goals, enrollment, attempts, and projections safely in IndexedDB.

### Scope

- Define learner repository ports.
- Implement IndexedDB database version 1 and transactions.
- Create guest profile and A1 enrollment on explicit start.
- Persist learning sessions, attempt events, evaluations, progress, and outbox records.
- Add idempotent attempt submission.
- Add export-to-file and local-progress deletion controls.
- Add storage-unavailable/quota recovery behavior.
- Add migration harness and old-version fixtures.

### Likely files/modules

```text
src/domain/learner/
src/domain/attempts/
src/repositories/learner/
src/infrastructure/indexeddb/
src/features/onboarding/
src/features/settings/privacy/
tests/integration/indexeddb/
tests/fixtures/learner-db/
```

### Required tests

- First start creates one guest and enrollment.
- Refresh/browser restart preserves state.
- Duplicate attempt idempotency key stores one event.
- Attempt plus immediate projection is transactional.
- Failed projection preserves the attempt and marks recalculation.
- Export contains documented data and no secret/internal browser material.
- Deletion removes/tombstones the learner state as designed.
- Version 1 migration fixture succeeds without losing attempts.

### Preview checkpoint

- Start A1, refresh, and see the same enrollment.
- Export local progress and inspect its documented structure.
- Delete progress only after explicit confirmation and return to clean onboarding.

### Rollback

Application rollback must leave unknown IndexedDB stores untouched. A later compatible build can recover them. Never clear storage automatically because an older code version does not recognize it.

### Excluded

- Accounts or Supabase.
- Multi-device synchronization.
- Voice recording persistence.

## 10. Increment 5 — Scoring and initial activity renderers

### Goal

Render and score the deterministic activity types required by Unit 1.

### Scope

- Build registry-based activity renderer.
- Implement presentation/dialogue, meaning selection, audio-text selection, text-audio selection, matching, sentence builder, typed recall, dictation, and guided speaking/self-review.
- Implement French normalization: Unicode, apostrophes, whitespace, optional terminal punctuation, objective-aware accents.
- Emit submitted responses; activity components never write repositories directly.
- Implement deterministic evaluation and feedback.
- Provide keyboard and non-drag sentence construction.
- Add audio speed/replay controls and transcripts according to activity policy.

### Likely files/modules

```text
src/activities/registry/
src/activities/renderers/
src/domain/attempts/
src/engine/scoring/
src/features/lesson-player/components/
src/infrastructure/media/
tests/activities/
tests/domain/scoring/
```

### Required tests

- Every renderer submits the correct response envelope.
- Correct option cannot be changed after final submission unless retry begins.
- Straight/curly apostrophes normalize.
- Missing accent behavior changes by objective.
- `J'habite` cannot become `J' habite` through sentence construction.
- Unsupported free text returns `needs_review` where specified.
- Feedback receives screen-reader announcement without duplicating on rerender.
- All renderers complete by keyboard.
- Missing learning audio produces explicit fallback; assessments do not silently substitute.

### Preview checkpoint

A content-fixture gallery at a non-production/debug-only route demonstrates every activity state: unanswered, correct, incorrect, retry, pending, error, and accessible alternative.

### Rollback

Renderers are registry-isolated. Removing the preview learning routes does not affect the Library.

### Excluded

- Mastery calculation.
- AI or human grading.
- Open-ended conversation.

## 11. Increment 6 — Unit 1 lesson player and completion

### Goal

Deliver all five Unit 1 lessons through the complete instruction-to-exit-check loop.

### Scope

- Implement lesson route loader and player orchestration.
- Add activity sequence, progress, resume position, previous/next behavior, and exit checks.
- Complete Unit 1's required item pools sufficiently for internal pilot.
- Connect Unit 1 dialogues, teaching copy, pronunciation guidance, and audio manifests.
- Persist attempts and lesson progress.
- Implement retry/remediation after failed exit checks.
- Move focus/announce activity and lesson transitions correctly.

### Likely files/modules

```text
src/features/lesson-player/
src/features/course-map/
content/courses/fr-general/a1/units/first-contact/
public/audio/ or versioned media path
tests/integration/lesson-player/
tests/e2e/unit1-lessons.spec.*
```

### Required tests

- Complete each lesson independently.
- Exit check requires 70% and its production/recall condition.
- Failed check creates a bounded retry path.
- Refresh resumes exact safe position without resubmitting attempts.
- Completed lesson stays completed when revisited.
- Later concept review does not revoke completion.
- Unit does not report assessment-ready before all prerequisites and review.
- Lesson works with no network after bundle/media are already available, within this increment's cache limits.

### Preview checkpoint

Manual run of Lessons 1–5 on desktop/mobile and keyboard-only. Confirm all transcripts/audio, errors, refresh/resume, and learner-facing explanations.

### Rollback

Unit 1 records remain namespaced/versioned. A rollback hides `/learn` but does not delete attempts.

### Excluded

- Unit capability assessment.
- Adaptive Today plan.
- Automated speech scoring.

### Lesson-experience commitments

The following are required learning-quality commitments, not optional enhancement ideas. Increment 6 cannot receive product approval until every Increment 5/6 item below is implemented and verified in Lesson 1. Increment 7 cannot receive product approval until the retained-learning items are implemented. Later lesson work must reuse these capabilities rather than silently dropping them.

| Commitment | Delivery increment | Acceptance evidence |
|---|---:|---|
| Progressive transcript: audio first, French transcript second, English support on demand | 5–6 | Lesson 1 browser test covers each support level. |
| Normal and learner-speed native audio with replay | 5–6 | Every required Lesson 1 audio control exposes both speeds and never silently uses browser speech when reviewed media exists. |
| Error-specific feedback and an explicit retry state | 5 | Confusing options explain why they do not fit; retry emits a separate attempt. |
| Direct contrast practice for `bonjour` / `bonne journée` and `bonsoir` / `bonne soirée` | 6 | Lesson 1 contains scored arrival-versus-leaving and day-versus-evening contrasts. |
| Interactive dialogue participation as Sofia or Ira | 6 | Learner selects or speaks the missing turn in both arrival and leaving scenes. |
| Pronunciation support using short sound/phrase groups | 6 | Core phrases provide model, segmented support, replay, and a non-judgmental self-check. |
| Guided speaking self-review | 5–6 | Checklist covers situational fit, intelligibility, and phrase grouping; recordings remain local and disposable. |
| Delayed no-hint recall within Lesson 1 | 6 | An earlier phrase returns after intervening activities without transcript or meaning support. |
| New-context transfer challenge | 6 | Learner completes an unseen shop, café, classroom, or neighbour exchange. |
| Confidence input (`Easy`, `Unsure`, `Hard`) | 7 | Confidence is stored as evidence metadata and influences review priority without overriding performance. |
| Meaningful completion summary | 6–7 | Summary shows ability gained, strengths, phrases to revisit, and a recommended next action—not points alone. |
| Scheduled post-lesson review | 7 | Incorrect or low-confidence expressions enter a deterministic review queue. |
| Cross-lesson retrieval | 7 and later content | Lesson 2 naturally retrieves one or two Lesson 1 phrases; automated content checks require planned retrieval links. |
| Consistent memory cues | 6 and later content | Sun, moon, arrival, friendship, and departure cues follow the illustration guide and have accessible alternatives. |
| Capability-based celebration | 6 | Completion copy states the real-world interaction the learner can now perform. |

Current Lesson 1 UI work is a prototype of several rows above; presence in the prototype does not mark a commitment complete. Completion requires the reusable renderer/orchestrator implementation and its stated acceptance evidence.

## 12. Increment 7 — Evidence, mastery, review, and mistakes

### Goal

Turn lesson attempts into retained-learning behavior.

### Scope

- Implement versioned evidence weighting and guardrails.
- Project concept mastery and lexical modality state.
- Implement deterministic review scheduler and interval ladder.
- Implement review queue/session with interleaving and modality variation.
- Implement mistake grouping, recurrence, improvement, resolution, dismissal, and remediation links.
- Add engine recalculation checkpoints.
- Expose learner-readable reason codes and confidence/evidence limitations.

### Likely files/modules

```text
src/engine/evidence/
src/engine/mastery/
src/engine/scheduler/
src/engine/mistakes/
src/engine/projections/
src/features/review/
src/features/mistakes/
tests/domain/engine/
tests/integration/review-mistakes/
```

### Required tests

- Exposure gives no mastery.
- Recognition alone cannot reach Mastered.
- Delayed independent recall outweighs immediate retry.
- Same attempt processed twice updates once.
- Failed recall schedules relearning without erasing history.
- Alphabet review targets confused letters, not all 26 equally.
- Sound review rotates valid variants.
- Repeated equivalent errors group into one mistake.
- Immediate correction moves Open → Improving; delayed varied success resolves.
- Engine projections rebuild from attempt fixtures deterministically.
- Clock-dependent tests use an injected fixed clock.

### Preview checkpoint

- Complete a lesson with seeded/mocked time progression.
- Observe due review items and reasons.
- Produce a known error, correct it, advance time, resolve it in a varied item.
- Verify dashboard summaries do not call low-confidence evidence Mastered.

### Rollback

Attempts remain canonical. Derived stores may be ignored/rebuilt by another engine version. No destructive rollback.

### Excluded

- Learned/ML scheduler.
- Server synchronization.

## 13. Increment 8 — Today plan and progress dashboard

### Goal

Make Parlo tell the learner what to do next and why.

### Scope

- Implement deterministic recommendation candidate generation and priority scoring.
- Build time-budgeted daily plan for 5–60+ minute choices.
- Add resume, due review, remediation, next lesson, complementary skill, and assessment-ready candidates.
- Add learner-facing reason templates.
- Build Today route and plan lifecycle.
- Build course/unit progress and capability dashboard.
- Distinguish completion, retained core, capability, skill evidence, and due reviews.
- Add goal/study-time settings.

### Likely files/modules

```text
src/engine/recommendations/
src/engine/planning/
src/features/today/
src/features/progress/
src/features/settings/learning/
tests/domain/planning/
tests/e2e/today-plan.spec.*
```

### Required tests

- Thirty-minute acceptance scenario from the learner-state contract.
- Five-minute plan does not start a long lesson/assessment.
- Review backlog is capped rather than consuming all future plans indefinitely.
- One primary new lesson maximum in a typical short plan.
- Weak prerequisite produces remediation explanation.
- Missing evidence displays uncertainty, not an invented score.
- Regenerating a plan preserves completed history and supersedes only unstarted items.
- Timezone/day changes are deterministic.

### Preview checkpoint

Use seeded learner profiles representing new, mid-unit, overdue-review, repeated-mistake, and assessment-ready states. Verify each plan and explanation manually.

### Rollback

Plans/recommendations are disposable derived artifacts. Lessons and review remain accessible through course navigation.

### Excluded

- AI-written plans.
- Time-to-level marketing promises beyond clearly labeled coarse estimates.

## 14. Increment 9 — Unit 1 integrated review and assessment

### Goal

Prove capability-based completion rather than lesson-page completion.

### Scope

- Implement mixed integrated review composition.
- Implement assessment attempt/form snapshot and section orchestration.
- Author/finalize Unit 1 Form A and Form B item pools.
- Implement no-feedback-until-submit assessment policy.
- Implement writing point allocation and structured speaking self-review rubric.
- Calculate capability result and remediation map.
- Preserve assessment bundle/form revision.
- Add retry eligibility with alternate form.

### Likely files/modules

```text
src/features/assessment/
src/engine/assessment/
content/.../first-contact/assessments/
tests/domain/assessment/
tests/e2e/unit1-assessment.spec.*
```

### Required tests

- Assessment is unavailable before required lessons/review.
- Form selection and snapshot remain stable through refresh.
- Learning hints/answer feedback do not leak into active assessment.
- Pass rules enforce overall, listening, and productive floors.
- Accent subscore behaves as specified.
- Failed result creates targeted remediation.
- Retry selects alternate valid form after policy delay/remediation.
- Historical result remains tied to original content bundle.
- Deleting required speaking evidence explains/causes result invalidation according to policy.

### Preview checkpoint

Run passing, failing, interrupted/resumed, and alternate-form paths. Review result explanations and verify no official CEFR-certification implication.

### Rollback

Assessment attempts remain historical learner records. Hiding assessment routes does not modify lesson progress.

### Excluded

- Official certification.
- AI pronunciation score.
- Timed assessment.

## 15. Increment 10 — Units 2 and 3 cross-unit proof

### Goal

Demonstrate that the architecture scales beyond one specially coded unit.

### Content prerequisite

Create and approve Unit 2 and Unit 3 production packets using the Unit 1 format before or alongside serialization. They require complete internal-pilot item pools and reviewed audio for included activities.

### Scope

- Serialize Units 2 and 3 through the same content pipeline.
- Add only reusable activity behavior; do not hard-code unit-specific UI.
- Implement prerequisite and availability logic.
- Exercise cross-unit concepts such as `être`, `avoir`, countries, numbers, contact details, and questions.
- Schedule reviews across unit boundaries.
- Verify placement/manual-start behavior at a bounded level.
- Demonstrate content bundle and local database migration.
- Add Units 2 and 3 integrated reviews and internal capability checks as content readiness permits.

### Likely files/modules

```text
content/.../a1/units/introductions-identity/
content/.../a1/units/personal-information/
tests/e2e/units2-3.spec.*
tests/fixtures/content-bundles/
tests/fixtures/learner-db/
```

Engine/UI changes are allowed only when they represent a reusable requirement missed by Unit 1 and are documented.

### Required tests

- Unit ordering and prerequisites.
- Placement/manual start creates verification reviews for skipped foundations.
- Unit 1 vocabulary can become due during Unit 2/3 without blocking all new learning.
- Weak `être` evidence influences Unit 2 remediation.
- `avoir` evidence is distinct from `être` and modality-specific.
- Numbers/spelling contribute correctly to listening/writing evidence.
- Bundle update retains old historical assessment snapshots.
- No content-specific switch statement is needed to render Units 2/3.

### Preview checkpoint

A fresh learner completes a representative path from Unit 1 through Unit 3; a seeded returning learner begins later and receives prerequisite verification.

### Rollback

Unit bundles can be removed from the current manifest while historical IDs remain resolvable from retained released bundles. Never reuse their IDs.

### Excluded

- Units 4–12.
- Complete placement across A1.
- Cloud sync.

## 16. Increment 11 — Pilot hardening and preview release

### Goal

Make the Units 1–3 slice reliable enough for invited learner testing without changing the production homepage.

### Scope

- Complete linguistic, pedagogical, audio, and accessibility review for pilot content.
- Fix high-severity usability/content/data issues.
- Optimize unit bundles, media loading, and database reads.
- Add recovery for corrupted/unsupported local state.
- Finalize privacy copy for guest storage, recordings, analytics, export, and deletion.
- Add feedback/report-content mechanism that does not expose private responses.
- Run security/dependency/secret checks.
- Establish pilot analytics under approved consent.
- Add preview banner and feedback channel.

### Required validation

- Clean install/build/type-check/lint/tests.
- Content bundle checksum reproducibility.
- All critical E2E flows in Chromium plus supported browser matrix.
- Keyboard-only full Unit 1 journey.
- Representative screen-reader review.
- Mobile portrait and desktop usability.
- Offline interruption and storage recovery.
- Vercel Preview hard-refresh/deep links.
- No high-severity accessibility/security/data-loss issue.

### Preview checkpoint

Invite a small, consented pilot group. Keep `/learn` labeled Preview and the existing `/` dashboard unchanged.

### Rollback

Remove/hide the Learn preview entry through a reversible release/feature flag while preserving local learner export/recovery. Existing Library remains functional.

### Excluded

- Public claim that A1 is complete.
- Default-home switch.
- Paid launch.

## 17. Cross-increment dependency map

```text
I0 Safety baseline
  └── I1 Routing
      └── I2 Types/tests/design
          ├── I3 Content pipeline
          └── I4 Learner store
               └─────────┐
I3 Content pipeline ──────┼── I5 Activities/scoring
                          └── I6 Unit 1 lesson loop
                              └── I7 Mastery/review/mistakes
                                  └── I8 Today/progress
I6 + I7 ────────────────────────→ I9 Unit 1 assessment
I3–I9 ──────────────────────────→ I10 Units 2–3 proof
I0–I10 ─────────────────────────→ I11 Pilot hardening
```

Content authoring for Units 2 and 3 can proceed in parallel with later engineering increments once their production packet work is authorized, but those packets must be reviewed before serialization is treated as pilot content.

## 18. End-to-end acceptance suite

The vertical slice is technically complete only when these journeys pass:

### Journey A — New guest learner

1. Opens existing portal.
2. Selects Learn Preview.
3. Chooses beginner and a 30-minute goal.
4. Starts Unit 1 Lesson 1.
5. Completes activities and exit check.
6. Refreshes and resumes with completion intact.
7. Sees next lesson and future review reason.

### Journey B — Mistake and delayed repair

1. Produces a known wrong response.
2. Receives specific feedback and focused retry.
3. Sees one grouped mistake record.
4. Advances injected/real time until review is due.
5. Succeeds in a varied context.
6. Sees mistake move to Resolved without erasing history.

### Journey C — Unit capability

1. Completes five Unit 1 lessons and review.
2. Becomes assessment-eligible.
3. Starts Form A and refreshes mid-assessment.
4. Resumes the same content snapshot.
5. Passes or receives targeted remediation.
6. If failed, later uses Form B.

### Journey D — Cross-unit learning

1. Completes Unit 1 and enters Unit 2.
2. Receives due Unit 1 review mixed with Unit 2 work.
3. Demonstrates recognition but weak production for `être`.
4. Today plan recommends productive practice and explains why.
5. Continues to Unit 3 without review backlog consuming the whole plan.

### Journey E — Storage and recovery

1. Builds progress across sessions.
2. Exports local data.
3. Application upgrades local database/content bundle.
4. Attempts and historical assessment revisions remain valid.
5. A simulated projection failure rebuilds from events.

### Journey F — Accessibility

1. Completes onboarding, Lesson 1, review, and assessment path by keyboard.
2. Receives appropriate focus and announcements.
3. Uses transcripts and non-drag sentence builder.
4. Uses the declared alternative when recording is unavailable.
5. Understands status without relying on color.

## 19. Data and content compatibility guarantees

During the preview:

- Attempt IDs are immutable and idempotent.
- Stable content IDs are not reused.
- Historical assessment attempts retain bundle/form revisions.
- Derived mastery/review/plans may be recalculated by versioned engines.
- Schema migrations do not silently delete progress.
- Content fixes create new revisions/bundles.
- A rollback may hide new features but must not corrupt learner storage.
- Export format is documented and versioned from its first pilot release.

Because the preview is pre-release, migrations may still change structure, but they must preserve valid learner evidence or explicitly notify/export before an unavoidable breaking change.

## 20. Testing matrix

| Area | Unit | Component | Integration | E2E/Preview |
|---|---:|---:|---:|---:|
| Content schema/compiler | Required | — | Required | Build gate |
| French answer normalization | Required | — | Required | Representative |
| Activity renderers | Required logic | Required | Required | Critical types |
| IndexedDB/migrations | Required | — | Required | Refresh/recovery |
| Attempt idempotency | Required | — | Required | Duplicate sync simulation |
| Mastery/evidence | Required | — | Required fixtures | Learner journey |
| Review scheduling | Required, fixed clock | Review UI | Required | Time progression |
| Mistake lifecycle | Required | Notebook UI | Required | Delayed resolution |
| Planning/recommendations | Required | Today UI | Required | Seeded profiles |
| Assessment | Required | Sections/results | Required | Pass/fail/resume/retry |
| Routing | — | Route boundaries | Required | Vercel deep link |
| Accessibility | Semantics helpers | Required | Key flows | Keyboard/screen reader |
| Existing Library | Existing logic | Smoke | Smoke | Full baseline |

## 21. Review checkpoints requiring product approval

Stop for explicit review after:

1. **Increment 1:** Route map and preserved production experience.
2. **Increment 3:** Real compiled Unit 1 content shape and authoring ergonomics.
3. **Increment 6:** Complete Unit 1 lesson-player experience.
4. **Increment 8:** Mastery language, Today-plan priorities, and progress presentation.
5. **Increment 9:** Assessment validity and learner-facing results.
6. **Increment 11:** Whether the slice is ready for invited pilots.

Approval of an earlier checkpoint does not authorize public claims that all A1 features/content are complete.

## 22. Operational rollback model

- **Frontend failure:** Revert deployment to last healthy Vercel release.
- **Route failure:** Revert router/rewrite release; retain learner IndexedDB untouched.
- **Content failure:** Point manifest to the last valid immutable bundle; retire defective bundle for new sessions.
- **Engine failure:** Roll back engine configuration/code and reproject derived state from attempts.
- **Local migration failure:** Stop writes, retain old stores, offer export/recovery, and ship a corrective forward migration.
- **Audio failure:** Restore prior manifest; learning fallback may be used where declared, assessment must use valid reviewed media.
- **Privacy/security issue:** Disable affected route/function, revoke access, preserve audit evidence, and follow incident procedure.

Rollback never includes clearing all browser storage or rewriting submitted attempts as a convenience.

## 23. Explicitly deferred work

The following are not part of this vertical slice:

- Supabase provisioning, account login, and multi-device synchronization.
- Learner recording cloud storage.
- AI conversation, writing feedback, sentence explanation, or pronunciation evaluation.
- Advanced speech recognition.
- Units 4–12 implementation.
- Complete A1 placement/final assessment.
- TEF practice engine.
- PWA install prompt and guaranteed offline course packs.
- CMS/editor application.
- Payments, subscriptions, entitlements, organizations, or classrooms.
- Social/community/gamification systems beyond a basic non-punitive streak if explicitly approved.
- Native mobile applications.
- SSR/framework migration.

Deferral protects the learning loop from being diluted. Interfaces should permit later work but no speculative implementation is required.

## 24. Decisions required before coding

Approve or revise these execution decisions:

1. `/` remains the current portal dashboard during the vertical-slice preview; `/learn` hosts V2.
2. Each increment is developed and reviewed independently rather than as one large rewrite.
3. IndexedDB guest state launches before accounts/cloud sync.
4. Unit 1 uses structured self-review for required speaking; it does not claim automated pronunciation grading.
5. Unit 2 and Unit 3 need their own production packets before pilot designation.
6. Generated runtime content bundles are either committed or built in CI; ADR decision occurs in Increment 3.
7. The pilot is invited/limited and not described publicly as complete A1.
8. No destructive migration may clear learner progress silently.

## 25. First coding task after approval

The first implementation task is **Increment 0 — Repository Safety Baseline**, not routing or database work.

Its completion produces:

- Automated smoke coverage for the current portal.
- A clean production-build baseline.
- Measured current behavior for desktop and mobile.
- Confidence that subsequent routing and architecture changes preserve what already works.

After that baseline is reviewed, Increment 1 introduces routes and the `/learn` preview without yet implementing the learning engine.
