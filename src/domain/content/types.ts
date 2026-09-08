import type { LocalizedText } from "../shared";

export type ContentStatus = "draft" | "in_review" | "published" | "retired";
export type ContentRole = "required" | "remedial" | "review" | "assessment" | "enrichment" | "reference";

export interface UnitSummary {
  id: string;
  slug: string;
  title: LocalizedText;
  description: LocalizedText;
  capability: LocalizedText;
  estimated_minutes: number;
  bundle_version: string;
  bundle_checksum: string;
  bundle_path: string;
}

export interface LevelSummary {
  id: string;
  cefr: string;
  title: LocalizedText;
  description: LocalizedText;
  units: UnitSummary[];
}

export interface CourseSummary {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  levels: LevelSummary[];
}

export interface ContentManifest {
  schema_version: string;
  checksum: string;
  courses: CourseSummary[];
}

export interface LessonContent {
  id: string;
  matrix_id: string;
  title: LocalizedText;
  objective: LocalizedText;
  status: ContentStatus;
  content_role: ContentRole;
  estimated_minutes: number;
  ordered_activity_ids: string[];
}

export interface UnitBundle {
  schema_version: string;
  bundle_version: string;
  checksum: string;
  unit: { id: string; title: LocalizedText; description: LocalizedText; capability: LocalizedText; status: ContentStatus; ordered_lesson_ids: string[]; estimated_minutes: number };
  lessons: LessonContent[];
  concepts: Array<{ id: string; status: ContentStatus }>;
  lexemes: Array<{ id: string; lemma: string; status: ContentStatus }>;
  phrases: Array<{ id: string; status: ContentStatus; french: { text: string }; meaning: LocalizedText }>;
  activities: Array<{ id: string; status: ContentStatus; title: LocalizedText; instructions: LocalizedText; body?: LocalizedText; media_ids?: string[]; item_ids: string[] }>;
  items: Array<{ id: string; status: ContentStatus; prompt: LocalizedText; payload: { options?: Array<{ text: string; correct: boolean }> } }>;
  media: MediaContent[];
}

export interface MediaContent { id: string; status: ContentStatus; kind: "audio" | "image" | "video"; uri: string; accessibility_description?: string | null; transcript?: string | null }
