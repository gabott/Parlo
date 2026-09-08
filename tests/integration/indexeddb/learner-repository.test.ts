// @vitest-environment node
import "fake-indexeddb/auto";
import { describe, expect, it } from "vitest";
import { IndexedDbLearnerRepository, LEARNER_DB_VERSION, migrateLearnerDatabase } from "../../../src/infrastructure/indexeddb/IndexedDbLearnerRepository";

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
  it("preserves an attempt and marks progress for recalculation when projection fails", async () => {
    const repo = new IndexedDbLearnerRepository(`parlo-test-${crypto.randomUUID()}`, () => { throw new Error("projection failed"); });
    const { profile, enrollment } = await repo.startA1();
    const result = await repo.submitAttempt({ learnerId: profile.learnerId, enrollmentId: enrollment.id, sessionId: "session.test", lessonId: "lesson.greetings", activityId: "activity.meaning", itemId: "item.one", response: "Bonjour", correct: true, idempotencyKey: "projection-failure" });
    expect(result.progress.recalculationRequired).toBe(true);
    expect((await repo.exportProgress()).attempts).toHaveLength(1);
  });
  it("returns private revisit history without answer or correctness details", async () => {
    const repo = repository(); const { profile, enrollment } = await repo.startA1();
    await repo.submitAttempt({ learnerId: profile.learnerId, enrollmentId: enrollment.id, sessionId: "session.test", lessonId: "lesson.greetings", activityId: "activity.meaning", itemId: "item.one", response: "Bonsoir", correct: false, idempotencyKey: "history-one" });
    expect(await repo.getAttemptHistory("item.one")).toMatchObject({ itemId: "item.one", attemptCount: 1 });
    expect(JSON.stringify(await repo.getAttemptHistory("item.one"))).not.toMatch(/Bonsoir|incorrect|correct/);
  });
  it("opens a version 1 fixture without losing its attempts", async () => {
    const name = `parlo-fixture-${crypto.randomUUID()}`;
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open(name, LEARNER_DB_VERSION);
      request.onupgradeneeded = () => {
        migrateLearnerDatabase(request.result, request.transaction);
        request.transaction?.objectStore("attempts").add({ id: "attempt.fixture", learnerId: "learner.fixture", enrollmentId: "enrollment.fixture", sessionId: "session.fixture", activityId: "activity.fixture", itemId: "item.fixture", response: "Bonjour", submittedAt: "2026-01-01T00:00:00.000Z", idempotencyKey: "fixture-key" });
      };
      request.onerror = () => reject(request.error);
      request.onsuccess = () => { request.result.close(); resolve(); };
    });
    const exported = await new IndexedDbLearnerRepository(name).exportProgress();
    expect(exported.attempts).toHaveLength(1);
    expect(exported.attempts[0].id).toBe("attempt.fixture");
  });
  it("exports documented data and deletes local progress", async () => {
    const repo = repository(); await repo.startA1(); const exported = await repo.exportProgress();
    expect(exported).toMatchObject({ format: "parlo-guest-progress", version: 1 });
    expect(JSON.stringify(exported)).not.toMatch(/password|credential|indexedDB/i);
    await repo.deleteLocalProgress(); expect(await repo.getActiveEnrollment()).toBeUndefined();
  });
});
