# Parlo Content Schema Specification

**Status:** Content contract for approval  
**Version:** 1.0  
**Applies to:** Parlo A1 and reusable foundations for later CEFR levels  
**Related documents:** [A1 Product Specification](./PARLO_A1_SPEC.md) · [A1 Curriculum Matrix](./PARLO_A1_CURRICULUM_MATRIX.md)

## 1. Purpose

This document defines how Parlo learning content is represented independently from React components, learner progress, and presentation layout. It is an implementation-neutral contract. TypeScript types, database tables, JSON files, CMS models, and API payloads may implement this contract, but none is selected here.

The schema must support:

- A course path from level to unit to lesson to activity.
- Stable content references across edits and releases.
- Four-skill instruction and assessment.
- Vocabulary, grammar, pronunciation, dialogues, and readings.
- Deterministic scoring and useful feedback.
- Spaced review and concept mastery evidence.
- Multiple French varieties and interface languages.
- Human review, source provenance, retirement, and migration.
- AI-assisted content that remains distinguishable and reviewable.
- Accessibility alternatives and media transcripts.

## 2. Separation of concerns

Three domains must remain separate:

```text
CONTENT                            LEARNER STATE
Course, lessons, items             Attempts, progress, mastery
Versioned and publishable          Private and learner-specific
          │                                  │
          └────────── RUNTIME ───────────────┘
                 sequencing, scoring,
                 review, recommendations
```

Content defines what can be taught and what an answer means. Learner state records what an individual did. Runtime logic combines the two. Published content must never contain learner names, responses, scores, or private conversation history.

## 3. Conventions

### 3.1 Field notation

- `string`, `number`, and `boolean` have their conventional meanings.
- `Id<T>` is a stable ID referencing entity type `T`.
- `LocalizedText` is text keyed by interface locale.
- `FrenchText` is French learning content with variety metadata where required.
- `T[]` is a list of zero or more values; minimum counts are stated separately.
- Fields marked **required** must be present in draft and published content unless explicitly limited to publication.
- Fields marked **publish-required** may be incomplete in a draft but block publication.

### 3.2 ID format

IDs are lowercase ASCII, immutable, and globally unique within their entity namespace.

```text
course.fr-general
level.fr-general.a1
unit.fr-general.a1.first-contact
lesson.fr-general.a1.first-contact.greetings
concept.grammar.present.etre
lexeme.bonjour.interjection
phrase.classroom.repeat-formal
dialogue.a1.first-contact.001
activity.a1.u01.l01.context
item.a1.u01.l01.greeting-context.001
assessment.a1.u01.capability
rubric.a1.speaking.general
media.audio.phrase.repeat-formal.fr-fr.normal.v1
source.cefr-companion-volume.2020
```

Rules:

- IDs do not contain display titles, mutable ordering numbers, accents, spaces, or personal names.
- Moving content to a different lesson does not change its intrinsic entity ID.
- An item cloned and meaningfully changed receives a new ID.
- Alternate assessment forms have distinct form IDs but may share a blueprint ID.
- Database-generated numeric IDs may exist internally but must not replace public stable IDs.

### 3.3 Dates and versions

- Timestamps use ISO 8601 UTC.
- Schema versions use semantic versioning.
- Content revisions are positive integers on each stable entity.
- Released bundles use immutable semantic versions such as `a1-1.0.0`.

## 4. Shared metadata

Every independently versioned content entity includes:

```yaml
id: Id<Entity>                       # required
revision: 1                          # required
status: draft | in_review | published | retired
created_at: 2026-09-06T20:00:00Z
updated_at: 2026-09-06T20:00:00Z
created_by: contributor-id
review:
  linguistic: pending | approved | rejected | not_required
  pedagogical: pending | approved | rejected | not_required
  accessibility: pending | approved | rejected | not_required
  last_reviewed_at: null
  reviewers: []
provenance:
  origin: original | adapted | imported | ai_assisted
  source_ids: []
  generation_record_id: null
rights:
  owner: Parlo
  license: proprietary
  attribution: null
tags: []
```

Publication requires the review states appropriate for the entity. `ai_assisted` describes process, not quality; it never bypasses review.

## 5. Localization and French variety

### 5.1 Localized interface text

```yaml
title:
  en: Greetings and farewells
  fr: Salutations et formules de départ
```

- English is the required launch support locale.
- French interface text may be added progressively but must not be confused with learner target-language content.
- Fallback order is explicit in application configuration, not inferred per component.

