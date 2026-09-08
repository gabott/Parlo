// @vitest-environment node
import { describe, expect, it } from "vitest";
import { compileAll, loadSources, parseYamlStrict, validateContent } from "../../scripts/content/pipeline.mjs";

async function validContent() {
  return structuredClone((await loadSources())[0].content);
}

describe("content pipeline", () => {
  it("compiles the Unit 1 source deterministically", async () => {
    const first = await compileAll();
    const second = await compileAll();
    expect(first.manifest.checksum).toBe(second.manifest.checksum);
    expect(first.bundles[0].checksum).toBe(second.bundles[0].checksum);
  });

  it("rejects duplicate YAML keys", () => {
    expect(() => parseYamlStrict("id: one\nid: two\n", "duplicate.yaml")).toThrow(/duplicate/i);
  });

  it("rejects duplicate entity IDs and broken references with author guidance", async () => {
    const content = await validContent();
    content.concepts.push({ ...content.concepts[0] });
    content.lessons[0].concept_ids.push("concept.missing");
    const issues = await validateContent(content, "fixture.yaml");
    expect(issues.some(({ message }) => message.includes("Duplicate stable ID"))).toBe(true);
    expect(issues.some(({ message, suggestion }) => message.includes("Broken reference") && suggestion.includes("referenced entity"))).toBe(true);
  });

  it("rejects required prerequisite cycles", async () => {
    const content = await validContent();
    content.lessons[0].prerequisite_lesson_ids = [content.lessons[1].id];
    const issues = await validateContent(content, "cycle.yaml");
    expect(issues.some(({ message }) => message.includes("Required lesson cycle"))).toBe(true);
  });

  it("rejects ambiguous selection answers", async () => {
    const content = await validContent();
    content.items[0].payload.options[1].correct = true;
    const issues = await validateContent(content, "ambiguous.yaml");
    expect(issues.some(({ message }) => message.includes("2 correct answers"))).toBe(true);
  });

  it("preserves contractions as single sentence-builder tokens", async () => {
    const content = await validContent();
    const builder = content.items.find(({ activity_kind }: { activity_kind: string }) => activity_kind === "sentence_build");
    builder.payload.tokens = ["s'il", "vous", "plaît", "?"];
    builder.payload.accepted_answers = ["s'il vous plaît?"];
    expect(builder.payload.tokens).toContain("s'il");
    expect(await validateContent(content, "contraction.yaml")).toEqual([]);
  });

  it("blocks published media without accessibility alternatives", async () => {
    const content = await validContent();
    content.media.push({ id: "media.audio.greeting.v1", revision: 1, status: "published", review: { linguistic: "approved", pedagogical: "approved", accessibility: "approved" }, kind: "audio", uri: "/audio/greeting.mp3", mime_type: "audio/mpeg", transcript: null });
    const issues = await validateContent(content, "media.yaml");
    expect(issues.some(({ field, message }) => field === "transcript" && message.includes("no transcript"))).toBe(true);
  });
});
