# Parlo Learner State and Learning Engine Contract

**Status:** Product and domain contract for approval  
**Version:** 1.0  
**Scope:** A1 learner progress, attempts, mastery, memory, mistakes, assessments, daily planning, and recommendations  
**Related documents:** [A1 Product Specification](./PARLO_A1_SPEC.md) · [A1 Curriculum Matrix](./PARLO_A1_CURRICULUM_MATRIX.md) · [Content Schema](./PARLO_CONTENT_SCHEMA.md)

## 1. Purpose

This document defines what Parlo records about a learner and how the first deterministic learning engine turns those records into progress, review schedules, remediation, and an explainable daily plan.

It is implementation-neutral. It does not choose a database, authentication provider, framework, or deployment architecture.

The engine must answer three questions:

1. What has the learner encountered and completed?
2. What can the learner currently demonstrate, with what confidence?
3. What is the most useful next activity within the learner's available time?

## 2. Core design principles

1. **Learner state is private:** It is never stored in public curriculum content.
2. **Events are evidence:** Raw attempts remain traceable; derived mastery can be recalculated.
3. **Completion is not mastery:** Viewing or finishing screens does not prove retention.
4. **Mastery is uncertain:** Scores represent estimates supported by evidence, not absolute knowledge.
5. **Skills are distinct:** Reading success does not automatically prove listening or speaking ability.
6. **Delayed recall matters:** Later unsupported success is stronger evidence than immediate repetition.
7. **Recommendations are explainable:** Every scheduled activity has machine-readable reasons.
8. **Rules precede prediction:** A deterministic, configurable engine launches before any learned recommendation model.
9. **The learner retains control:** They may inspect, defer, skip, or choose another allowed activity.
10. **Historical truth is preserved:** Attempt interpretation uses the content and policy versions active at the time.

## 3. Domain boundary

```text
PUBLIC, VERSIONED CONTENT              PRIVATE LEARNER STATE
Lessons, concepts, items               Profile, attempts, recordings
Answers, rubrics, policies             Progress, mastery, mistakes
Content bundle versions                Plans, goals, assessment results
                  │                    │
                  └── LEARNING ENGINE ─┘
                      deterministic rules,
                      evidence aggregation,
                      scheduling and reasons
```

Content IDs connect the domains. Learner records must reference immutable content revisions or released bundles wherever historical scoring could otherwise change.

## 4. Identity and ownership

### 4.1 Learner identity

```yaml
learner_id: learner_01H...
account_id: account_01H... | null
profile_version: 1
created_at: ...
mode: guest | authenticated
```

Rules:

- Public content never uses a learner ID.
- Guest identifiers are installation-specific pseudonymous IDs.
- Account linking must migrate or merge guest state explicitly.
- Email, legal name, payment details, and authentication credentials belong to account systems, not the learning domain.
- A learner may have multiple course enrollments but one state owner.

### 4.2 Record ownership

Every private record includes:

```yaml
id: ...
learner_id: ...
created_at: ...
updated_at: ...
source_device_id: ...
sync_version: 1
deleted_at: null
```

Record IDs use sortable, globally unique opaque identifiers. Learner-state IDs must not expose email addresses, names, or sequential account counts.

## 5. Learner profile and preferences

```yaml
learner_id: learner_01H...
interface_locale: en
target_language: fr
preferred_french_variety: neutral | fr-FR | fr-CA
timezone: America/Los_Angeles
week_starts_on: monday
accessibility:
  reduced_motion: system | on | off
  captions_default: true
  transcript_default: hidden | shown
  color_independence_mode: true
  speech_activity_alternative: available
audio:
  learning_speed: learner
  auto_play: false
  default_volume: 1.0
privacy:
  product_analytics: opted_in | opted_out | unset
  ai_features: opted_in | opted_out | unset
  retain_voice_recordings: session | 30_days | until_deleted
```

Preferences influence presentation and planning but never lower learning standards invisibly. If a modality is inaccessible or unavailable, Parlo supplies an alternative and describes how that affects skill evidence.

## 6. Learning goal

```yaml
id: goal_01H...
learner_id: learner_01H...
course_id: course.fr-general
goal_type: general_french | future_tef | travel | work | personal
target_level: a1
long_term_target_level: b2 | null
target_date: 2027-06-01 | null
daily_minutes: 30
study_days: [monday, tuesday, wednesday, thursday, friday]
priority_skills: []
status: active | achieved | paused | replaced
```

