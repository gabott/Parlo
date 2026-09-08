import { normalizeFrench } from "./normalization";
import type { ScoredResponse, TextScoringPolicy } from "./types";

export function scoreChoice(response: string, answer: string): ScoredResponse {
  const correct = response === answer;
  return { outcome: correct ? "correct" : "incorrect", score: correct ? 1 : 0, matchedAnswer: correct ? answer : undefined };
}

export function scoreFrenchText(response: string, answers: readonly string[], policy: TextScoringPolicy): ScoredResponse {
  const normalizedResponse = normalizeFrench(response, policy);
  const matchedAnswer = answers.find(answer => normalizeFrench(answer, policy) === normalizedResponse);
  if (matchedAnswer) return { outcome: "correct", score: 1, normalizedResponse, matchedAnswer };
  if (!normalizedResponse || normalizedResponse.split(" ").length > 12) return { outcome: "needs_review", score: 0, normalizedResponse };
  return { outcome: "incorrect", score: 0, normalizedResponse };
}
