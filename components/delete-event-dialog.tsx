"use client";

import { useActionState } from "react";
import { Trash2Icon } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";
import { FormSubmitButton } from "@/components/form-submit-button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useActionToast } from "@/hooks/use-action-toast";
import type { ActionState } from "@/lib/action-state";

type DeleteEventDialogProps = {
  action: (
    prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  eventTitle: string;
};

export function DeleteEventDialog({
  action,
  eventTitle,
}: DeleteEventDialogProps) {
  const { t } = useI18n();
  const [state, formAction] = useActionState(action, null);
  useActionToast(state);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">{t("common.deleteEvent")}</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia>
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>{t("event.deleteTitle")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("event.deleteDescription", { title: eventTitle })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
          <form action={formAction}>
            <FormSubmitButton
              variant="destructive"
              pendingLabel={t("event.deleting")}
            >
              {t("common.deleteEvent")}
            </FormSubmitButton>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