### 5.2 French learning text

```yaml
text: Bonne journée !
language: fr
variety: neutral | fr-FR | fr-CA | mixed
register: informal | neutral | formal
orthography_notes: []
```

- `neutral` means suitable across supported varieties, not accent-free.
- A variety-specific alternative links to the common meaning/concept rather than silently replacing it.
- Regional variation is labeled with factual usage notes.

## 6. Taxonomies and controlled values

### 6.1 CEFR levels

`pre-a1`, `a1`, `a2`, `b1`, `b2`, `c1`, `c2`

### 6.2 Skills

`listening`, `speaking`, `reading`, `writing`, `vocabulary`, `grammar`, `pronunciation`, `interaction`

### 6.3 Evidence modes

`exposure`, `recognition_supported`, `recognition`, `recall_supported`, `recall`, `transfer`

### 6.4 Content roles

`required`, `remedial`, `review`, `assessment`, `enrichment`, `reference`

### 6.5 Difficulty

An integer from 1–5 within a CEFR level. Difficulty is relative to the course position and is not a substitute for CEFR level.

### 6.6 Error categories

```text
meaning
word_choice
article
gender
number_agreement
adjective_agreement
verb_form
auxiliary
negation
question_form
word_order
preposition
pronoun
spelling
accent_mark
punctuation
listening_discrimination
pronunciation_segment
pronunciation_prosody
register
task_completion
other_reviewed
```

## 7. Course hierarchy

### 7.1 Course

```yaml
id: course.fr-general
revision: 1
status: published
title: { en: General French, fr: Français général }
description: { en: A practical French course, fr: Un cours de français pratique }
target_language: fr
support_locales: [en]
available_varieties: [neutral, fr-FR, fr-CA]
default_variety: neutral
level_ids: [level.fr-general.a1]
```

Validation:

- Every referenced level exists and points back to the course.
- Level order is explicit and contains no duplicates.

### 7.2 Level

```yaml
id: level.fr-general.a1
course_id: course.fr-general
cefr: a1
title: { en: Beginner A1, fr: Débutant A1 }
description: { en: ... }
entry_requirements: []
completion_policy_id: policy.completion.fr-general.a1
final_assessment_id: assessment.fr-general.a1.final
ordered_unit_ids: []
capability_ids: []
```

### 7.3 Unit

```yaml
id: unit.fr-general.a1.first-contact
level_id: level.fr-general.a1
matrix_id: A1-U01
title: { en: French sounds and first contact }
description: { en: ... }
capability_ids: [capability.a1.first-contact]
prerequisite_unit_ids: []
ordered_lesson_ids: []
review_lesson_id: lesson.fr-general.a1.first-contact.review
assessment_id: assessment.fr-general.a1.first-contact
estimated_minutes: 120
icon_key: first-contact
content_role: required
```

Validation:

- Exactly one required integrated review and capability assessment for A1 units.
- Every unit capability has assessment evidence.
- Required lesson ordering cannot contain dependency cycles.

### 7.4 Lesson

```yaml
id: lesson.fr-general.a1.first-contact.greetings
unit_id: unit.fr-general.a1.first-contact
matrix_id: A1-U01-L01
title: { en: Greetings and farewells }
objective_ids: [objective.a1.first-contact.greetings]
prerequisite_lesson_ids: []
concept_ids: []
introduced_lexeme_ids: []
reviewed_content_ids: []
ordered_activity_ids: []
exit_check_activity_id: activity.a1.u01.l01.exit
estimated_minutes: 15
difficulty: 1
content_role: required
completion_policy:
  kind: exit_check
  minimum_score: 0.70
  minimum_evidence: recall
  retry_policy_id: policy.retry.lesson.standard
```

Publication validation:

- At least one objective.
- At least one contextual presentation activity.
- At least one practice activity.
- Exactly one exit check for a required core lesson.
- Exit check measures every required objective.
- New content load remains within configured course limits or has approved justification.
- Activity sequence has no broken references.

## 8. Objectives and capabilities

### 8.1 Learning objective

```yaml
id: objective.a1.first-contact.greetings
cefr: a1
learner_text: { en: I can choose and use an appropriate greeting or farewell. }
observable_behaviors:
  - choose an appropriate greeting for time and relationship
  - produce a greeting and farewell without a model
skill_ids: [listening, speaking, vocabulary, pronunciation]
concept_ids: [concept.pragmatics.greeting-register]
minimum_evidence: recall
```

