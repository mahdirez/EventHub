import { flattenError, type ZodError, type ZodType } from "zod";

import type { ActionState } from "@/lib/action-state";

export function formDataToObject(formData: FormData): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      result[key] = value;
    }
  }

  return result;
}

export function zodValidationError(error: ZodError): ActionState {
  const { formErrors, fieldErrors } = flattenError(error);
  const fieldMessages = Object.values(fieldErrors).flat().filter(Boolean);
  const message =
    formErrors[0] ??
    fieldMessages[0] ??
    "Please check the form and try again.";

  return {
    error: message,
    fieldErrors: fieldErrors as Record<string, string[]>,
  };
}

export function parseFormData<T>(
  schema: ZodType<T>,
  formData: FormData,
): { success: true; data: T } | { success: false; state: ActionState } {
  const result = schema.safeParse(formDataToObject(formData));

  if (!result.success) {
    return { success: false, state: zodValidationError(result.error) };
  }

  return { success: true, data: result.data };
}

export function fieldErrorMessages(
  fieldErrors: Record<string, string[]> | undefined,
  field: string,
) {
  return fieldErrors?.[field]?.map((message) => ({ message }));
}
