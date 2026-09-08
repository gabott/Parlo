import { describe, expect, it } from "vitest";
import { normalizeFrench, scoreFrenchText } from "../../../src/domain/attempts";

describe("French response scoring", () => {
  it("normalizes Unicode, curly apostrophes, whitespace, and optional punctuation", () => {
    expect(normalizeFrench("  J’ habite   à Montréal ! ", { accents: "required", punctuation: "optional" })).toBe("j'habite à montréal");
  });
  it("changes missing-accent behavior according to the objective", () => {
    expect(scoreFrenchText("A bientot", ["À bientôt !"], { accents: "required", punctuation: "optional" }).outcome).toBe("incorrect");
    expect(scoreFrenchText("A bientot", ["À bientôt !"], { accents: "forgiving", punctuation: "optional" }).outcome).toBe("correct");
  });
  it("routes unsupported long free text to review", () => {
    expect(scoreFrenchText("une réponse libre beaucoup trop longue pour cette activité simple de niveau débutant", ["Bonjour"], { accents: "required" }).outcome).toBe("needs_review");
  });
});
