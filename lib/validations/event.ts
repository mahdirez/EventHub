import { z } from "zod";

function emptyStringToNull(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export const eventFormConstraints = {
  title: { minLength: 3, maxLength: 120 },
  description: { maxLength: 2000 },
  location: { maxLength: 200 },
} as const;

export const eventFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(
      eventFormConstraints.title.minLength,
      "Title must be at least 3 characters.",
    )
    .max(
      eventFormConstraints.title.maxLength,
      "Title must be at most 120 characters.",
    ),
  description: z
    .string()
    .trim()
    .max(
      eventFormConstraints.description.maxLength,
      "Description must be at most 2000 characters.",
    )
    .transform(emptyStringToNull),
  location: z
    .string()
    .trim()
    .max(
      eventFormConstraints.location.maxLength,
      "Location must be at most 200 characters.",
    )
    .transform(emptyStringToNull),
  eventDate: z
    .string()
    .trim()
    .transform((value) => (value.length ? value : null))
    .pipe(
      z
        .string()
        .nullable()
        .refine(
          (value) =>
            value === null || !Number.isNaN(new Date(value).getTime()),
          "Please enter a valid date and time.",
        ),
    ),
});

export type EventFormInput = z.infer<typeof eventFormSchema>;
