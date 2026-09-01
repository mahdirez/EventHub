"use client";

import { useActionState } from "react";

import { useI18n } from "@/components/i18n-provider";
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
  const { t } = useI18n();
  const [state, formAction] = useActionState(action, null);
  useActionToast(state);

  return (
    <form action={formAction}>
      <FormSubmitButton pendingLabel={t("event.generating")}>
        {t("common.generateLink")}
      </FormSubmitButton>
    </form>
  );
}
