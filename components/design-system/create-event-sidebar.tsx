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
    <aside
      className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--card-shadow)]"
    >
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
        {description}
      </p>
      <PrimaryButton href="/events/new" className="mt-5 w-full">
        {ctaLabel}
      </PrimaryButton>
      <ul className="mt-6 space-y-4">
        {items.map(({ icon: Icon, label }) => (
          <li key={label} className="flex items-center gap-3 text-sm">
            <span
              className="inline-flex size-9 items-center justify-center rounded-xl bg-[var(--accent)]/10 text-[var(--accent-muted)]"
            >
              <Icon className="size-4" aria-hidden />
            </span>
            <span className="text-[var(--muted-foreground)]">{label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
