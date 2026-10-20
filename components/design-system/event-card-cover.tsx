"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function EventCardCover({
  imageUrl,
  fallbackUrl,
  title,
  className,
}: {
  imageUrl: string;
  fallbackUrl: string;
  title: string;
  className?: string;
}) {
  const [src, setSrc] = useState(imageUrl);

  return (
    <div className={cn("relative aspect-[16/10] w-full bg-[var(--surface-elevated)]", className)}>
      <Image
        src={src}
        alt={title}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
        onError={() => {
          if (src !== fallbackUrl) {
            setSrc(fallbackUrl);
          }
        }}
      />
    </div>
  );
}
