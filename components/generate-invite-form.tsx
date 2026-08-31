"use client";

import { useActionState } from "react";

import { FormSubmitButton } from "@/components/form-submit-button";
import { useActionToast } from "@/hooks/use-action-toast";
import type { ActionState } from "@/lib/action-state";

type GenerateInviteFormProps = {
  action: (
    prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
};

export function GenerateInviteForm({ action }: GenerateInviteFormProps) {
  const [state, formAction] = useActionState(action, null);
  useActionToast(state);

  return (
    <form action={formAction}>
      <FormSubmitButton pendingLabel="Generating...">
        Generate link
      </FormSubmitButton>
    </form>
  );
}