Rules:

- A target date is optional.
- Pace estimates include uncertainty and are not guarantees.
- A future TEF goal may influence scenario selection but does not replace general A1 capability requirements.
- Only one active primary goal exists per course enrollment.

## 7. Course enrollment

```yaml
id: enrollment_01H...
learner_id: learner_01H...
course_id: course.fr-general
level_id: level.fr-general.a1
content_bundle_id: bundle.fr-general.a1.1.0.0
status: active | completed | paused | archived
started_at: ...
completed_at: null
entry_method: beginner | placement | manual | transferred
recommended_start_unit_id: unit.fr-general.a1.first-contact
selected_start_unit_id: unit.fr-general.a1.first-contact
```

The enrollment points to the learner's active content bundle. Bundle upgrades follow an explicit migration process and never reinterpret prior attempts silently.

## 8. Learning session

```yaml
id: session_01H...
learner_id: learner_01H...
enrollment_id: enrollment_01H...
plan_id: plan_01H... | null
started_at: ...
ended_at: null
entry_point: today_plan | course_map | review | search | deep_link
device_context:
  device_class: mobile | tablet | desktop
  offline: false
summary:
  active_seconds: 0
  activities_started: 0
  activities_completed: 0
  attempts: 0
  reviews_completed: 0
```

Session time excludes long inactivity where possible. Time is useful for workload estimation, not a mastery signal by itself.

## 9. Attempt event

An attempt is the immutable primary evidence that a learner responded to a scored or rubric-based item.

```yaml
id: attempt_01H...
learner_id: learner_01H...
enrollment_id: enrollment_01H...
session_id: session_01H...
activity_id: activity.a1.u01.l01.meaning
activity_revision: 2
item_id: item.a1.u01.l01.greeting-context.001
item_revision: 1
content_bundle_id: bundle.fr-general.a1.1.0.0
attempt_policy_version: attempt-policy.1.0.0
scoring_policy_id: scoring.exact.standard
scoring_policy_revision: 1
started_at: ...
submitted_at: ...
response:
  kind: option
  value: option.bonjour
evaluation:
  status: evaluated | pending_human | pending_ai | evaluation_failed
  outcome: correct | correct_with_note | partially_correct | incorrect | needs_review | null
  score: 1.0
  evaluator: deterministic | self | human | ai_assisted
  rubric_result_id: null
  feedback_code: greeting.daytime.correct
context:
  presentation_mode: learning | review | assessment
  evidence_mode: recognition
  response_time_ms: 5400
  hint_events: []
  audio_replay_count: 1
  immediate_repeat: false
  offline_created: false
sequence:
  attempt_number_for_item_in_session: 1
  prior_attempt_id: null
integrity:
  idempotency_key: ...
  client_event_id: ...
```

Rules:

- Submitted attempts are append-only. Corrections create an evaluation revision, never mutate the response.
- Draft/incomplete input is not an attempt until submitted, except where autosave is required for productive work.
- An answer reveal produces no positive mastery evidence.
- A retry links to its prior attempt.
- Pending productive evaluations do not count as passed until resolved.
- Record only timing detail needed for learning/product behavior; avoid invasive keystroke logging.

## 10. Attempt response types

Supported response envelopes:

```text
option           selected option IDs
text             learner-entered text
token_sequence   ordered token IDs
pairs            submitted matching pairs
structured       form fields or multi-part response
audio_recording  private media reference plus consent/retention metadata
rubric_self      learner-selected dimension ratings and reflection
no_response      explicit skip or timeout
```

Sensitive productive responses have additional rules:

- Voice recordings use private, access-controlled storage.
- Retention follows the learner's settings and assessment requirements.
- Transcripts are private learner data.
- Learners can delete practice recordings without deleting aggregate non-identifying progress evidence, unless they request full account deletion.
- Assessment evidence deletion may invalidate the associated assessment result and must be explained before confirmation.

## 11. Evaluation revisions

Deterministic results are normally immediate. Human or AI-assisted evaluations may arrive later or be corrected.

```yaml
id: evaluation_01H...
attempt_id: attempt_01H...
revision: 1
evaluator: deterministic | self | human | ai_assisted
evaluator_reference: policy-or-reviewer-id
model_version: null
prompt_policy_version: null
outcome: partially_correct
score: 0.65
error_observations: []
rubric_result_id: rubric_result_01H...
uncertainty: 0.20
created_at: ...
supersedes_evaluation_id: null
```

