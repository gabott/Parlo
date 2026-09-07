import { describe, expect, it } from "vitest";
import { FixedClock, SequenceRandom, failure, localize, stableId, success } from "../../../src/domain/shared";

describe("shared domain foundations", () => {
  it("accepts stable IDs and rejects mutable display-style values", () => {
    expect(stableId<"lesson">("lesson.fr-general.a1.greetings")).toBe("lesson.fr-general.a1.greetings");
    expect(() => stableId<"lesson">("Lesson A1 Greetings")).toThrow("Invalid stable ID");
  });

  it("falls back to English localization", () => {
    expect(localize({ en: "Hello" }, "fr")).toBe("Hello");
    expect(localize({ en: "Hello", fr: "Bonjour" }, "fr")).toBe("Bonjour");
  });

  it("provides deterministic time and random sources", () => {
    const clock = new FixedClock(new Date("2026-09-07T12:00:00Z"));
    clock.advance(60_000);
    expect(clock.now().toISOString()).toBe("2026-09-07T12:01:00.000Z");

    const random = new SequenceRandom([0.25, 0.75]);
    expect([random.next(), random.next(), random.next()]).toEqual([0.25, 0.75, 0.25]);
  });

  it("represents success and failure without throwing", () => {
    expect(success("saved")).toEqual({ ok: true, value: "saved" });
    expect(failure("offline")).toEqual({ ok: false, error: "offline" });
  });
});
