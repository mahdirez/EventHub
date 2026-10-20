"use client";

import { HeartIcon } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { useI18n } from "@/components/i18n-provider";
import { toggleFavoriteAction } from "@/lib/actions/favorites";
import { cn } from "@/lib/utils";

export function EventFavoriteButton({
  eventId,
  initialFavorited,
  isAuthenticated,
}: {
  eventId: string;
  initialFavorited: boolean;
  isAuthenticated: boolean;
}) {
  const { t } = useI18n();
  const [favorited, setFavorited] = useState(initialFavorited);
  const [pending, startTransition] = useTransition();

  if (!isAuthenticated) {
    return (
      <Link
        href="/auth/sign-in"
        aria-label={t("favorites.signInToSave")}
        title={t("favorites.signInToSave")}
        className="absolute end-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50"
      >
        <HeartIcon className="size-4" aria-hidden />
      </Link>
    );
  }

  return (
    <button
      type="button"
      disabled={pending}
      aria-label={
        favorited ? t("favorites.remove") : t("favorites.add")
      }
      aria-pressed={favorited}
      className="absolute end-3 top-3 inline-flex size-9 items-center justify-center rounded-full bg-black/35 text-white backdrop-blur-sm transition hover:bg-black/50 disabled:opacity-60"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        startTransition(async () => {
          const result = await toggleFavoriteAction(eventId);
          if (result?.error) {
            toast.error(result.error);
            return;
          }
          if (result?.success) {
            toast.success(result.success);
            setFavorited((value) => !value);
          }
        });
      }}
    >
      <HeartIcon
        className={cn(
          "size-4",
          favorited && "fill-red-500 text-red-500",
        )}
      />
    </button>
  );
}