The current evaluation is the latest valid revision. Derived mastery and assessment results must be recalculable when an evaluation changes.

## 12. Activity and lesson progress

Progress is a materialized summary derived from events. It may be rebuilt.

### 12.1 Activity progress

```yaml
learner_id: ...
activity_id: ...
status: not_started | in_progress | completed | needs_retry
first_started_at: ...
last_interaction_at: ...
completed_at: null
required_items: 6
submitted_items: 4
latest_score: 0.75
best_valid_score: 0.83
attempt_count: 7
```

### 12.2 Lesson progress

```yaml
learner_id: ...
lesson_id: ...
status: locked | available | in_progress | completed | needs_remediation
started_at: ...
completed_at: null
last_position:
  activity_id: ...
  item_index: 2
exit_check:
  status: not_attempted | passed | failed | pending
  latest_score: null
  passed_at: null
completion_bundle_id: null
```

Rules:

- Lesson completion requires its published completion policy.
- Reopening a completed lesson does not remove completion.
- A lesson can be completed while associated concepts later need review.
- `last_position` is navigation convenience, not learning evidence.
- Required content changes may request a targeted migration activity without erasing historical completion.

## 13. Unit and level progress

```yaml
learner_id: ...
unit_id: ...
status: locked | available | in_progress | assessment_ready | completed | needs_review
required_lessons_completed: 4
required_lessons_total: 5
review_status: not_started | completed
capability_assessment_status: not_eligible | eligible | in_progress | passed | failed | pending
capability_result_id: null
completed_at: null
```

Level progress reports separate dimensions:

```yaml
course_completion_percent: 38
retained_core_percent: 31
capabilities_demonstrated: 3
capabilities_total: 12
skill_estimates: {}
reviews_due: 14
```

The UI must not collapse these into a single misleading percentage. “38% through A1” means course completion unless explicitly labeled otherwise.

## 14. Concept mastery state

```yaml
learner_id: ...
concept_id: concept.grammar.present.etre
state: new | learning | familiar | strong | mastered | needs_review
mastery_score: 0.68
confidence: 0.55
evidence_count: 12
independent_evidence_count: 5
transfer_evidence_count: 1
first_evidence_at: ...
last_evidence_at: ...
last_success_at: ...
last_failure_at: ...
next_review_at: ...
lapse_count: 1
skill_breakdown:
  grammar: { score: 0.72, confidence: 0.60 }
  writing: { score: 0.55, confidence: 0.35 }
engine_version: mastery-engine.1.0.0
updated_through_event_id: attempt_01H...
```

### 14.1 Initial score interpretation

Planning bands, subject to calibration:

- New: no valid evidence.
- Learning: score below 0.55 or insufficient independent evidence.
- Familiar: 0.55–0.74 with at least two valid encounters.
- Strong: 0.75–0.89 with delayed recall evidence.
- Mastered: at least 0.90, adequate confidence, delayed recall, and transfer evidence where required.
- Needs review: predicted retention or recent performance fell below the configured review threshold.

State assignment requires both score and evidence sufficiency. One lucky correct answer cannot create Mastered status.

## 15. Vocabulary and phrase memory state

Lexical memory needs sense and modality awareness.

```yaml
learner_id: ...
content_id: lexeme.bonjour.interjection
sense_id: sense.bonjour.greeting
state: learning
strength: 0.48
difficulty: 0.22
stability_days: 2.5
retrievability_estimate: 0.81
last_review_at: ...
next_review_at: ...
success_count: 3
lapse_count: 0
modality:
  french_to_meaning: { score: 0.80, evidence: 3 }
  meaning_to_french: { score: 0.45, evidence: 1 }
  audio_to_meaning: { score: 0.60, evidence: 2 }
  dictation: { score: null, evidence: 0 }
  spoken_use: { score: null, evidence: 0 }
engine_version: memory-engine.1.0.0
```

Rules:

- Different senses may have different memory states.
- Strong French-to-English recognition does not imply English-to-French recall.
- Review planning rotates relevant modalities.
- A word is not learner-facing “Mastered” until required course modalities meet their evidence floor.

## 16. Evidence processing

For each evaluated attempt, the engine:

