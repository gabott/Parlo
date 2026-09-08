export interface ValidationIssue { file: string; entityId?: string; field: string; message: string; suggestion: string }
export class ContentValidationError extends Error { issues: ValidationIssue[] }
export function parseYamlStrict(source: string, file?: string): unknown;
export function validateContent(content: any, file?: string, schemaOverride?: object): Promise<ValidationIssue[]>;
export function stableStringify(value: unknown): string;
export function checksum(value: unknown): string;
export function loadSources(sourceDir?: string): Promise<Array<{ file: string; content: any }>>;
export function compileAll(options?: { sourceDir?: string; write?: boolean }): Promise<{ manifest: any; bundles: any[] }>;
export const ROOT: string;
export const GENERATED_DIR: string;
