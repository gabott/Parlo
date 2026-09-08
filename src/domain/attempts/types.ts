export type ActivityKind = "presentation" | "meaning_select" | "audio_text_select" | "text_audio_select" | "matching" | "sentence_build" | "typed_recall" | "dictation" | "guided_speaking";
export type EvaluationOutcome = "correct" | "incorrect" | "needs_review";
export interface ResponseEnvelope { activityId: string; itemId: string; kind: ActivityKind; response: string | string[] | Record<string, string>; submittedAt: string }
export interface ScoredResponse { outcome: EvaluationOutcome; score: number; normalizedResponse?: string; matchedAnswer?: string }
export interface TextScoringPolicy { accents: "required" | "forgiving"; punctuation?: "required" | "optional" }