Objectives use observable verbs. “Understand greetings” alone is invalid because it does not identify measurable behavior.

### 8.2 Capability

```yaml
id: capability.a1.first-contact
cefr: a1
statement: { en: I can recognize key French sounds, greet someone, and use basic classroom survival expressions. }
objective_ids: []
assessment_id: assessment.fr-general.a1.first-contact
minimum_result: 0.70
```

Capabilities summarize real-world ability and may span multiple lessons. A capability is demonstrated only by its assessment policy, not by averaging lesson completion.

## 9. Concepts and dependency graph

```yaml
id: concept.grammar.present.etre
kind: grammar
cefr: a1
title: { en: Present tense of être }
summary: { en: Use être to identify and describe people and things. }
prerequisites:
  - concept_id: concept.grammar.subject-pronouns
    relationship: required
    rationale: { en: Conjugated forms map to subject pronouns. }
related_concept_ids: [concept.grammar.identification.cest]
common_error_codes: [verb_form]
remediation_lesson_ids: []
```

Concept kinds:

- `grammar`
- `vocabulary_domain`
- `communicative_function`
- `pronunciation`
- `orthography`
- `culture_usage`
- `strategy`

Dependency validation rejects self-references and cycles among `required` prerequisite edges. `helpful` edges may form a network but do not block progression.

## 10. Lexical content

### 10.1 Lexeme

A lexeme represents a word or stable multiword lexical unit. Display forms and senses are modeled explicitly.

```yaml
id: lexeme.bonjour.interjection
lemma: bonjour
language: fr
part_of_speech: interjection
cefr: a1
frequency_band: core
forms:
  - form: bonjour
    form_type: lemma
    variety: neutral
senses:
  - id: sense.bonjour.greeting
    gloss: { en: hello; good morning }
    definition: { en: A neutral or polite greeting used during the day. }
    register: neutral
    domains: [greetings]
    concept_ids: [concept.pragmatics.greeting-register]
gender: null
countability: null
plural_form: null
example_ids: [example.bonjour.madame]
collocation_ids: []
contrast_ids: [lexeme.bonsoir.interjection, lexeme.salut.interjection]
common_errors: []
audio_ids: [media.audio.lexeme.bonjour.fr-fr.normal.v1]
```

Allowed part-of-speech values initially include `noun`, `verb`, `adjective`, `adverb`, `pronoun`, `determiner`, `preposition`, `conjunction`, `interjection`, `number`, and `phrase`.

Rules:

- Nouns require gender and their principal learner form includes the article.
- Count nouns require a plural or an explicit irregular/invariable note.
- Verbs require an infinitive lemma and may reference a conjugation paradigm.
- Polysemous words use separate senses, not slash-separated translations without explanation.
- Homographs with different parts of speech use separate lexeme IDs.

### 10.2 Phrase/chunk

```yaml
id: phrase.classroom.repeat-formal
french:
  text: Pouvez-vous répéter, s'il vous plaît ?
  language: fr
  variety: neutral
  register: formal
meaning: { en: Can you repeat, please? }
function: request_repetition
cefr: a1
slot_schema: null
concept_ids:
  - concept.strategy.request-repetition
example_ids: []
audio_ids: []
```

A productive pattern may declare slots:

```yaml
slot_schema:
  template: J'habite à {city}.
  slots:
    city:
      accepts: lexeme_set.cities.a1
      agreement_rules: []
```

### 10.3 Example

```yaml
id: example.bonjour.madame
french: { text: Bonjour, madame., language: fr, variety: neutral, register: formal }
translation: { en: Hello, ma'am. }
concept_ids: [concept.pragmatics.greeting-register]
lexeme_ids: [lexeme.bonjour.interjection]
notes: { en: Use this during the day in a polite interaction. }
audio_ids: []
```

## 11. Grammar content

```yaml
id: grammar-note.a1.present.etre.intro
concept_id: concept.grammar.present.etre
cefr: a1
title: { en: Saying who someone is }
explanation_blocks:
  - kind: principle
    text: { en: French changes the form of être to match the subject. }
  - kind: paradigm
    paradigm_id: paradigm.verb.etre.present
  - kind: caution
    text: { en: Use j' before a vowel sound, but the form here is je suis. }
example_ids: []
common_errors:
  - error_code: verb_form
    incorrect: Je es étudiant.
    correction: Je suis étudiant.
    explanation: { en: The form used with je is suis. }
```

Grammar explanations are structured blocks rather than newline-formatted strings. Supported initial block kinds:

