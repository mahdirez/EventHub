import { z } from "zod";

import { isCategoryId } from "@/lib/services/discovery-mappers";

function emptyStringToNull(value: string) {
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const eventFormConstraints = {
  title: { minLength: 3, maxLength: 120 },
  description: { maxLength: 2000 },
  location: { maxLength: 200 },
  capacity: { min: 1, max: 10000 },
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
  capacity: z
    .string()
    .trim()
    .transform((value) => (value.length ? value : null))
    .pipe(
      z
        .string()
        .nullable()
        .refine(
          (value) => {
            if (value === null) {
              return true;
            }

            const parsed = Number(value);
            return (
              Number.isInteger(parsed) &&
              parsed >= eventFormConstraints.capacity.min &&
              parsed <= eventFormConstraints.capacity.max
            );
          },
          `Capacity must be a whole number between ${eventFormConstraints.capacity.min} and ${eventFormConstraints.capacity.max}.`,
        )
        .transform((value) => (value === null ? null : Number(value))),
    ),
  visibility: z.enum(["private", "public"]),
  categorySlug: z
    .string()
    .trim()
    .transform((value) => (value.length ? value : null))
    .pipe(
      z
        .string()
        .nullable()
        .refine(
          (value) => value === null || isCategoryId(value),
          "Please choose a valid category.",
        ),
    ),
  city: z
    .string()
    .trim()
    .max(120, "City must be at most 120 characters.")
    .transform(emptyStringToNull),
  coverImageUrl: z
    .string()
    .trim()
    .transform((value) => (value.length ? value : null))
    .pipe(
      z
        .string()
        .nullable()
        .refine(
          (value) =>
            value === null || z.string().url().safeParse(value).success,
          "Please enter a valid image URL.",
        ),
    ),
  slug: z
    .string()
    .trim()
    .transform((value) => (value.length ? value : null))
    .pipe(
      z
        .string()
        .nullable()
        .refine(
          (value) => value === null || slugPattern.test(value),
          "Slug can only contain lowercase letters, numbers, and hyphens.",
        ),
    ),
})
  .superRefine((data, ctx) => {
    if (data.visibility === "public" && !data.categorySlug) {
      ctx.addIssue({
        code: "custom",
        message: "Please choose a category for public events.",
        path: ["categorySlug"],
      });
    }
  });

export type EventFormInput = z.infer<typeof eventFormSchema>;
