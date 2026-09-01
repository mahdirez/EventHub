import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getTranslations } from "@/lib/i18n/server";

export default async function Home() {
  const { t } = await getTranslations();

  return (
    <div className="flex flex-1 flex-col gap-8">
      <section className="space-y-4">
        <Badge variant="secondary" className="w-fit">
          {t("home.badge")}
        </Badge>
        <h1 className="text-4xl font-semibold tracking-tight">
          {t("home.title")}
        </h1>
        <p className="max-w-2xl text-[var(--muted-foreground)]">
          {t("home.description")}
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/auth/sign-up">{t("home.createAccount")}</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/auth/sign-in">{t("home.signIn")}</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/dashboard">{t("home.openDashboard")}</Link>
          </Button>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t("home.featureCreateTitle")}</CardTitle>
            <CardDescription>{t("home.featureCreateDescription")}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("home.featureShareTitle")}</CardTitle>
            <CardDescription>{t("home.featureShareDescription")}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t("home.featureTrackTitle")}</CardTitle>
            <CardDescription>{t("home.featureTrackDescription")}</CardDescription>
          </CardHeader>
          <CardContent className="text-sm text-[var(--muted-foreground)]">
            {t("home.featureTrackNote")}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
