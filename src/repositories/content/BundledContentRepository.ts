import manifestJson from "../../../generated/content-manifest.json";
import type { ContentManifest, CourseSummary, LevelSummary, UnitBundle } from "../../domain/content";
import type { ContentRepository } from "./ContentRepository";

const manifest = manifestJson as ContentManifest;

export class BundledContentRepository implements ContentRepository {
  private bundlePromise?: Promise<UnitBundle>;
  private loadBundle(): Promise<UnitBundle> {
    this.bundlePromise ??= import("../../../generated/bundles/a1-0.1.0-draft.json").then((module) => module.default as unknown as UnitBundle);
    return this.bundlePromise;
  }
  async getManifest(): Promise<ContentManifest> { return manifest; }
  async getCourse(courseId: string): Promise<CourseSummary | undefined> { return manifest.courses.find(({ id }) => id === courseId); }
  async getLevel(levelId: string): Promise<LevelSummary | undefined> { return manifest.courses.flatMap(({ levels }) => levels).find(({ id }) => id === levelId); }
  async getUnit(unitId: string): Promise<UnitBundle | undefined> {
    const summary = manifest.courses.flatMap(({ levels }) => levels).flatMap(({ units }) => units).find(({ id }) => id === unitId);
    if (!summary) return undefined;
    const bundle = await this.loadBundle();
    return bundle.unit.id === unitId ? bundle : undefined;
  }
  async getLesson(lessonId: string) { return (await this.loadBundle()).lessons.find(({ id }) => id === lessonId); }
  async getActivity(activityId: string) { return (await this.loadBundle()).activities.find(({ id }) => id === activityId); }
  async getItems(itemIds: string[]) { const wanted = new Set(itemIds); return (await this.loadBundle()).items.filter(({ id }) => wanted.has(id)); }
  async getConcept(conceptId: string) { return (await this.loadBundle()).concepts.find(({ id }) => id === conceptId); }
  async resolveMedia(mediaId: string) { return (await this.loadBundle()).media.find(({ id }) => id === mediaId); }
}

export const contentRepository: ContentRepository = new BundledContentRepository();
