"use client";

import { useActionState } from "react";
import Link from "next/link";

import { FormSubmitButton } from "@/components/form-submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionToast } from "@/hooks/use-action-toast";
import { useI18n } from "@/components/i18n-provider";
import type { ActionState } from "@/lib/action-state";
import { toDatetimeLocalValue } from "@/lib/event-datetime";
import { eventFormConstraints } from "@/lib/validations/event";
import { fieldErrorMessages } from "@/lib/validations/parse-form-data";

type EventFormValues = {
  title: string;
  description?: string | null;
  location?: string | null;
  eventDate?: Date | string | null;
  capacity?: number | null;
};

type EventFormProps = {
  title: string;
  submitLabel: string;
  pendingLabel?: string;
  cancelHref: string;
  action: (
    prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  defaultValues?: EventFormValues;
};

export function EventForm({
  title,
  submitLabel,
  pendingLabel,
  cancelHref,
  action,
  defaultValues,
}: EventFormProps) {
  const { t } = useI18n();
  const [state, formAction] = useActionState(action, null);
  useActionToast(state);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} noValidate>
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field data-invalid={Boolean(state?.fieldErrors?.title)}>
                    <FieldLabel htmlFor="title">{t("event.form.title")}</FieldLabel>
                    <Input
                      id="title"
                      name="title"
                      placeholder={t("event.form.titlePlaceholder")}
                      defaultValue={defaultValues?.title ?? ""}
                      minLength={eventFormConstraints.title.minLength}
                      maxLength={eventFormConstraints.title.maxLength}
                      required
                    />
                    <FieldError errors={fieldErrorMessages(state?.fieldErrors, "title")} />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldGroup>
                  <Field data-invalid={Boolean(state?.fieldErrors?.description)}>
                    <FieldLabel htmlFor="description">{t("event.form.description")}</FieldLabel>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder={t("event.form.descriptionPlaceholder")}
                      defaultValue={defaultValues?.description ?? ""}
                      maxLength={eventFormConstraints.description.maxLength}
                    />
                    <FieldError errors={fieldErrorMessages(state?.fieldErrors, "description")} />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldGroup>
                  <Field data-invalid={Boolean(state?.fieldErrors?.location)}>
                    <FieldLabel htmlFor="location">{t("event.form.location")}</FieldLabel>
                    <Input
                      id="location"
                      name="location"
                      placeholder={t("event.form.locationPlaceholder")}
                      defaultValue={defaultValues?.location ?? ""}
                      maxLength={eventFormConstraints.location.maxLength}
                    />
                    <FieldError errors={fieldErrorMessages(state?.fieldErrors, "location")} />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldGroup>
                  <Field data-invalid={Boolean(state?.fieldErrors?.eventDate)}>
                    <FieldLabel htmlFor="eventDate">{t("event.form.dateTime")}</FieldLabel>
                    <Input
                      id="eventDate"
                      name="eventDate"
                      type="datetime-local"
                      defaultValue={toDatetimeLocalValue(defaultValues?.eventDate)}
                    />
                    <FieldError errors={fieldErrorMessages(state?.fieldErrors, "eventDate")} />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldGroup>
                  <Field data-invalid={Boolean(state?.fieldErrors?.capacity)}>
                    <FieldLabel htmlFor="capacity">{t("event.form.capacity")}</FieldLabel>
                    <Input
                      id="capacity"
                      name="capacity"
                      type="number"
                      min={eventFormConstraints.capacity.min}
                      max={eventFormConstraints.capacity.max}
                      step={1}
                      placeholder={t("common.unlimited")}
                      defaultValue={
                        defaultValues?.capacity != null
                          ? String(defaultValues.capacity)
                          : ""
                      }
                    />
                    <FieldError errors={fieldErrorMessages(state?.fieldErrors, "capacity")} />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <div className="flex items-center gap-3">
                <FormSubmitButton pendingLabel={pendingLabel}>
                  {submitLabel}
                </FormSubmitButton>
                <Button type="button" variant="outline" asChild>
                  <Link href={cancelHref}>{t("common.cancel")}</Link>
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
