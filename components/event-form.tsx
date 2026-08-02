"use client";

import { useActionState } from "react";
import Link from "next/link";

import { FormSubmitButton } from "@/components/form-submit-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useActionToast } from "@/hooks/use-action-toast";
import { toDatetimeLocalValue } from "@/lib/event-datetime";
import type { ActionState } from "@/lib/action-state";

type EventFormValues = {
  title: string;
  description?: string | null;
  location?: string | null;
  eventDate?: Date | string | null;
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
  const [state, formAction] = useActionState(action, null);
  useActionToast(state);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Team dinner"
                      defaultValue={defaultValues?.title ?? ""}
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Optional details about the event"
                      defaultValue={defaultValues?.description ?? ""}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="location">Location</FieldLabel>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Optional location"
                      defaultValue={defaultValues?.location ?? ""}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="eventDate">Date and time</FieldLabel>
                    <Input
                      id="eventDate"
                      name="eventDate"
                      type="datetime-local"
                      defaultValue={toDatetimeLocalValue(defaultValues?.eventDate)}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              {state?.error ? (
                <p className="text-sm text-destructive">{state.error}</p>
              ) : null}
              <div className="flex items-center gap-3">
                <FormSubmitButton pendingLabel={pendingLabel}>
                  {submitLabel}
                </FormSubmitButton>
                <Button type="button" variant="outline" asChild>
                  <Link href={cancelHref}>Cancel</Link>
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
