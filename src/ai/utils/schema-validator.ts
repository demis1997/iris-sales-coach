import type { z } from "zod";

export class SchemaValidationError extends Error {
  issues: unknown;

  constructor(message: string, issues: unknown) {
    super(message);
    this.name = "SchemaValidationError";
    this.issues = issues;
  }
}

export function validateSchema<TSchema extends z.ZodTypeAny>(
  schema: TSchema,
  data: unknown,
): z.infer<TSchema> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new SchemaValidationError(
      `AI output failed schema validation: ${parsed.error.issues
        .slice(0, 5)
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join("; ")}`,
      parsed.error.issues,
    );
  }
  return parsed.data;
}
