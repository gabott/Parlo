export interface GuestProfile { learnerId: string; mode: "guest"; createdAt: string; interfaceLocale: "en"; targetLanguage: "fr" }
export interface Enrollment { id: string; learnerId: string; courseId: string; levelId: string; status: "active"; startedAt: string; selectedStartUnitId: string }
export interface LearningGoal { id: string; learnerId: string; enrollmentId: string; goalType: "general_french" | "future_tef" | "travel" | "work" | "personal"; targetLevel: "a1"; dailyMinutes: number; studyDays: string[]; status: "active" }
export interface LearningSession { id: string; learnerId: string; enrollmentId: string; lessonId: string; entryPoint: "course_map" | "deep_link"; startedAt: string; endedAt: string | null }
export interface Attempt { id: string; learnerId: string; enrollmentId: string; sessionId: string; activityId: string; itemId: string; response: string; submittedAt: string; idempotencyKey: string }
export interface Evaluation { id: string; attemptId: string; revision: 1; evaluator: "deterministic"; outcome: "correct" | "incorrect"; score: 0 | 1; createdAt: string }
export interface DraftResponse { id: string; learnerId: string; itemId: string; value: string; updatedAt: string }
export interface LessonProgress { lessonId: string; learnerId: string; status: "in_progress" | "completed"; attemptCount: number; correctCount: number; updatedAt: string; recalculationRequired: boolean }
export interface LearnerExport { format: "parlo-guest-progress"; version: 1; exportedAt: string; profile?: GuestProfile; goals: LearningGoal[]; enrollments: Enrollment[]; sessions: LearningSession[]; attempts: Attempt[]; evaluations: Evaluation[]; lessonProgress: LessonProgress[] }