1. Verifies idempotency and content/policy versions.
2. Rejects invalid or superseded evaluation evidence.
3. Reads activity-declared evidence mode and skill/concept weights.
4. Applies outcome value.
5. Applies evidence modifiers.
6. Updates concept and/or memory estimates.
7. Updates review due dates.
8. Creates, reinforces, or resolves mistake records.
9. Recalculates affected lesson, capability, skill, and plan summaries.
10. Stores reason codes for material decisions.

### 16.1 Initial evidence values

Configurable launch defaults:

| Evidence | Base weight |
|---|---:|
| Exposure | 0.00 |
| Supported recognition | 0.20 |
| Recognition | 0.40 |
| Supported recall | 0.55 |
| Recall | 0.80 |
| Transfer | 1.00 |

Outcome multipliers:

| Outcome | Multiplier |
|---|---:|
| Correct | 1.00 |
| Correct with note | 0.90 |
| Partially correct | 0.50 |
| Incorrect | negative evidence, magnitude policy-dependent |
| Needs review | no automatic mastery update |

Context modifiers may account for hints, answer reveals, immediate repetition, delay, and modality. Defaults live in versioned engine configuration rather than being hard-coded into content.

### 16.2 Guardrails

- Negative evidence reduces estimates but does not erase history.
- Very fast responses may be flagged as low-confidence only when guessing is plausible; speed never independently proves cheating.
- Repeating the same item immediately has diminishing evidence value.
- Similar item variants count as related, not fully independent evidence.
- Self-assessment contributes reflection data and limited evidence, never the sole basis for a high-stakes completion decision.
- AI-assisted scores carry uncertainty and may be excluded from final completion until validation requirements are met.

## 17. Spaced-review schedule

The first release uses a deterministic scheduler with configurable intervals. It must be replaceable without changing content or losing attempt history.

### 17.1 Review item

```yaml
id: review_item_01H...
learner_id: ...
content_id: lexeme.bonjour.interjection
concept_id: null
source: lesson | mistake | assessment | manual
state: queued | due | snoozed | completed | suspended
priority: 62
due_at: ...
last_review_at: ...
interval_days: 3
preferred_modalities: [meaning_to_french, audio_to_meaning]
reason_codes: [retention_due, productive_evidence_weak]
engine_version: review-engine.1.0.0
```

### 17.2 Initial interval ladder

Provisional intervals after successful independent recall:

```text
10 minutes → 1 day → 3 days → 7 days → 14 days → 30 days → 60 days
```

Rules:

- Supported success advances less or remains at the current stage.
- Incorrect recall moves the item to a short relearning step appropriate to its prior strength.
- A lapse after a long interval does not reset an established item to brand new.
- Same-session correction can close the immediate loop but does not cancel the future delayed review.
- Review sessions interleave items and avoid immediate identical repeats where possible.
- The daily queue is capped by available time and prioritizes overdue core items.
- Optional/manual items cannot crowd out required A1 core indefinitely.
- The scheduler avoids presenting an item's answer in an earlier same-session activity when it plans to test recall later, unless instruction requires it.

This ladder is a launch heuristic, not a claim of an optimal memory algorithm. Retention outcomes will determine later calibration.

## 18. Mistake lifecycle

### 18.1 Mistake record

```yaml
id: mistake_01H...
learner_id: ...
status: open | improving | resolved | dismissed
category: verb_form
concept_ids: [concept.grammar.present.habiter]
content_ids: []
first_attempt_id: attempt_01H...
latest_attempt_id: attempt_01J...
occurrence_count: 2
independent_occurrence_count: 2
learner_response_snapshot: Je suis habite au Canada.
target_response_snapshot: J'habite au Canada.
explanation_snapshot: Use habiter directly here; do not add être.
severity: minor | meaningful | blocking
next_review_at: ...
resolved_at: null
resolution_evidence_ids: []
```

### 18.2 Creation and grouping

- A meaningful incorrect or partially correct response may create a mistake.
- Typos may create a lightweight spelling mistake, depending on lesson objective.
- Repeated equivalent errors reinforce one mistake record instead of creating clutter.
- Different root causes remain separate even when surface text looks similar.
- AI-proposed error classifications are labeled and may remain uncertain.

### 18.3 Resolution

A mistake moves:

```text
open → improving → resolved
```

