"use client";

import { useEffect } from "react";
import { AlertTriangleIcon } from "lucide-react";

import { useI18n } from "@/components/i18n-provider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useI18n();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-1 items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex size-10 items-center justify-center rounded-md bg-destructive/10">
            <AlertTriangleIcon className="size-5 text-destructive" />
          </div>
          <CardTitle>{t("error.title")}</CardTitle>
          <CardDescription>{t("error.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap justify-center gap-3">
          <Button onClick={reset}>{t("error.tryAgain")}</Button>
          <Button variant="outline" asChild>
            <a href="/dashboard">{t("error.goDashboard")}</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
