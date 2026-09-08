import { useCallback, useEffect, useMemo, useState } from "react";
import type { Enrollment, LessonProgress } from "../../domain/learner";
import { IndexedDbLearnerRepository } from "../../infrastructure/indexeddb";

const repository = new IndexedDbLearnerRepository();

export function useGuestLearner(lessonId?: string) {
  const [enrollment, setEnrollment] = useState<Enrollment>();
  const [progress, setProgress] = useState<LessonProgress>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const refresh = useCallback(async () => {
    try {
      const nextEnrollment = await repository.getActiveEnrollment();
      setEnrollment(nextEnrollment);
      setProgress(lessonId ? await repository.getLessonProgress(lessonId) : undefined);
      setError(undefined);
    } catch { setError("Local progress storage is unavailable. You can continue this preview, but progress will not be saved."); }
    finally { setLoading(false); }
  }, [lessonId]);
  // IndexedDB is an external browser system; hydrate its persisted snapshot after mount.
  // oxlint-disable-next-line react/set-state-in-effect
  useEffect(() => { void refresh(); }, [refresh]);
  return useMemo(() => ({ repository, enrollment, progress, loading, error, refresh }), [enrollment, progress, loading, error, refresh]);
}
