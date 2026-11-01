import {
  BriefcaseIcon,
  CpuIcon,
  GraduationCapIcon,
  Music2Icon,
  PaletteIcon,
  TagIcon,
  TrophyIcon,
  type LucideIcon,
} from "lucide-react";

import { PLACEHOLDER_IMAGES } from "@/lib/constants/placeholder-images";

const categoryIcons: Record<string, LucideIcon> = {
  technology: CpuIcon,
  music: Music2Icon,
  business: BriefcaseIcon,
  art: PaletteIcon,
  education: GraduationCapIcon,
  sports: TrophyIcon,
};

const categoryAccent: Record<string, string> = {
  technology: "text-sky-400 bg-sky-500/10",
  music: "text-violet-400 bg-violet-500/10",
  business: "text-emerald-400 bg-emerald-500/10",
  art: "text-pink-400 bg-pink-500/10",
  education: "text-amber-400 bg-amber-500/10",
  sports: "text-orange-400 bg-orange-500/10",
};

const categoryBadgeStyles: Record<string, string> = {
  technology: "bg-sky-500/90 text-white",
  music: "bg-violet-500/90 text-white",
  business: "bg-emerald-500/90 text-white",
  art: "bg-pink-500/90 text-white",
  education: "bg-amber-500/90 text-white",
  sports: "bg-orange-500/90 text-white",
};

const categoryCoverFallback: Record<string, string> = {
  technology: PLACEHOLDER_IMAGES.events.technology,
  music: PLACEHOLDER_IMAGES.events.music,
  business: PLACEHOLDER_IMAGES.events.business,
  art: PLACEHOLDER_IMAGES.events.art,
  education: PLACEHOLDER_IMAGES.events.education,
  sports: PLACEHOLDER_IMAGES.events.sports,
};

const DEFAULT_ACCENT = "text-[var(--accent-muted)] bg-[var(--accent)]/10";
const DEFAULT_BADGE = "bg-[var(--accent-muted)]/90 text-white";
const DEFAULT_COVER = PLACEHOLDER_IMAGES.events.technology;

export function getCategoryIcon(slug: string): LucideIcon {
  return categoryIcons[slug] ?? TagIcon;
}

export function getCategoryAccentClass(slug: string): string {
  return categoryAccent[slug] ?? DEFAULT_ACCENT;
}

export function getCategoryBadgeClass(slug: string): string {
  return categoryBadgeStyles[slug] ?? DEFAULT_BADGE;
}

export function getCategoryCoverFallback(slug: string): string {
  return categoryCoverFallback[slug] ?? DEFAULT_COVER;
}
