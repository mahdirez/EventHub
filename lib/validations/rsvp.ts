import { z } from "zod";

import type { Translator } from "@/lib/i18n";

export const rsvpFormConstraints = {
  name: { minLength: 2, maxLength: 120 },
  email: { maxLength: 320 },
} as const;

export const rsvpStatusSchema = z.enum(["going", "maybe", "not_going"]);

export function createRsvpFormSchema(t: Translator) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(rsvpFormConstraints.name.minLength, t("validation.rsvp.nameMin"))
      .max(rsvpFormConstraints.name.maxLength, t("validation.rsvp.nameMax")),
    email: z
      .string()
      .trim()
      .min(3, t("validation.rsvp.emailInvalid"))
      .max(rsvpFormConstraints.email.maxLength, t("validation.rsvp.emailMax"))
      .pipe(z.email(t("validation.rsvp.emailInvalid"))),
    status: rsvpStatusSchema,
  });
}

export type RsvpFormInput = z.infer<ReturnType<typeof createRsvpFormSchema>>;