- Immediate corrected repetition can move Open to Improving.
- Resolution requires later independent success, preferably in a varied context.
- Recurrence reopens the existing record and increments lapse information.
- Dismissal is learner/editor control for misclassification and is not positive mastery evidence.

## 19. Skill estimate

```yaml
learner_id: ...
level_id: level.fr-general.a1
skill: listening
score: 0.61
confidence: 0.52
evidence_count: 28
recent_window_score: 0.58
last_evidence_at: ...
source_breakdown:
  lesson: 0.45
  review: 0.20
  unit_assessment: 0.25
  final_assessment: 0.10
engine_version: skill-engine.1.0.0
```

Rules:

- Skills aggregate relevant evidence but do not replace concept mastery.
- Assessment evidence normally carries more confidence than repeated practice on known items.
- Scores with low confidence are shown as “not enough evidence” or a broad range.
- A CEFR skill label is awarded only through defined capability/assessment policies, not inferred from a raw average alone.

## 20. Rubric result

```yaml
id: rubric_result_01H...
learner_id: ...
attempt_id: attempt_01H...
rubric_id: rubric.a1.speaking.guided
rubric_revision: 1
evaluator: self | human | ai_assisted
dimension_results:
  - dimension_id: task_completion
    score: 2
    evidence_note: Communicated name, city, and role.
  - dimension_id: comprehensibility
    score: 2
    evidence_note: Meaning was generally clear.
total_score: 2.1
uncertainty: 0.25
feedback_summary: ...
created_at: ...
```

Automated rubric results preserve model and policy version through their linked evaluation. Learners see dimension feedback, not only a numeric score.

## 21. Capability result

```yaml
id: capability_result_01H...
learner_id: ...
capability_id: capability.a1.first-contact
assessment_id: assessment.fr-general.a1.first-contact
assessment_form_id: assessment-form.a1.u01.a
attempt_ids: []
status: passed | failed | pending | invalidated
overall_score: 0.76
skill_results:
  listening: { score: 0.80, passed: true }
  speaking: { rubric_score: 2, passed: true }
requirements:
  overall_threshold_met: true
  skill_floors_met: true
  production_evidence_met: true
demonstrated_at: ...
expires_at: null
remediation_recommendation_ids: []
```

A later need for review does not erase a passed historical capability. The dashboard may separately indicate that related language needs refreshing.

## 22. Assessment attempt

```yaml
id: assessment_attempt_01H...
learner_id: ...
assessment_id: ...
form_id: ...
form_revision: 1
content_bundle_id: ...
status: not_started | in_progress | submitted | pending_evaluation | scored | invalidated
started_at: ...
submitted_at: null
section_states: []
attempt_ids: []
result_id: null
accommodations: []
integrity_flags: []
```

Rules:

- Interrupted assessment state is resumable according to its policy.
- Timers use server-authoritative time when online and tamper-aware elapsed time offline where practical.
- Accessibility accommodations are not treated as integrity violations.
- Practice feedback may be immediate; assessment answer/feedback release follows the assessment policy.
- Invalidated attempts remain auditable and do not update mastery unless a policy explicitly retains valid section evidence.

## 23. Placement result

```yaml
id: placement_result_01H...
learner_id: ...
assessment_attempt_id: ...
recommended_level_id: level.fr-general.a1
recommended_unit_id: unit.fr-general.a1.personal-info
confidence: 0.54
skill_observations: {}
known_concept_ids: []
uncertain_concept_ids: []
recommendations: []
```

Placement recommends rather than locks. Skipped foundational content receives lightweight verification through future warm retrieval.

## 24. Daily plan

### 24.1 Plan record

```yaml
id: plan_01H...
learner_id: ...
enrollment_id: ...
local_date: 2026-09-06
timezone: America/Los_Angeles
available_minutes: 30
status: generated | started | completed | superseded
engine_version: planning-engine.1.0.0
input_snapshot:
  due_core_reviews: 14
  overdue_reviews: 3
  current_lesson_id: ...
  open_mistakes: 5
  recent_skill_imbalance: listening
items: []
generated_at: ...
```

### 24.2 Plan item

```yaml
id: plan_item_01H...
kind: warmup | review | lesson | listening | speaking | remediation | assessment | reflection
target_id: activity-or-lesson-id
estimated_minutes: 8
priority: 84
required_for_plan_completion: true
reason_codes:
  - overdue_core_review
explanation: { en: Review 12 expressions that are due today. }
status: planned | in_progress | completed | skipped | deferred
```

