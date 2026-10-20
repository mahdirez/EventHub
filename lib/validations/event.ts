import { z } from "zod";

import type { Translator } from "@/lib/i18n";
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

export function createEventFormSchema(t: Translator) {
  return z
    .object({
      title: z
        .string()
        .trim()
        .min(
          eventFormConstraints.title.minLength,
          t("validation.event.titleMin"),
        )
        .max(
          eventFormConstraints.title.maxLength,
          t("validation.event.titleMax"),
        ),
      description: z
        .string()
        .trim()
        .max(
          eventFormConstraints.description.maxLength,
          t("validation.event.descriptionMax"),
        )
        .transform(emptyStringToNull),
      location: z
        .string()
        .trim()
        .max(
          eventFormConstraints.location.maxLength,
          t("validation.event.locationMax"),
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
              t("validation.event.eventDateInvalid"),
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
              t("validation.event.capacityRange", {
                min: eventFormConstraints.capacity.min,
                max: eventFormConstraints.capacity.max,
              }),
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
              t("validation.event.categoryInvalid"),
            ),
        ),
      city: z
        .string()
        .trim()
        .max(120, t("validation.event.cityMax"))
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
              t("validation.event.coverImageUrlInvalid"),
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
              t("validation.event.slugInvalid"),
            ),
        ),
    })
    .superRefine((data, ctx) => {
      if (data.visibility === "public" && !data.categorySlug) {
        ctx.addIssue({
          code: "custom",
          message: t("validation.event.categoryRequiredPublic"),
          path: ["categorySlug"],
        });
      }
    });
}

export type EventFormInput = z.infer<ReturnType<typeof createEventFormSchema>>;
