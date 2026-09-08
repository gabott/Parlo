import type { ContentManifest, CourseSummary, LessonContent, LevelSummary, MediaContent, UnitBundle } from "../../domain/content";

export interface ContentRepository {
  getManifest(): Promise<ContentManifest>;
  getCourse(courseId: string): Promise<CourseSummary | undefined>;
  getLevel(levelId: string): Promise<LevelSummary | undefined>;
  getUnit(unitId: string): Promise<UnitBundle | undefined>;
  getLesson(lessonId: string): Promise<LessonContent | undefined>;
  getActivity(activityId: string): Promise<UnitBundle["activities"][number] | undefined>;
  getItems(itemIds: string[]): Promise<UnitBundle["items"]>;
  getConcept(conceptId: string): Promise<UnitBundle["concepts"][number] | undefined>;
  resolveMedia(mediaId: string): Promise<MediaContent | undefined>;
}
