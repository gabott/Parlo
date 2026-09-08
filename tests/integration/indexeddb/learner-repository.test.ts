// @vitest-environment node
import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { IndexedDbLearnerRepository } from "../../../src/infrastructure/indexeddb/IndexedDbLearnerRepository";

const repository = () => new IndexedDbLearnerRepository(`parlo-test-${crypto.randomUUID()}`);

describe("IndexedDB learner repository", () => {
  it("creates one guest and enrollment and restores it", async () => {
    const repo = repository(); const first = await repo.startA1(); const second = await repo.startA1();
    expect(second).toEqual(first); expect(await repo.getActiveEnrollment()).toEqual(first.enrollment);
  });
  it("stores an attempt and projection atomically and deduplicates retries", async () => {
    const repo = repository(); const { profile, enrollment } = await repo.startA1();
    const input = { learnerId: profile.learnerId, enrollmentId: enrollment.id, sessionId: "session.test", lessonId: "lesson.greetings", activityId: "activity.meaning", itemId: "item.one", response: "Bonjour", correct: true, idempotencyKey: "submission-one" };
    const first = await repo.submitAttempt(input); const duplicate = await repo.submitAttempt(input);
    expect(first.progress).toMatchObject({ attemptCount: 1, correctCount: 1 }); expect(duplicate.duplicate).toBe(true);
    expect((await repo.exportProgress()).attempts).toHaveLength(1);
  });
  it("exports documented data and deletes local progress", async () => {
    const repo = repository(); await repo.startA1(); const exported = await repo.exportProgress();
    expect(exported).toMatchObject({ format: "parlo-guest-progress", version: 1 });
    expect(JSON.stringify(exported)).not.toMatch(/password|credential|indexedDB/i);
    await repo.deleteLocalProgress(); expect(await repo.getActiveEnrollment()).toBeUndefined();
  });
});
