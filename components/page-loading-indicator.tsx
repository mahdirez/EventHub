"use client";

import { Spinner } from "@/components/ui/spinner";
import { useI18n } from "@/components/i18n-provider";

export function PageLoadingIndicator() {
  const { t } = useI18n();

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Spinner className="size-4" aria-label={t("a11y.loading")} />
      <span>{t("common.loading")}</span>
    </div>
  );
}
