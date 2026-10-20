import Image from "next/image";
import Link from "next/link";

import { PLACEHOLDER_IMAGES } from "@/lib/constants/placeholder-images";

export function PromoCard({
  title,
  description,
  ctaLabel,
}: {
  title: string;
  description: string;
  ctaLabel: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] shadow-[var(--card-shadow)]">
      <div className="relative aspect-[16/7] w-full bg-[var(--surface-elevated)]">
        <Image
          src={PLACEHOLDER_IMAGES.promo}
          alt=""
          fill
          className="object-cover"
          sizes="320px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050a14]/85 via-[#050a14]/25 to-transparent" />
      </div>
      <div className="space-y-2 p-5">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
          {description}
        </p>
        <Link
          href="/explore"
          className="inline-flex items-center gap-1.5 pt-1 text-sm font-medium text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)]"
        >
          {ctaLabel}
          <span aria-hidden className="rtl:rotate-180">→</span>
        </Link>
      </div>
    </div>
  );
}