Plans are generated artifacts, not permanent curriculum. Regeneration supersedes the old unstarted plan while preserving history.

## 25. Deterministic planning algorithm

### 25.1 Inputs

- Available minutes and study-day preference.
- In-progress activity or lesson.
- Required overdue/due reviews.
- Open high-priority mistakes.
- Current unit and prerequisite readiness.
- Recent skill distribution.
- Pending productive evaluations.
- Assessment eligibility/readiness.
- Accessibility, connectivity, microphone, and audio availability.
- Recent workload and learner deferrals.

### 25.2 Candidate generation

Generate candidates in these categories:

1. Resume unfinished short work.
2. Due required reviews.
3. Mistake remediation.
4. Next required lesson.
5. Under-practiced skill activity linked to current content.
6. Eligible unit assessment.
7. Optional enrichment.

### 25.3 Priority score

The launch engine uses configurable weighted rules, for example:

```text
priority =
  overdue urgency
  + core-content importance
  + prerequisite importance
  + recent-error severity
  + predicted forgetting risk
  + skill-balance need
  + continuity bonus
  + assessment-readiness bonus
  - excessive repetition penalty
  - recent-deferral sensitivity
  - time-fit penalty
  - unavailable-modality penalty
```

Every contribution emits a reason code. Exact weights are versioned configuration and require product/pedagogical approval.

### 25.4 Plan construction

1. Reserve a small warm-up when the plan is long enough.
2. Allocate review time, capped to avoid consuming the entire session except for severe backlog.
3. Include at most one primary new lesson in a typical 15–45 minute plan.
4. Add a complementary productive or receptive skill where time permits.
5. Prefer complete activity boundaries; do not knowingly start a long assessment without enough time.
6. Finish with an exit check/reflection when applicable.
7. Keep total estimated duration within the available-time tolerance.

### 25.5 Time budgets

- Under 10 minutes: review or resume one small activity.
- 10–20 minutes: review plus one short lesson/activity.
- 20–45 minutes: review, one primary lesson, one complementary activity.
- Over 45 minutes: add a break boundary and a second practice block; avoid excessive new material.

## 26. Recommendation record and explainability

```yaml
id: recommendation_01H...
learner_id: ...
kind: review | remediation | next_lesson | skill_balance | assessment_ready
target_id: ...
priority: 84
reason_codes:
  - concept_recent_failures
  - prerequisite_for_current_lesson
evidence_refs:
  - mistake_01H...
  - concept_mastery_state_reference
learner_explanation:
  en: Review avoir because two recent errors are affecting your age and past-event sentences.
engine_version: recommendation-engine.1.0.0
created_at: ...
expires_at: ...
```

Required reason-code families:

- `retention_due`
- `overdue_core_review`
- `recent_failure`
- `repeated_mistake`
- `weak_prerequisite`
- `prerequisite_for_current_lesson`
- `productive_evidence_weak`
- `listening_evidence_weak`
- `skill_imbalance`
- `resume_in_progress`
- `next_curriculum_step`
- `assessment_ready`
- `learner_requested`
- `time_fit`

Learner-facing explanations are generated from reviewed templates initially. AI may later rephrase them but cannot invent unsupported diagnoses.

## 27. Course availability and prerequisites

Availability rules:

- Unit 1 is available to a beginner immediately.
- The next unit becomes available when the preceding unit's required lessons are complete; assessment readiness remains separate.
- Preview access may expose learning content without marking it as the recommended path.
- Placement may make later units available while scheduling verification of skipped prerequisites.
- A weak prerequisite creates a remediation recommendation, not an indefinite hard lock.
- A unit assessment becomes eligible when its required lessons and integrated review are complete.

Rule decisions produce an availability explanation so the interface can say what remains and why.

## 28. Streaks and motivational state

```yaml
learner_id: ...
current_streak_days: 6
longest_streak_days: 14
last_qualifying_local_date: 2026-09-06
timezone: America/Los_Angeles
streak_policy_version: streak.1.0.0
```

Qualifying activity requires meaningful learning effort, such as completing a scored activity or a minimum active session—not merely opening the app.

Streak rules must:

- Use the learner's timezone.
- Handle timezone changes explicitly.
- Avoid shame or punitive language.
- Remain secondary to retention and capability progress.
- Never reduce mastery when broken.

