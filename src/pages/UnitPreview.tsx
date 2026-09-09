import { useEffect, useState } from "react";
import type { UnitBundle } from "../domain/content";
import { Card, Feedback, Link } from "../design-system";
import { contentRepository } from "../repositories/content";

export default function UnitPreview() {
  const [bundle, setBundle] = useState<UnitBundle>();
  useEffect(() => { void contentRepository.getUnit("unit.fr-general.a1.first-contact").then(setBundle); }, []);
  if (!bundle) return <p role="status">Loading Unit 1…</p>;
  const orderedLessons = bundle.unit.ordered_lesson_ids.map((id) => bundle.lessons.find((lesson) => lesson.id === id)).filter((lesson): lesson is NonNullable<typeof lesson> => Boolean(lesson));
  return <div className="unit-preview">
    <Link to="/learn/a1">← Back to A1</Link>
    <p className="learn-preview-kicker">A1 · Unit 1 · Draft</p>
    <h1>{bundle.unit.title.en}</h1>
    <Feedback title="Lessons 1–2 available" tone="info">Greetings and farewells and Names and alphabet are available as complete beta lessons. The remaining lessons are still outlines.</Feedback>
    <ol className="lesson-outline">
      {orderedLessons.map((lesson) => <li key={lesson.id}>
        <Card title={lesson.title.en}>
          <p>{lesson.objective.en}</p>
          <span className="tag">{lesson.matrix_id}</span> <span className="tag">{lesson.estimated_minutes} min</span> <span className="tag">{lesson.status.replace("_", " ")}</span>
          {lesson.matrix_id === "A1-U01-L01" && <div className="lesson-outline__action"><Link to="/learn/a1/unit/first-contact/lesson/greetings">Start complete lesson</Link></div>}
          {lesson.matrix_id === "A1-U01-L02" && <div className="lesson-outline__action"><Link to="/learn/a1/unit/first-contact/lesson/names-alphabet">Start complete lesson</Link></div>}
        </Card>
      </li>)}
    </ol>
    <p className="content-provenance">Compiled from bundle <code>{bundle.bundle_version}</code> · {bundle.phrases.length} initial phrases · {bundle.items.length} initial items</p>
  </div>;
}