`principle`, `example`, `contrast`, `paradigm`, `usage_note`, `caution`, `regional_note`, `memory_tip`

### Conjugation paradigm

```yaml
id: paradigm.verb.etre.present
lemma_lexeme_id: lexeme.etre.verb
tense: present
mood: indicative
forms:
  je: suis
  tu: es
  il_elle_on: est
  nous: sommes
  vous: êtes
  ils_elles: sont
audio_ids: []
```

## 12. Dialogues and readings

### 12.1 Dialogue

```yaml
id: dialogue.a1.first-contact.001
cefr: a1
title: { en: Meeting before class }
setting: { en: Two adult learners meet before their first French class. }
variety: neutral
speaker_ids: [speaker.camille, speaker.alex]
turns:
  - id: turn.001
    speaker_id: speaker.camille
    french: { text: Bonjour !, language: fr, variety: neutral, register: neutral }
    translation: { en: Hello! }
    audio_segment_id: media.audio.dialogue.first-contact.001.turn.001
    concept_ids: [concept.pragmatics.greeting-register]
    lexeme_ids: [lexeme.bonjour.interjection]
full_audio_id: media.audio.dialogue.first-contact.001.full
transcript_available: true
estimated_seconds: 20
```

### 12.2 Reading

```yaml
id: reading.a1.registration.001
cefr: a1
text_type: form | message | notice | menu | schedule | profile | short_narrative
title: { en: Class registration }
body_blocks: []
word_count: 45
concept_ids: []
lexeme_ids: []
accessibility_description: null
source_ids: []
```

Authentic or adapted external text requires rights and source records. “Authentic-like” original material must not be labeled as an authentic external document.

## 13. Pronunciation targets

```yaml
id: pronunciation.a1.u-vs-ou
concept_id: concept.pronunciation.u-vs-ou
cefr: a1
title: { en: French u and ou }
description: { en: Distinguish and attempt the two vowel sounds in familiar words. }
phoneme_targets: [y, u]
grapheme_patterns: [u, ou]
articulation_guidance: { en: ... }
example_pair_ids: []
audio_ids: []
assessment_policy:
  recognition_required: true
  production_required: true
  native_likeness_required: false
```

Pronunciation content stores IPA where useful internally, but learner-facing use must be optional and explained.

## 14. Media and speakers

### 14.1 Media asset

```yaml
id: media.audio.lexeme.bonjour.fr-fr.normal.v1
kind: audio
purpose: model_pronunciation
uri: /audio/...
mime_type: audio/mpeg
duration_ms: 820
language: fr
variety: fr-FR
speed: slow | learner | natural
speaker_id: speaker.denise-synthetic
transcript: Bonjour
transcript_entity_id: lexeme.bonjour.interjection
generation:
  method: synthetic | human_recorded | imported
  provider: microsoft-edge-tts
  model_or_voice: fr-FR-DeniseNeural
  generated_at: ...
quality_review:
  status: approved
  reviewer: ...
  notes: null
rights: ...
checksum: sha256:...
byte_size: 12345
```

Images and video use the same base with appropriate accessibility, caption, poster, dimension, and rights fields.

### 14.2 Speaker

```yaml
id: speaker.denise-synthetic
display_name: Denise
kind: synthetic
variety: fr-FR
voice_characteristics: [adult, feminine]
provider_reference: fr-FR-DeniseNeural
rights: ...
```

Speaker characteristics describe voices for variety and dialogue casting; they must not be used to make sensitive personal inferences.

## 15. Activity definition

An activity defines sequencing, instructions, attempts, scoring policy, and contained items.

```yaml
id: activity.a1.u01.l01.greeting-context
lesson_id: lesson.fr-general.a1.first-contact.greetings
kind: meaning_select
content_role: required
title: { en: Choose the appropriate greeting }
instructions: { en: Select the best expression for each situation. }
item_ids: []
selection:
  mode: fixed | random_pool | adaptive_pool
  count: 4
  randomize_items: true
attempt_policy:
  max_attempts: null
  allow_skip: true
  allow_retry: true
  reveal_policy: after_response
scoring_policy_id: scoring.exact.standard
mastery_policy_id: evidence.recognition.standard
accessibility:
  announced_instructions: null
  alternative_activity_id: null
```

Initial activity kinds:

```text
presentation
meaning_select
audio_text_select
text_audio_select
fill_blank
sentence_build
typed_recall
dictation
matching
form_select
reading_comprehension
listening_comprehension
guided_writing
guided_speaking
structured_roleplay
mixed_review
```

