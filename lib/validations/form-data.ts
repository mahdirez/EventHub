import { z } from "zod";

function formDataToObject(formData: FormData): Record<string, string> {
  const values: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      values[key] = value;
    }
  }

  return values;
}

export function getFirstZodError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Invalid form data";
}

export function parseFormData<T extends z.ZodType>(
  schema: T,
  formData: FormData,
): z.infer<T> {
  return schema.parse(formDataToObject(formData));
}

export function safeParseFormData<T extends z.ZodType>(
  schema: T,
  formData: FormData,
):
  | { success: true; data: z.infer<T> }
  | { success: false; error: string } {
  const result = schema.safeParse(formDataToObject(formData));

  if (!result.success) {
    return { success: false, error: getFirstZodError(result.error) };
  }

  return { success: true, data: result.data };
}
