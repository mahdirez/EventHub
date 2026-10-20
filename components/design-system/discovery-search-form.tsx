"use client";

import {
  CalendarIcon,
  ChevronDownIcon,
  MapPinIcon,
  SearchIcon,
  TagIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { PrimaryButton } from "@/components/design-system/primary-button";
import { useI18n } from "@/components/i18n-provider";
import type { MockCategoryId } from "@/lib/constants/mock-discovery";
import { cn } from "@/lib/utils";

const categoryIds: MockCategoryId[] = [
  "technology",
  "music",
  "business",
  "art",
  "education",
  "sports",
];

export type DiscoverySearchValues = {
  q?: string;
  date?: string;
  location?: string;
  category?: string;
};

type DiscoverySearchFormProps = {
  defaultValues?: DiscoverySearchValues;
  className?: string;
};

const controlClassName =
  "h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] ps-10 pe-3 text-sm text-foreground placeholder:text-[var(--muted-foreground)] outline-none transition-colors focus:border-[var(--accent-muted)]/60 focus:ring-2 focus:ring-[var(--accent)]/15";

export function DiscoverySearchForm({
  defaultValues,
  className,
}: DiscoverySearchFormProps) {
  const { t } = useI18n();
  const router = useRouter();

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const params = new URLSearchParams();
    const q = String(form.get("q") ?? "").trim();
    const date = String(form.get("date") ?? "");
    const location = String(form.get("location") ?? "").trim();
    const category = String(form.get("category") ?? "");

    if (q) params.set("q", q);
    if (date) params.set("date", date);
    if (location) params.set("location", location);
    if (category) params.set("category", category);

    const query = params.toString();
    router.push(query ? `/explore?${query}` : "/explore");
  }

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)}>
      <div
        className={cn(
          "glass-panel flex flex-col gap-2 rounded-2xl p-2 sm:p-3",
          "lg:flex-row lg:items-stretch lg:gap-2",
        )}
      >
        <label className="relative flex min-h-11 min-w-0 flex-1 items-center lg:min-w-[12rem]">
          <SearchIcon
            className="pointer-events-none absolute start-3 size-4 text-[var(--muted-foreground)]"
            aria-hidden
          />
          <input
            name="q"
            type="search"
            defaultValue={defaultValues?.q ?? ""}
            placeholder={t("discovery.searchPlaceholder")}
            className={controlClassName}
          />
        </label>

        <div
          className={cn(
            "grid grid-cols-1 gap-2 sm:grid-cols-2",
            "lg:flex lg:flex-1 lg:flex-wrap lg:items-stretch lg:justify-end lg:gap-2",
          )}
        >
          <FilterSelect
            name="date"
            icon={CalendarIcon}
            defaultLabel={t("discovery.anyDate")}
            defaultValue={defaultValues?.date ?? ""}
            className="sm:col-span-1"
          >
            <option value="week">{t("discovery.filters.week")}</option>
            <option value="month">{t("discovery.filters.month")}</option>
          </FilterSelect>
          <FilterSelect
            name="location"
            icon={MapPinIcon}
            defaultLabel={t("discovery.anyLocation")}
            defaultValue={defaultValues?.location ?? ""}
            isTextInput
          />
          <FilterSelect
            name="category"
            icon={TagIcon}
            defaultLabel={t("discovery.allCategories")}
            defaultValue={defaultValues?.category ?? ""}
            className="sm:col-span-2 lg:col-span-1"
          >
            {categoryIds.map((id) => (
              <option key={id} value={id}>
                {t(`discovery.categories.${id}`)}
              </option>
            ))}
          </FilterSelect>
          <PrimaryButton
            type="submit"
            className="h-11 w-full shrink-0 sm:col-span-2 lg:w-auto lg:min-w-[7.5rem]"
            showArrow
          >
            {t("discovery.search")}
          </PrimaryButton>
        </div>
      </div>
    </form>
  );
}

function FilterSelect({
  name,
  icon: Icon,
  defaultLabel,
  defaultValue,
  children,
  isTextInput,
  className,
}: {
  name: string;
  icon: typeof CalendarIcon;
  defaultLabel: string;
  defaultValue: string;
  children?: React.ReactNode;
  isTextInput?: boolean;
  className?: string;
}) {
  const wrapperClassName = cn(
    "relative min-w-0 flex-1 lg:min-w-[9.5rem] lg:max-w-[11.5rem]",
    className,
  );

  if (isTextInput) {
    return (
      <div className={wrapperClassName}>
        <Icon
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]"
          aria-hidden
        />
        <input
          name={name}
          type="text"
          defaultValue={defaultValue}
          placeholder={defaultLabel}
          className={controlClassName}
        />
      </div>
    );
  }

  return (
    <div className={wrapperClassName}>
      <Icon
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]"
        aria-hidden
      />
      <select
        name={name}
        defaultValue={defaultValue}
        className={cn(controlClassName, "appearance-none pe-9")}
        aria-label={defaultLabel}
      >
        <option value="">{defaultLabel}</option>
        {children}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]"
        aria-hidden
      />
    </div>
  );
}