New activity kinds require schema documentation, accessibility behavior, scoring rules, attempt-event requirements, and mastery-evidence review before use.

## 16. Shared activity item envelope

Every scored item uses a common envelope plus a type-specific payload.

```yaml
id: item.a1.u01.l01.greeting-context.001
revision: 1
status: published
activity_kind: meaning_select
cefr: a1
difficulty: 1
prompt: { en: It is 9:00 a.m. You greet your teacher. }
stimulus_refs: []
skill_ids: [vocabulary, interaction]
concept_ids: [concept.pragmatics.greeting-register]
lexeme_ids: [lexeme.bonjour.interjection]
evidence_mode: recognition
estimated_seconds: 15
payload: {}
feedback: {}
analytics_tags: [unit-1, greeting, formal]
```

Publication requires a valid payload, deterministic scoring or an approved rubric, and feedback appropriate to likely errors.

## 17. Objective activity payloads

### 17.1 Selection

```yaml
payload:
  options:
    - id: option.bonjour
      content: { type: french_text, value: Bonjour. }
    - id: option.bonsoir
      content: { type: french_text, value: Bonsoir. }
    - id: option.aurevoir
      content: { type: french_text, value: Au revoir. }
  correct_option_ids: [option.bonjour]
  randomize_options: true
feedback:
  correct: { en: Yes. Bonjour is the neutral daytime greeting. }
  by_option:
    option.bonsoir: { en: Bonsoir is normally used in the evening. }
    option.aurevoir: { en: Au revoir is used when leaving. }
```

Distractors must be plausible and diagnostically useful. Tricks unrelated to the objective are invalid.

### 17.2 Fill in the blank

```yaml
payload:
  segments:
    - { type: text, value: Je }
    - { type: blank, id: blank.1 }
    - { type: text, value: étudiant. }
  response_mode: type | option
  blanks:
    blank.1:
      answer_spec_id: answer.etre.je.suis
```

### 17.3 Sentence builder

```yaml
payload:
  tokens:
    - { id: token.1, text: Je }
    - { id: token.2, text: m'appelle }
    - { id: token.3, text: Léa }
    - { id: token.4, text: . }
  accepted_sequences:
    - [token.1, token.2, token.3, token.4]
  distractor_tokens: []
  punctuation_behavior: explicit
```

Tokens preserve French contractions. `J'` and `habite` must not be represented as two learner-visible tokens when the required written result is `J'habite`.

### 17.4 Typed recall and dictation

```yaml
payload:
  answer_spec_id: answer.phrase.je-habite-montreal
  input_language: fr
  audio_id: null          # required for dictation
  replay_policy: unlimited_learning
```

### 17.5 Matching

```yaml
payload:
  pairs:
    - id: pair.1
      left: { type: french_text, value: bonjour }
      right: { type: localized_text, value: { en: hello } }
  distractor_pool_ids: []
```

## 18. Productive and comprehension payloads

### 18.1 Reading/listening comprehension

```yaml
payload:
  source_entity_id: dialogue.a1.first-contact.001
  presentation:
    transcript: hidden_until_answer
    audio_replays: unlimited_learning
  question_item_ids: []
```

Assessment presentation policies may restrict replay, but learning activities should use support strategically rather than punish replay.

### 18.2 Guided writing

```yaml
payload:
  prompt: { en: Write a short introduction with your name, city, and role. }
  constraints:
    minimum_words: 15
    maximum_words: 40
    required_function_ids: []
  support:
    phrase_ids: []
    planning_prompts: []
  rubric_id: rubric.a1.writing.guided
  evaluation_mode: self | deterministic_assist | human | ai_assisted
  model_response_ids: []
```

### 18.3 Guided speaking

```yaml
payload:
  prompt: { en: Introduce yourself in three or four sentences. }
  preparation_seconds: null
  target_duration_seconds: 30
  maximum_recording_seconds: 90
  support:
    phrase_ids: []
    model_audio_ids: []
  rubric_id: rubric.a1.speaking.guided
  evaluation_mode: self | human | ai_assisted
  allow_rerecord: true
```

### 18.4 Structured role-play

```yaml
payload:
  scenario_id: scenario.a1.introduction.classmates
  learner_role: new_student
  partner_role: classmate
  turn_ids: []
  completion_conditions: []
  fallback_mode: deterministic_branching
  rubric_id: rubric.a1.interaction.basic
```

