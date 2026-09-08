import type { TextScoringPolicy } from "./types";

const punctuation = /[.!?]+$/u;
export function normalizeFrench(value: string, policy: TextScoringPolicy = { accents: "required", punctuation: "optional" }) {
  let normalized = value.normalize("NFC").replace(/[’‘]/gu, "'").replace(/\s+/gu, " ").replace(/\s*'\s*/gu, "'").trim().toLocaleLowerCase("fr");
  if (policy.punctuation !== "required") normalized = normalized.replace(punctuation, "").trim();
  if (policy.accents === "forgiving") normalized = normalized.normalize("NFD").replace(/\p{M}/gu, "").normalize("NFC");
  return normalized;
}
