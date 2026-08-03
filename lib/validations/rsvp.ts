import { z } from "zod";

export const rsvpFormConstraints = {
  name: { minLength: 2, maxLength: 120 },
  email: { maxLength: 320 },
} as const;

export const rsvpStatusSchema = z.enum(["going", "maybe", "not_going"]);

export const rsvpFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(rsvpFormConstraints.name.minLength, "Name must be at least 2 characters.")
    .max(rsvpFormConstraints.name.maxLength, "Name must be at most 120 characters."),
  email: z
    .string()
    .trim()
    .min(3, "Please enter a valid email.")
    .max(rsvpFormConstraints.email.maxLength, "Email is too long.")
    .pipe(z.email("Please enter a valid email.")),
  status: rsvpStatusSchema,
});

export type RsvpFormInput = z.infer<typeof rsvpFormSchema>;