The deterministic scenario is the canonical learning content. An AI mode may vary partner responses within declared constraints.

## 19. Answer specification and normalization

Exact raw string comparison is insufficient for French. An answer specification declares accepted variants and which differences matter to the objective.

```yaml
id: answer.phrase.je-habite-montreal
language: fr
canonical: J'habite à Montréal.
accepted:
  - text: J'habite à Montréal.
    label: canonical
normalization:
  unicode: NFC
  trim_outer_whitespace: true
  collapse_internal_whitespace: true
  normalize_apostrophes: true
  case_sensitive: false
  punctuation: ignore_terminal
  diacritics: required
tolerances:
  - kind: missing_terminal_punctuation
    result: correct_with_note
error_rules:
  - pattern: Je suis habite à Montréal
    category: verb_form
    feedback: { en: Use habiter directly: J'habite. Do not add être. }
```

Possible evaluation outcomes:

- `correct`
- `correct_with_note`
- `partially_correct`
- `incorrect`
- `needs_review`

Rules:

- Apostrophe typography (`'` versus `’`) is normalized.
- Unicode is normalized before comparison.
- French diacritics are required when spelling is part of the objective; a missing accent may receive `correct_with_note` in an activity measuring another skill.
- Meaningfully different word order or grammar is never normalized away.
- Accepted alternatives are explicit and reviewed.
- Fuzzy matching may suggest a likely typo but cannot silently mark an unknown answer correct.
- Assessment scoring uses the policy frozen with that assessment form.

## 20. Feedback model

```yaml
feedback:
  correct: { en: Correct. }
  explanation: { en: ... }
  incorrect_default: { en: Not quite. ... }
  by_error_category:
    adjective_agreement: { en: The adjective must agree with the feminine noun. }
  examples: []
  remediation:
    concept_ids: []
    lesson_ids: []
  immediate_retry:
    enabled: true
    item_id: null
```

Feedback must not reveal unrelated future assessment content. A correction should target the highest-value error rather than overwhelm an A1 learner with every possible nuance.

## 21. Scoring and mastery evidence

### 21.1 Scoring policy

```yaml
id: scoring.exact.standard
kind: deterministic
outcome_points:
  correct: 1.0
  correct_with_note: 0.9
  partially_correct: 0.5
  incorrect: 0.0
  needs_review: null
hint_penalties:
  reveal_answer: 1.0
  reveal_letter: 0.15
minimum_score: null
```

### 21.2 Mastery evidence policy

```yaml
id: evidence.recall.standard
evidence_mode: recall
base_weight: 1.0
skill_weights:
  vocabulary: 1.0
concept_weights: {}
modifiers:
  used_hint: 0.6
  immediate_repeat: 0.5
  delayed_attempt: 1.1
  transfer_context: 1.2
eligible_for_review_schedule: true
```

Content declares evidence intent. Runtime learner-model logic calculates mastery and must remain configurable. An activity view or exposure never produces recall evidence.

## 22. Rubrics

```yaml
id: rubric.a1.speaking.guided
cefr: a1
scale:
  minimum: 0
  maximum: 3
dimensions:
  - id: task_completion
    weight: 0.30
    descriptors:
      0: { en: Does not provide the requested information. }
      1: { en: Provides fragments with substantial support. }
      2: { en: Communicates the required basic information. }
      3: { en: Completes the task clearly with limited support. }
  - id: comprehensibility
    weight: 0.30
    descriptors: {}
  - id: practiced_language
    weight: 0.20
    descriptors: {}
  - id: intelligibility_interaction
    weight: 0.20
    descriptors: {}
passing:
  total_minimum: 2.0
  dimension_floors:
    task_completion: 2
    comprehensibility: 2
```

Weights sum to 1. Rubrics store all descriptors for every score. Automated evaluation saves dimension-level evidence and uncertainty, not only a total.

## 23. Assessments and forms

### 23.1 Assessment blueprint

```yaml
id: assessment.fr-general.a1.first-contact
kind: unit_capability
level_id: level.fr-general.a1
unit_id: unit.fr-general.a1.first-contact
capability_ids: [capability.a1.first-contact]
form_ids: [assessment-form.a1.u01.a]
selection_policy: rotate_available
passing_policy:
  overall_minimum: 0.70
  required_skill_floors: {}
  productive_rubric_minimum: 2
remediation_map: []
```

### 23.2 Assessment form

