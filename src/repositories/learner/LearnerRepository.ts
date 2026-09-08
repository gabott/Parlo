import type { Attempt, AttemptHistorySummary, DraftResponse, Enrollment, GuestProfile, LearnerExport, LessonProgress, LearningGoal, LearningSession } from "../../domain/learner";
export interface AttemptInput { enrollmentId: string; learnerId: string; sessionId: string; lessonId: string; activityId: string; itemId: string; response: string; correct: boolean; idempotencyKey: string }
export interface LearnerRepository {
  startA1(): Promise<{ profile: GuestProfile; enrollment: Enrollment; goal: LearningGoal }>;
  getActiveEnrollment(): Promise<Enrollment | undefined>;
  startSession(lessonId: string, entryPoint: LearningSession["entryPoint"]): Promise<LearningSession>;
  endSession(sessionId: string): Promise<void>;
  submitAttempt(input: AttemptInput): Promise<{ attempt: Attempt; progress: LessonProgress; duplicate: boolean }>;
  getLessonProgress(lessonId: string): Promise<LessonProgress | undefined>;
  saveLessonPosition(lessonId: string, currentStep: number): Promise<LessonProgress>;
  completeLesson(lessonId: string): Promise<LessonProgress>;
  getAttemptHistory(itemId: string): Promise<AttemptHistorySummary | undefined>;
  saveDraft(itemId: string, value: string): Promise<DraftResponse>;
  getDraft(itemId: string): Promise<DraftResponse | undefined>;
  clearDraft(itemId: string): Promise<void>;
  exportProgress(): Promise<LearnerExport>;
  deleteLocalProgress(): Promise<void>;
}
