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
    <form
      onSubmit={onSubmit}
      className={className}
    >
      <div className="glass-panel flex flex-col gap-3 rounded-2xl p-3 lg:flex-row lg:items-center lg:gap-2">
        <label className="relative flex min-h-11 flex-1 items-center">
          <SearchIcon
            className="pointer-events-none absolute start-3 size-4 text-[var(--muted-foreground)]"
            aria-hidden
          />
          <input
            name="q"
            type="search"
            defaultValue={defaultValues?.q ?? ""}
            placeholder={t("discovery.searchPlaceholder")}
            className="h-11 w-full rounded-xl border border-transparent bg-[var(--surface-elevated)] ps-10 pe-3 text-sm text-foreground placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--accent-muted)]/50"
          />
        </label>
        <div className="flex flex-wrap gap-2 lg:flex-nowrap">
          <FilterSelect
            name="date"
            icon={CalendarIcon}
            defaultLabel={t("discovery.anyDate")}
            defaultValue={defaultValues?.date ?? ""}
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
          >
            {categoryIds.map((id) => (
              <option key={id} value={id}>
                {t(`discovery.categories.${id}`)}
              </option>
            ))}
          </FilterSelect>
          <PrimaryButton type="submit" className="w-full lg:w-auto" showArrow>
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
}: {
  name: string;
  icon: typeof CalendarIcon;
  defaultLabel: string;
  defaultValue: string;
  children?: React.ReactNode;
  isTextInput?: boolean;
}) {
  if (isTextInput) {
    return (
      <div className="relative min-w-[140px] flex-1 lg:flex-none">
        <Icon
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]"
          aria-hidden
        />
        <input
          name={name}
          type="text"
          defaultValue={defaultValue}
          placeholder={defaultLabel}
          className="h-11 w-full rounded-xl border border-transparent bg-[var(--surface-elevated)] ps-10 pe-3 text-sm text-foreground placeholder:text-[var(--muted-foreground)] outline-none focus:border-[var(--accent-muted)]/50"
        />
      </div>
    );
  }

  return (
    <div className="relative min-w-[140px] flex-1 lg:flex-none">
      <Icon
        className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]"
        aria-hidden
      />
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-11 w-full appearance-none rounded-xl border border-transparent bg-[var(--surface-elevated)] ps-10 pe-8 text-sm text-foreground outline-none focus:border-[var(--accent-muted)]/50"
        aria-label={defaultLabel}
      >
        <option value="">{defaultLabel}</option>
        {children}
      </select>
      <ChevronDownIcon
        className="pointer-events-none absolute end-2 top-1/2 size-4 -translate-y-1/2 text-[var(--muted-foreground)]"
        aria-hidden
      />
    </div>
  );
}
