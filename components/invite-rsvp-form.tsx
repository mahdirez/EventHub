"use client";

import { useActionState } from "react";

import { FormSubmitButton } from "@/components/form-submit-button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useActionToast } from "@/hooks/use-action-toast";
import type { ActionState } from "@/lib/action-state";
import { fieldErrorMessages } from "@/lib/validations/parse-form-data";
import { rsvpFormConstraints } from "@/lib/validations/rsvp";

type InviteRsvpFormProps = {
  action: (
    prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  submitted: boolean;
};

export function InviteRsvpForm({ action, submitted }: InviteRsvpFormProps) {
  const [state, formAction] = useActionState(action, null);
  useActionToast(state);

  return (
    <>
      {submitted ? (
        <p className="mb-4 rounded-md border border-[var(--accent)]/50 bg-[var(--surface)]/15 p-3 text-sm">
          Your RSVP has been recorded.
        </p>
      ) : null}
      <form action={formAction} noValidate>
        <FieldGroup>
          <FieldSet>
            <Field data-invalid={Boolean(state?.fieldErrors?.name)}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                minLength={rsvpFormConstraints.name.minLength}
                maxLength={rsvpFormConstraints.name.maxLength}
                required
              />
              <FieldError errors={fieldErrorMessages(state?.fieldErrors, "name")} />
            </Field>
          </FieldSet>
          <FieldSet>
            <Field data-invalid={Boolean(state?.fieldErrors?.email)}>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                maxLength={rsvpFormConstraints.email.maxLength}
                required
              />
              <FieldError errors={fieldErrorMessages(state?.fieldErrors, "email")} />
            </Field>
          </FieldSet>
          <FieldSet>
            <Field data-invalid={Boolean(state?.fieldErrors?.status)}>
              <FieldLabel htmlFor="status">Attendance</FieldLabel>
              <select
                id="status"
                name="status"
                required
                defaultValue="going"
                className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3"
              >
                <option value="going">Going</option>
                <option value="maybe">Maybe</option>
                <option value="not_going">Not going</option>
              </select>
              <FieldError errors={fieldErrorMessages(state?.fieldErrors, "status")} />
            </Field>
          </FieldSet>
          <FormSubmitButton className="w-fit" pendingLabel="Submitting...">
            Submit RSVP
          </FormSubmitButton>
        </FieldGroup>
      </form>
    </>
  );
}
