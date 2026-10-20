import {
  ChartColumnIncreasingIcon,
  Link2Icon,
  UserPlusIcon,
} from "lucide-react";

import { PrimaryButton } from "@/components/design-system/primary-button";

export function CreateEventSidebar({
  title,
  description,
  ctaLabel,
  features,
}: {
  title: string;
  description: string;
  ctaLabel: string;
  features: {
    registration: string;
    invite: string;
    track: string;
  };
}) {
  const items = [
    { icon: UserPlusIcon, label: features.registration },
    { icon: Link2Icon, label: features.invite },
    { icon: ChartColumnIncreasingIcon, label: features.track },
  ];

  return (
    <div
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--card-shadow)] sm:p-6"
    >
      <div className="space-y-2">
        <h3 className="text-base font-semibold text-foreground sm:text-lg">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
          {description}
        </p>
      </div>
      <PrimaryButton href="/events/new" className="mt-4 w-full sm:mt-5">
        {ctaLabel}
      </PrimaryButton>
      <ul className="mt-5 space-y-3 border-t border-[var(--border)] pt-5 sm:mt-6 sm:space-y-3.5">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-sm">
            <span
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent)]"
            >
              <Icon className="size-4" aria-hidden />
            </span>
            <span className="leading-snug text-[var(--muted-foreground)]">
              {label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
