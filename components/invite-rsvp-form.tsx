"use client";

import { useActionState, useEffect, useState } from "react";

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
import { canRsvpGoing } from "@/lib/event-capacity";
import { getStoredRsvp, setStoredRsvp, type StoredRsvp } from "@/lib/rsvp-storage";
import { fieldErrorMessages } from "@/lib/validations/parse-form-data";
import { rsvpFormConstraints } from "@/lib/validations/rsvp";

type InviteRsvpFormProps = {
  token: string;
  action: (
    prevState: ActionState,
    formData: FormData,
  ) => Promise<ActionState>;
  submitted: boolean;
  existingRsvp?: StoredRsvp | null;
  capacity?: number | null;
  goingCount: number;
};

export function InviteRsvpForm({
  token,
  action,
  submitted,
  existingRsvp,
  capacity = null,
  goingCount,
}: InviteRsvpFormProps) {
  const [state, formAction] = useActionState(action, null);
  useActionToast(state);
  const [defaults, setDefaults] = useState<StoredRsvp | null>(
    existingRsvp ?? null,
  );

  useEffect(() => {
    if (existingRsvp) {
      setDefaults(existingRsvp);
      setStoredRsvp(token, existingRsvp);
      return;
    }

    const stored = getStoredRsvp(token);
    if (stored) {
      setDefaults(stored);
    }
  }, [existingRsvp, token]);

  const formKey = defaults?.email ?? "new";
  const canSelectGoing = canRsvpGoing(capacity, goingCount, defaults?.status);
  const defaultStatus =
    defaults?.status && (defaults.status !== "going" || canSelectGoing)
      ? defaults.status
      : canSelectGoing
        ? "going"
        : "maybe";

  return (
    <>
      {submitted ? (
        <p className="mb-4 rounded-md border border-[var(--accent)]/50 bg-[var(--surface)]/15 p-3 text-sm">
          Your RSVP has been recorded.
        </p>
      ) : null}
      {defaults ? (
        <p className="mb-4 text-sm text-[var(--muted-foreground)]">
          We found your previous RSVP for this event. Update your response
          below if anything changed.
        </p>
      ) : null}
      {!canSelectGoing ? (
        <p className="mb-4 text-sm text-[var(--muted-foreground)]">
          This event is at capacity for Going responses. You can still RSVP as
          Maybe or Not going.
        </p>
      ) : null}
      <form key={formKey} action={formAction} noValidate>
        <FieldGroup>
          <FieldSet>
            <Field data-invalid={Boolean(state?.fieldErrors?.name)}>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input
                id="name"
                name="name"
                placeholder="Your name"
                defaultValue={defaults?.name ?? ""}
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
                defaultValue={defaults?.email ?? ""}
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
                defaultValue={defaultStatus}
                className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3"
              >
                <option value="going" disabled={!canSelectGoing}>
                  Going{!canSelectGoing ? " (full)" : ""}
                </option>
                <option value="maybe">Maybe</option>
                <option value="not_going">Not going</option>
              </select>
              <FieldError errors={fieldErrorMessages(state?.fieldErrors, "status")} />
            </Field>
          </FieldSet>
          <FormSubmitButton className="w-fit" pendingLabel="Submitting...">
            {defaults ? "Update RSVP" : "Submit RSVP"}
          </FormSubmitButton>
        </FieldGroup>
      </form>
    </>
  );
}
