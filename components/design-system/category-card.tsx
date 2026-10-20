import {
  BriefcaseIcon,
  CpuIcon,
  GraduationCapIcon,
  Music2Icon,
  PaletteIcon,
  TrophyIcon,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import type { MockCategoryId } from "@/lib/constants/mock-discovery";
import { cn } from "@/lib/utils";

const categoryIcons: Record<MockCategoryId, LucideIcon> = {
  technology: CpuIcon,
  music: Music2Icon,
  business: BriefcaseIcon,
  art: PaletteIcon,
  education: GraduationCapIcon,
  sports: TrophyIcon,
};

const categoryAccent: Record<MockCategoryId, string> = {
  technology: "text-sky-400 bg-sky-500/10",
  music: "text-violet-400 bg-violet-500/10",
  business: "text-emerald-400 bg-emerald-500/10",
  art: "text-pink-400 bg-pink-500/10",
  education: "text-amber-400 bg-amber-500/10",
  sports: "text-orange-400 bg-orange-500/10",
};

export function CategoryCard({
  id,
  name,
  eventsLabel,
}: {
  id: MockCategoryId;
  name: string;
  eventsLabel: string;
}) {
  const Icon = categoryIcons[id];

  return (
    <Link
      href={`/categories/${id}`}
      className={cn(
        "flex h-full min-h-[7.5rem] flex-col gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4",
        "shadow-[var(--card-shadow)] transition-[border-color,background-color] duration-200",
        "hover:border-[var(--accent-muted)]/40 hover:bg-[var(--surface-elevated)]",
      )}
    >
      <span
        className={cn(
          "inline-flex size-10 shrink-0 items-center justify-center rounded-xl",
          categoryAccent[id],
        )}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="mt-auto space-y-0.5">
        <p className="text-sm font-semibold leading-snug text-foreground">
          {name}
        </p>
        <p className="text-xs text-[var(--muted-foreground)]">{eventsLabel}</p>
      </div>
    </Link>
  );
}
