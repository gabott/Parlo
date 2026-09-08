import { createHash } from "node:crypto";
import { readFile, readdir, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv from "ajv/dist/2020.js";
import { parseDocument } from "yaml";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const SOURCE_DIR = path.join(ROOT, "content/courses/fr-general");
const SCHEMA_PATH = path.join(ROOT, "content/schemas/unit-content.schema.json");
const GENERATED_DIR = path.join(ROOT, "generated");

export class ContentValidationError extends Error {
  constructor(issues) {
    super(issues.map(formatIssue).join("\n"));
    this.name = "ContentValidationError";
    this.issues = issues;
  }
}

function formatIssue(issue) {
  const entity = issue.entityId ? ` [${issue.entityId}]` : "";
  return `${issue.file}${entity} ${issue.field}: ${issue.message} Suggested correction: ${issue.suggestion}`;
}

export function parseYamlStrict(source, file = "content.yaml") {
  const document = parseDocument(source, { uniqueKeys: true, merge: true });
  if (document.errors.length) {
    throw new ContentValidationError(document.errors.map((error) => ({
      file, field: "YAML", message: error.message.split(" at line")[0], suggestion: "Remove the duplicate or malformed key.",
    })));
  }
  return document.toJS();
}

function issue(file, entityId, field, message, suggestion) { return { file, entityId, field, message, suggestion }; }
function entitiesOf(content) { return [content.course, content.level, content.unit, ...content.lessons, ...content.concepts, ...content.lexemes, ...content.phrases, ...content.activities, ...content.items, ...content.media]; }

function findCycles(nodes, edgeFor) {
  const cycles = [];
  const visiting = new Set();
  const visited = new Set();
  const visit = (id, trail) => {
    if (visiting.has(id)) { cycles.push([...trail.slice(trail.indexOf(id)), id]); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const next of edgeFor(id)) visit(next, [...trail, id]);
    visiting.delete(id); visited.add(id);
  };
  for (const node of nodes) visit(node.id, []);
  return cycles;
}

export async function validateContent(content, file = "content.yaml", schemaOverride) {
  const schema = schemaOverride ?? JSON.parse(await readFile(SCHEMA_PATH, "utf8"));
  const ajv = new Ajv({ allErrors: true, strict: false });
  const structural = ajv.compile(schema);
  const issues = [];
  if (!structural(content)) {
    for (const error of structural.errors ?? []) issues.push(issue(file, undefined, error.instancePath || "$", error.message ?? "Invalid value.", "Match the field shape in content/schemas/unit-content.schema.json."));
    return issues;
  }

  const entities = entitiesOf(content);
  const byId = new Map();
  for (const entity of entities) {
    if (byId.has(entity.id)) issues.push(issue(file, entity.id, "id", "Duplicate stable ID.", "Give each entity a globally unique stable ID."));
    byId.set(entity.id, entity);
    if (entity.status === "published") {
      for (const dimension of ["linguistic", "pedagogical", "accessibility"]) {
        if (!["approved", "not_required"].includes(entity.review[dimension])) issues.push(issue(file, entity.id, `review.${dimension}`, "Published content has an incomplete review.", "Approve the review or return the entity to in_review."));
      }
    }
  }

  const refs = [
    [content.course, "level_ids"], [content.level, "ordered_unit_ids"], [content.unit, "prerequisite_unit_ids"], [content.unit, "ordered_lesson_ids"],
    ...content.lessons.flatMap((x) => [[x, "prerequisite_lesson_ids"], [x, "concept_ids"], [x, "ordered_activity_ids"]]),
    ...content.lexemes.flatMap((x) => [[x, "concept_ids"], [x, "audio_ids"]]),
    ...content.phrases.flatMap((x) => [[x, "concept_ids"], [x, "audio_ids"]]),
    ...content.activities.flatMap((x) => [[x, "item_ids"], [x, "media_ids"]]),
    ...content.items.map((x) => [x, "concept_ids"]),
  ];
  for (const [entity, field] of refs) for (const id of entity[field] ?? []) if (!byId.has(id)) issues.push(issue(file, entity.id, field, `Broken reference: ${id}.`, "Add the referenced entity or correct the stable ID."));
  const singularRefs = [[content.level, "course_id"], [content.unit, "level_id"], ...content.lessons.map((x) => [x, "unit_id"]), ...content.activities.map((x) => [x, "lesson_id"])];
  for (const [entity, field] of singularRefs) if (!byId.has(entity[field])) issues.push(issue(file, entity.id, field, `Broken reference: ${entity[field]}.`, "Add the referenced entity or correct the stable ID."));
  for (const concept of content.concepts) for (const prerequisite of concept.prerequisites) if (!byId.has(prerequisite.concept_id)) issues.push(issue(file, concept.id, "prerequisites", `Broken reference: ${prerequisite.concept_id}.`, "Add the referenced concept or correct the stable ID."));

  const lessonMap = new Map(content.lessons.map((x) => [x.id, x]));
  const conceptMap = new Map(content.concepts.map((x) => [x.id, x]));
  for (const cycle of findCycles(content.lessons, (id) => lessonMap.get(id)?.prerequisite_lesson_ids ?? [])) issues.push(issue(file, cycle[0], "prerequisite_lesson_ids", `Required lesson cycle: ${cycle.join(" -> ")}.`, "Remove one prerequisite edge from the cycle."));
  for (const cycle of findCycles(content.concepts, (id) => (conceptMap.get(id)?.prerequisites ?? []).filter((x) => x.relationship === "required").map((x) => x.concept_id))) issues.push(issue(file, cycle[0], "prerequisites", `Required concept cycle: ${cycle.join(" -> ")}.`, "Remove or change one required edge to helpful."));

  for (const item of content.items) {
    if (["meaning_select", "audio_text_select"].includes(item.activity_kind)) {
      const options = item.payload.options ?? [];
      const answers = options.filter((option) => option.correct === true);
      if (answers.length !== 1) issues.push(issue(file, item.id, "payload.options", `Selection item has ${answers.length} correct answers.`, "Mark exactly one option as correct."));
      if (new Set(options.map((option) => option.text.trim().toLocaleLowerCase())).size !== options.length) issues.push(issue(file, item.id, "payload.options", "Selection item contains duplicate options.", "Make every visible option distinct."));
    }
    if (item.activity_kind === "sentence_build") {
      const normalized = item.payload.tokens?.join(" ").replace(/\s+([!?.,])/g, "$1");
      if (!item.payload.accepted_answers?.includes(normalized)) issues.push(issue(file, item.id, "payload.accepted_answers", "Tokens do not reconstruct an accepted answer.", "Preserve contractions as one token and add the normalized sentence."));
    }
  }
  for (const media of content.media) if (media.status === "published") {
    if (media.kind === "audio" && !media.transcript) issues.push(issue(file, media.id, "transcript", "Published audio has no transcript.", "Add a verbatim transcript or keep the asset in draft."));
    if (media.kind === "image" && !media.accessibility_description) issues.push(issue(file, media.id, "accessibility_description", "Published image has no accessibility alternative.", "Add a concise description or keep the asset in draft."));
    if (media.kind === "video" && (!media.captions_uri || !media.transcript)) issues.push(issue(file, media.id, "captions_uri", "Published video requires captions and a transcript.", "Add both accessible alternatives or keep the asset in draft."));
  }
  return issues;
}

export function stableStringify(value) {
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  if (value && typeof value === "object") return `{${Object.keys(value).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
  return JSON.stringify(value);
}
export function checksum(value) { return `sha256:${createHash("sha256").update(stableStringify(value)).digest("hex")}`; }

export async function loadSources(sourceDir = SOURCE_DIR) {
  const files = (await readdir(sourceDir)).filter((file) => /\.ya?ml$/i.test(file)).sort();
  return Promise.all(files.map(async (file) => ({ file, content: parseYamlStrict(await readFile(path.join(sourceDir, file), "utf8"), file) })));
}

export async function compileAll({ sourceDir = SOURCE_DIR, write = false } = {}) {
  const sources = await loadSources(sourceDir);
  const compiled = [];
  for (const source of sources) {
    const issues = await validateContent(source.content, source.file);
    if (issues.length) throw new ContentValidationError(issues);
    const bundle = { ...source.content, checksum: checksum(source.content) };
    compiled.push(bundle);
  }
  const manifestBase = {
    schema_version: "1.0.0",
    courses: compiled.map(({ bundle_version, course, level, unit, checksum: bundleChecksum }) => ({
      id: course.id, title: course.title, description: course.description,
      levels: [{ id: level.id, cefr: level.cefr, title: level.title, description: level.description, units: [{ id: unit.id, slug: "first-contact", title: unit.title, description: unit.description, capability: unit.capability, estimated_minutes: unit.estimated_minutes, bundle_version, bundle_checksum: bundleChecksum, bundle_path: `./bundles/${bundle_version}.json` }] }],
    })),
  };
  const manifest = { ...manifestBase, checksum: checksum(manifestBase) };
  if (write) {
    await mkdir(path.join(GENERATED_DIR, "bundles"), { recursive: true });
    await writeFile(path.join(GENERATED_DIR, "content-manifest.json"), `${stableStringify(manifest)}\n`);
    for (const bundle of compiled) await writeFile(path.join(GENERATED_DIR, "bundles", `${bundle.bundle_version}.json`), `${stableStringify(bundle)}\n`);
  }
  return { manifest, bundles: compiled };
}

export { ROOT, GENERATED_DIR };
