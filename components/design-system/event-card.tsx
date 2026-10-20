"use client";

import { HeartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { MockCategoryId } from "@/lib/constants/mock-discovery";
import { cn } from "@/lib/utils";

const categoryBadgeStyles: Record<MockCategoryId, string> = {
  technology: "bg-sky-500/90 text-white",
  music: "bg-violet-500/90 text-white",
  business: "bg-emerald-500/90 text-white",
  art: "bg-pink-500/90 text-white",
  education: "bg-amber-500/90 text-white",
  sports: "bg-orange-500/90 text-white",
};

export function EventCard({
  title,
  categoryId,
  categoryName,
  imageUrl,
  scheduleLabel,
  description,
  rsvpLabel,
  viewDetailsLabel,
  href,
}: {
  title: string;
  categoryId: MockCategoryId;
  categoryName: string;
  imageUrl: string;
  scheduleLabel: string;
  description: string;
  rsvpLabel: string;
  viewDetailsLabel: string;
  href: string;
}) {
  const [liked, setLiked] = useState(false);

  return (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)]",
        "shadow-[var(--card-shadow)]",
      )}
    >
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 320px"
        />
        <span
          className={cn(
            "absolute start-3 top-3 rounded-md px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
            categoryBadgeStyles[categoryId],
          )}
        >
          {categoryName}
        </span>
        <button
          type="button"
          aria-label="Favorite"
          className="absolute end-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50"
          onClick={() => setLiked((value) => !value)}
        >
          <HeartIcon
            className={cn("size-4", liked && "fill-red-500 text-red-500")}
          />
        </button>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div>
          <h3 className="text-base font-semibold text-foreground">{title}</h3>
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">
            {scheduleLabel}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 rtl:space-x-reverse">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="inline-flex size-7 items-center justify-center rounded-full border-2 border-[var(--surface)] bg-[var(--surface-elevated)] text-[10px] font-medium text-[var(--muted-foreground)]"
              >
                {String.fromCharCode(65 + index)}
              </span>
            ))}
          </div>
          <span className="text-xs text-[var(--muted-foreground)]">
            {rsvpLabel}
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-[var(--muted-foreground)]">
          {description}
        </p>
        <Link
          href={href}
          className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-[var(--accent-muted)] hover:text-[var(--accent)]"
        >
          {viewDetailsLabel}
          <span aria-hidden className="rtl:rotate-180">→</span>
        </Link>
      </div>
    </article>
  );
}