XP, badges, leagues, and social comparison are outside the A1 foundation.

## 29. Offline operation and synchronization

The learner may complete downloaded deterministic lessons offline.

Requirements:

- Each local event has a globally unique ID and idempotency key.
- Events retain client creation time and later server receipt time.
- The server deduplicates events before processing.
- Attempts are append-only, so most synchronization is additive.
- Progress/mastery summaries are recomputed server-side after synchronization when accounts exist.
- Last-position conflicts use latest valid interaction time and do not affect mastery.
- Content bundle mismatch is detected before starting an offline assessment.
- AI/human evaluation-dependent work is clearly queued until online.
- Recording upload failures do not discard the local file without learner notice.

### 29.1 Conflict principles

- Never discard a valid attempt because another device advanced further.
- Do not use last-write-wins for mastery.
- Merge events, then derive summaries.
- Preference conflicts may use latest explicit change with an audit record.
- Deletion tombstones synchronize before old devices may restore deleted private data.

## 30. Event processing and recalculation

Recommended logical flow:

```text
Attempt submitted
  → validate/idempotency check
  → score or queue evaluation
  → append evaluation
  → update activity/lesson progress
  → update concept and memory evidence
  → update mistake lifecycle
  → update review queue
  → update skill/capability summaries
  → invalidate/regenerate affected recommendations
  → emit learner-visible feedback
```

Derived-state processors record:

- Engine version.
- Last processed event.
- Recalculation timestamp.
- Input content/policy version.

If an engine bug is fixed, summaries can be replayed from valid events without changing the original attempts.

## 31. Privacy, retention, export, and deletion

### 31.1 Data classes

- **Account data:** managed outside this learning contract.
- **Learning records:** attempts, progress, mastery, mistakes, and plans.
- **Sensitive learner content:** recordings, transcripts, writing, and AI conversations.
- **Optional analytics:** product events not required for learning state.

### 31.2 Minimum controls

- Export learning records in a documented portable format.
- Delete individual practice recordings and conversations.
- Delete the full learner account/state.
- Explain when deleting assessment evidence invalidates a result.
- Apply configured retention to raw recordings.
- Keep derived data only when policy and consent allow it.
- Never use learner content for public curriculum examples without explicit separate consent.
- Do not place raw learner responses in general application logs.

### 31.3 AI boundary

- Send only context required for the specific feedback task.
- Identify provider/model and retention implications in product policy.
- Record consent state and applicable policy version.
- Provide non-AI alternatives for required A1 completion.
- Treat inferred pronunciation, level, and weakness labels as educational estimates.

## 32. Observability and audit

Operational logs may record IDs, timing, status, and error codes but should avoid raw private responses.

Audit-sensitive actions include:

- Human rubric evaluation and revision.
- Assessment invalidation.
- Content-bundle migration.
- Manual mastery adjustment, if supported.
- Data export/deletion request.
- Reviewer access to private recordings or writing.

Learners should see meaningful history such as completed lessons and assessment results without being exposed to internal debugging data.

## 33. Engine configuration and versioning

Each derived decision references a versioned engine configuration:

```yaml
id: planning-engine.1.0.0
effective_at: ...
status: active | retired
weights: {}
thresholds: {}
reason_template_version: reasons.en.1.0.0
approved_by: ...
notes: ...
```

Changing a threshold does not silently rewrite historical assessment results. Changes may recalculate current mastery/recommendations if the migration explicitly permits it.

## 34. Validation invariants

### Identity and references

- Every learner record has exactly one learner owner.
- Referenced enrollment, session, content, item revision, and bundle exist.
- A session and enrollment belong to the same learner.
- Attempt content belongs to the enrollment's course/bundle or an approved migrated bundle.

### Attempts and evaluations

- Idempotency keys are unique within their scope.
- Submission time is not before start time, allowing documented clock-skew tolerance.
- Deterministic outcomes have a score compatible with the scoring policy.
- Only valid latest evaluations feed derived state.
- Answer reveals cannot produce positive recall evidence.

### Progress

- Completed lessons satisfy the recorded completion-policy revision.
- Unit completion requires the required capability result.
- Historical completion cannot predate its supporting events.
- Percentages remain between 0 and 100 and declare what they measure.

### Mastery and review

