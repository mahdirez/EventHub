"use client";

import { useActionState } from "react";
import Link from "next/link";

import { SurfaceCard } from "@/components/design-system/surface-card";
import { FormSubmitButton } from "@/components/form-submit-button";
import { Button } from "@/components/ui/button";
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
import type { MockCategoryId } from "@/lib/constants/mock-discovery";
import type { ActionState } from "@/lib/action-state";
import { toDatetimeLocalValue } from "@/lib/event-datetime";
import { eventFormConstraints } from "@/lib/validations/event";
import { fieldErrorMessages } from "@/lib/validations/parse-form-data";

const categoryIds: MockCategoryId[] = [
  "technology",
  "music",
  "business",
  "art",
  "education",
  "sports",
];

type EventFormValues = {
  title: string;
  description?: string | null;
  location?: string | null;
  city?: string | null;
  eventDate?: Date | string | null;
  capacity?: number | null;
  visibility?: "private" | "public";
  categorySlug?: string | null;
  coverImageUrl?: string | null;
  slug?: string | null;
};

type EventFormProps = {
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
  submitLabel,
  pendingLabel,
  cancelHref,
  action,
  defaultValues,
}: EventFormProps) {
  const { t } = useI18n();
  const [state, formAction] = useActionState(action, null);
  useActionToast(state);

  const visibility = defaultValues?.visibility ?? "private";

  return (
    <div className="mx-auto w-full max-w-2xl">
      <SurfaceCard className="overflow-hidden">
        <div className="p-6">
          <form action={formAction} noValidate>
            <FieldGroup>
              <FieldSet>
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
              </FieldSet>

              <FieldSet>
                <Field data-invalid={Boolean(state?.fieldErrors?.visibility)}>
                  <FieldLabel htmlFor="visibility">
                    {t("event.form.visibility")}
                  </FieldLabel>
                  <select
                    id="visibility"
                    name="visibility"
                    defaultValue={visibility}
                    className="flex h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm"
                  >
                    <option value="private">{t("event.form.visibilityPrivate")}</option>
                    <option value="public">{t("event.form.visibilityPublic")}</option>
                  </select>
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("event.form.visibilityHint")}
                  </p>
                  <FieldError errors={fieldErrorMessages(state?.fieldErrors, "visibility")} />
                </Field>
              </FieldSet>

              <FieldSet>
                <Field data-invalid={Boolean(state?.fieldErrors?.categorySlug)}>
                  <FieldLabel htmlFor="categorySlug">
                    {t("event.form.category")}
                  </FieldLabel>
                  <select
                    id="categorySlug"
                    name="categorySlug"
                    defaultValue={defaultValues?.categorySlug ?? ""}
                    className="flex h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] px-3 text-sm"
                  >
                    <option value="">{t("event.form.categoryPlaceholder")}</option>
                    {categoryIds.map((id) => (
                      <option key={id} value={id}>
                        {t(`discovery.categories.${id}`)}
                      </option>
                    ))}
                  </select>
                  <FieldError errors={fieldErrorMessages(state?.fieldErrors, "categorySlug")} />
                </Field>
              </FieldSet>

              <FieldSet>
                <Field data-invalid={Boolean(state?.fieldErrors?.slug)}>
                  <FieldLabel htmlFor="slug">{t("event.form.slug")}</FieldLabel>
                  <Input
                    id="slug"
                    name="slug"
                    placeholder={t("event.form.slugPlaceholder")}
                    defaultValue={defaultValues?.slug ?? ""}
                  />
                  <p className="text-xs text-[var(--muted-foreground)]">
                    {t("event.form.slugHint")}
                  </p>
                  <FieldError errors={fieldErrorMessages(state?.fieldErrors, "slug")} />
                </Field>
              </FieldSet>

              <FieldSet>
                <Field data-invalid={Boolean(state?.fieldErrors?.city)}>
                  <FieldLabel htmlFor="city">{t("event.form.city")}</FieldLabel>
                  <Input
                    id="city"
                    name="city"
                    placeholder={t("event.form.cityPlaceholder")}
                    defaultValue={defaultValues?.city ?? ""}
                  />
                  <FieldError errors={fieldErrorMessages(state?.fieldErrors, "city")} />
                </Field>
              </FieldSet>

              <FieldSet>
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
              </FieldSet>

              <FieldSet>
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
              </FieldSet>

              <FieldSet>
                <Field data-invalid={Boolean(state?.fieldErrors?.coverImageUrl)}>
                  <FieldLabel htmlFor="coverImageUrl">
                    {t("event.form.coverImageUrl")}
                  </FieldLabel>
                  <Input
                    id="coverImageUrl"
                    name="coverImageUrl"
                    type="url"
                    placeholder={t("event.form.coverImageUrlPlaceholder")}
                    defaultValue={defaultValues?.coverImageUrl ?? ""}
                  />
                  <FieldError errors={fieldErrorMessages(state?.fieldErrors, "coverImageUrl")} />
                </Field>
              </FieldSet>

              <FieldSet>
                <Field data-invalid={Boolean(state?.fieldErrors?.description)}>
                  <FieldLabel htmlFor="description">
                    {t("event.form.description")}
                  </FieldLabel>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder={t("event.form.descriptionPlaceholder")}
                    defaultValue={defaultValues?.description ?? ""}
                    maxLength={eventFormConstraints.description.maxLength}
                  />
                  <FieldError errors={fieldErrorMessages(state?.fieldErrors, "description")} />
                </Field>
              </FieldSet>

              <FieldSet>
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
              </FieldSet>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <FormSubmitButton pendingLabel={pendingLabel}>
                  {submitLabel}
                </FormSubmitButton>
                <Button type="button" variant="outline" asChild>
                  <Link href={cancelHref}>{t("common.cancel")}</Link>
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </SurfaceCard>
    </div>
  );
}
