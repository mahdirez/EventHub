export type ActionState = {
  error?: string;
  success?: string;
  fieldErrors?: Record<string, string[]>;
} | null;

export function actionError(message: string): ActionState {
  return { error: message };
}

export function actionSuccess(message: string): ActionState {
  return { success: message };
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