```yaml
id: assessment-form.a1.u01.a
assessment_id: assessment.fr-general.a1.first-contact
revision: 1
status: published
sections:
  - id: listening
    ordered_activity_ids: []
    time_limit_seconds: null
    audio_policy: defined_per_item
security:
  expose_answers_after_attempt: true
  reusable_attempt_delay_hours: 24
content_snapshot_bundle: a1-1.0.0
```

Published attempts reference an immutable form revision and content bundle so later edits do not reinterpret historical results.

## 24. Source and generation records

### 24.1 Source

```yaml
id: source.cefr-companion-volume.2020
kind: framework | corpus | dictionary | textbook | article | website | expert_review | other
title: Common European Framework of Reference for Languages: Companion Volume
publisher: Council of Europe
publication_date: 2020
url: ...
accessed_at: ...
rights_notes: ...
citation: ...
```

### 24.2 AI generation record

```yaml
id: generation.2026-09-06.unit1-draft.001
provider: ...
model: ...
generated_at: ...
purpose: draft_activity_items
prompt_policy_version: ...
input_source_ids: []
private_input_used: false
review_status: pending
```

Prompts containing private learner data are not stored in public content records. Imported ChatGPT material must be de-identified before becoming a draft source.

## 25. Content bundles and release manifests

```yaml
id: bundle.fr-general.a1.1.0.0
schema_version: 1.0.0
content_version: 1.0.0
course_id: course.fr-general
level_ids: [level.fr-general.a1]
entity_revisions:
  lesson.fr-general.a1.first-contact.greetings: 3
  item.a1.u01.l01.greeting-context.001: 2
media_checksums: {}
released_at: ...
release_notes: { en: Initial complete A1 release. }
migrations: []
```

Bundles are immutable. A hotfix creates a new patch release. Clients may cache bundles and verify media checksums.

## 26. Retirement and migration

- Published IDs are never silently reused.
- Minor wording fixes increment the entity revision.
- A semantic change to what an item measures normally creates a new item ID.
- Retired content remains resolvable for historical attempts but is excluded from new sessions.
- Replacement relationships are explicit.
- If a concept splits or merges, a migration declares how learner evidence is retained, discounted, or marked uncertain.
- Historical scores remain attached to the content snapshot used at attempt time.

Example:

```yaml
migration:
  id: migration.concept.question-forms.split.001
  from_ids: [concept.grammar.questions.basic]
  to_ids: [concept.grammar.questions.intonation, concept.grammar.questions.est-ce-que]
  learner_evidence_policy: retain_as_uncertain_shared_evidence
```

## 27. Validation rules

Validation runs in layers.

### 27.1 Structural validation

- Required fields, types, enums, IDs, and revision values are valid.
- References resolve to allowed entity types.
- Ordered lists contain no duplicates.
- Localized text contains required launch locales.
- No unknown fields unless the schema explicitly permits extensions.

### 27.2 Referential validation

- Course, level, unit, lesson, and activity relationships are reciprocal where required.
- Required prerequisite graph has no cycles.
- Every required objective maps to exit and assessment evidence.
- Every lexeme/example media reference matches its transcript version.
- Retired entities are not assigned to new published lessons.

### 27.3 Pedagogical validation

- Required lessons contain context, practice, recall, feedback, and exit evidence.
- Activity evidence mode matches its interaction; recognition is not mislabeled recall.
- Distractors are unique and do not create multiple correct options.
- Explanations do not assume untaught required concepts without marking them as enrichment.
- New lexical and grammar load stays within approved limits.
- Unit assessments include productive evidence and all required skill coverage.

### 27.4 Language validation

- French text uses normalized Unicode and reviewed typography.
- Canonical answers and accepted alternatives are grammatical for the intended meaning/variety.
- Nouns have required gender/article metadata.
- Inflections and agreements are consistent.
- Translations match the intended sense and register.
- Audio transcript matches the written target.

### 27.5 Accessibility validation

- Images conveying information have alternatives.
- Audio/video learning material has transcripts; video has captions where applicable.
- Activities requiring drag, color, sound, or recording declare an accessible alternative.
- Instructions do not depend solely on visual position or color.

### 27.6 Publication gates

No entity may publish when:

- A required review is pending/rejected.
- A source/right is unresolved.
- Required media is absent or failed review.
- An answer is ambiguous.
- It contains personal learner data.
- It depends on unavailable draft/retired content.

## 28. Complete illustrative lesson manifest

This compact example shows how Unit 1 Lesson 1 composes existing entities. It omits shared metadata already defined above.

