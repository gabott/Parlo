import { useEffect, useState } from "react";
import type { LevelSummary } from "../domain/content";
import { Card, Feedback, Link } from "../design-system";
import { contentRepository } from "../repositories/content";

export default function CoursePreview() {
  const [level, setLevel] = useState<LevelSummary>();
  useEffect(() => { void contentRepository.getLevel("level.fr-general.a1").then(setLevel); }, []);
  if (!level) return <p role="status">Loading the A1 course…</p>;
  return <div className="course-preview">
    <p className="learn-preview-kicker">Compiled course preview</p>
    <h1>{level.title.en}</h1>
    <p className="page-sub">{level.description.en}</p>
    <Feedback title="Content review in progress" tone="info">This structure is live for engineering review; lessons are not yet available to complete.</Feedback>
    <div className="course-unit-list">
      {level.units.map((unit, index) => <Card key={unit.id} title={`Unit ${index + 1} · ${unit.title.en}`}>
        <p>{unit.description.en}</p>
        <p><strong>Capability:</strong> {unit.capability.en}</p>
        <p className="page-sub">About {unit.estimated_minutes} minutes · Bundle {unit.bundle_version}</p>
        <Link to={`/learn/a1/unit/${unit.slug}`} variant="button">View unit outline</Link>
      </Card>)}
    </div>
  </div>;
}