- Scores, confidence, strength, and retrievability remain in `[0,1]`.
- Review items reference reviewable published/retired-for-history content.
- Suspended items do not enter daily plans.
- Mastered requires configured evidence sufficiency.
- Derived state identifies its engine version and processing checkpoint.

### Plans

- Plan items have valid available targets.
- Total estimates stay within configured budget tolerance.
- Every item has at least one reason code.
- Required audio/recording activities have an accessible/available alternative when the modality cannot be used.

### Privacy

- Public content IDs never embed learner information.
- Raw audio/text responses do not appear in general analytics payloads.
- Deleted private assets cannot remain reachable through active references.

## 35. Acceptance scenarios

The first implementation must pass these domain-level scenarios.

### Scenario A — Beginner completes a lesson

1. Learner begins Unit 1 Lesson 1.
2. Exposure creates no mastery credit.
3. Recognition and recall attempts are stored once.
4. Passing the exit check completes the lesson.
5. Learned vocabulary enters spaced review.
6. Dashboard recommends the next curriculum step.

### Scenario B — Incorrect answer and remediation

1. Learner writes `Je suis habite au Canada`.
2. Deterministic or reviewed evaluation classifies a verb-form error.
3. A mistake record opens with the correction and explanation.
4. A short supported retry moves it to Improving.
5. A later varied independent success resolves it.

### Scenario C — Recognition without production

1. Learner repeatedly recognizes `avoir` forms correctly.
2. Grammar recognition rises.
3. Productive evidence remains weak.
4. Parlo does not call the concept Mastered.
5. The plan recommends a typed or spoken recall activity with that explanation.

### Scenario D — Broken streak

1. Learner misses two days.
2. Streak resets according to policy.
3. Mastery and course completion do not decrease solely because of the streak.
4. Due reviews reflect memory scheduling, not punishment.

### Scenario E — Offline duplicate sync

1. A completed offline attempt is retried by network synchronization.
2. Idempotency identifies the duplicate.
3. Only one attempt contributes evidence.
4. Server-derived progress and mastery remain consistent.

### Scenario F — Content update

1. Learner attempted item revision 1 under bundle 1.0.0.
2. Revision 2 corrects or changes the item.
3. Historical scoring stays attached to revision 1.
4. Current sessions use the migrated bundle.
5. Meaningfully invalid old evidence is adjusted only through an auditable migration.

### Scenario G — Pending speaking review

1. Learner submits a required speaking task.
2. Lesson/assessment shows Pending rather than Passed.
3. The recording follows private retention rules.
4. The completed evaluation supplies rubric dimensions and uncertainty.
5. Derived progress updates exactly once.

### Scenario H — Thirty-minute daily plan

1. Learner has three overdue core reviews, one open repeated mistake, and a next lesson.
2. Engine prioritizes a bounded review block.
3. It adds the next lesson and a complementary skill activity if time fits.
4. Every plan item explains why it appears.
5. Estimated total remains within tolerance of 30 minutes.

## 36. Decisions required before implementation

1. Will the first vertical slice use guest/local persistence, authenticated persistence, or both?
2. What is the authoritative event processor when the same account works offline on multiple devices?
3. Which raw learner responses are retained, and for how long, after evaluation?
4. Which speaking/writing tasks in the foundation require evaluation to complete, and which permit structured self-review?
5. What confidence/evidence floors qualify Familiar, Strong, and Mastered for each content type?
6. What daily review-time cap balances retention with forward progress?
7. When should the learner be allowed to test out of a lesson/unit, and how is skipped knowledge verified later?
8. Which analytics are strictly necessary versus optional consent-based product analytics?
9. How will content-bundle migrations be tested against real learner-state fixtures?

## 37. Next artifacts

The remaining pre-code artifacts should be produced in this order:

1. **Unit 1 Production Packet:** Finished lesson scripts, lexical inventory, concepts, dialogues, activities, feedback, answer specifications, media manifest, and capability assessment for the first unit.
2. **V2 Implementation Architecture:** Routing, module boundaries, persistence decision, authentication, event processing, content build/validation, testing, migration, observability, and deployment.
3. **Units 1–3 Vertical-Slice Plan:** Small implementation increments and acceptance tests that exercise the complete loop from content to attempts, mastery, review, mistakes, Today plan, and assessment.

The Unit 1 packet should come before architecture approval so technical choices are tested against real authored content rather than hypothetical entity diagrams alone.