```yaml
lesson:
  id: lesson.fr-general.a1.first-contact.greetings
  unit_id: unit.fr-general.a1.first-contact
  matrix_id: A1-U01-L01
  title: { en: Greetings and farewells }
  objective_ids:
    - objective.a1.first-contact.greetings
  prerequisite_lesson_ids: []
  concept_ids:
    - concept.pragmatics.greeting-register
  introduced_lexeme_ids:
    - lexeme.bonjour.interjection
    - lexeme.bonsoir.interjection
    - lexeme.salut.interjection
    - lexeme.au-revoir.phrase
    - lexeme.a-bientot.phrase
  ordered_activity_ids:
    - activity.a1.u01.l01.warm-context
    - activity.a1.u01.l01.notice
    - activity.a1.u01.l01.meaning
    - activity.a1.u01.l01.audio
    - activity.a1.u01.l01.builder
    - activity.a1.u01.l01.speaking
    - activity.a1.u01.l01.exit
  exit_check_activity_id: activity.a1.u01.l01.exit
  estimated_minutes: 15
  difficulty: 1
  content_role: required
  completion_policy:
    kind: exit_check
    minimum_score: 0.70
    minimum_evidence: recall
    retry_policy_id: policy.retry.lesson.standard

activities:
  - id: activity.a1.u01.l01.warm-context
    kind: presentation
    instructions: { en: Listen to two people meeting during the day. }
    item_ids: [item.a1.u01.l01.dialogue.001]
    mastery_policy_id: evidence.exposure.none

  - id: activity.a1.u01.l01.meaning
    kind: meaning_select
    instructions: { en: Choose the best expression for each situation. }
    item_ids:
      - item.a1.u01.l01.greeting-context.001
      - item.a1.u01.l01.greeting-context.002
    scoring_policy_id: scoring.exact.standard
    mastery_policy_id: evidence.recognition.standard

  - id: activity.a1.u01.l01.audio
    kind: audio_text_select
    instructions: { en: Listen and select what you hear. }
    item_ids: []
    scoring_policy_id: scoring.exact.standard
    mastery_policy_id: evidence.listening-recognition.standard

  - id: activity.a1.u01.l01.builder
    kind: sentence_build
    instructions: { en: Build the appropriate expression. }
    item_ids: []
    scoring_policy_id: scoring.exact.standard
    mastery_policy_id: evidence.recall-supported.standard

  - id: activity.a1.u01.l01.speaking
    kind: guided_speaking
    instructions: { en: Record a daytime greeting and farewell. }
    item_ids: []
    scoring_policy_id: scoring.self-review.a1-speaking
    mastery_policy_id: evidence.speaking-recall.standard

  - id: activity.a1.u01.l01.exit
    kind: mixed_review
    instructions: { en: Show what you can do without the examples. }
    item_ids: []
    scoring_policy_id: scoring.lesson-exit.standard
    mastery_policy_id: evidence.recall.standard
```

## 29. Items deliberately excluded from the content schema

These belong to learner state or runtime configuration:

- Current lesson position.
- Scores, streaks, XP, and completion.
- Individual mastery and review due dates.
- Learner mistakes and recordings.
- Recommendation output.
- Feature flags and experiments.
- Subscription status.
- Authentication identifiers.
- Private AI conversation history.

The content schema may reference scoring/mastery policies, but it never stores an individual's calculated result.

## 30. Decisions required before implementation

1. Choose the authoring source of truth: versioned repository content, a CMS, or a hybrid publishing pipeline.
2. Choose the serialization format used by authors and the generated runtime format.
3. Decide whether every entity is independently stored or lesson packages embed selected child entities during authoring.
4. Confirm required launch interface locales and primary audio variety.
5. Select the validation technology only after the implementation language and content workflow are approved.
6. Decide how human reviewers authenticate and sign review records.
7. Define rights/licensing policy for external examples, images, recordings, and adapted authentic texts.
8. Approve the initial answer-normalization behavior, especially accent handling by activity objective.

## 31. Next artifact

The next specification is the **Learner State and Learning Engine Contract**. It should define attempts, progress, concept mastery, vocabulary memory, mistake lifecycle, spaced-review scheduling, session plans, capability results, and explainable recommendation inputs/outputs.

After that contract is approved, the remaining pre-code artifacts are the Unit 1 production packet and the V2 implementation architecture. Together, these documents provide enough information to build a narrow Units 1–3 vertical slice without inventing product behavior during coding.
