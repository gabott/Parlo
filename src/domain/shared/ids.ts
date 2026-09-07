declare const idBrand: unique symbol;

export type StableId<TNamespace extends string> = string & {
  readonly [idBrand]: TNamespace;
};

const STABLE_ID_PATTERN = /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/;

export function stableId<TNamespace extends string>(value: string): StableId<TNamespace> {
  if (!STABLE_ID_PATTERN.test(value)) {
    throw new Error(`Invalid stable ID: ${value}`);
  }

  return value as StableId<TNamespace>;
}

export type CourseId = StableId<"course">;
export type LevelId = StableId<"level">;
export type UnitId = StableId<"unit">;
export type LessonId = StableId<"lesson">;
export type ActivityId = StableId<"activity">;
export type ConceptId = StableId<"concept">;
export type LearnerId = StableId<"learner">;
