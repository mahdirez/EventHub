import { PageContainer } from "@/components/layout/page-container";
import { CategoryCard } from "@/components/design-system/category-card";
import { createPageMetadata } from "@/lib/metadata";
import { getTranslations } from "@/lib/i18n/server";
import { getDiscoveryCategories } from "@/lib/services/discovery.service";

export async function generateMetadata() {
  const { t } = await getTranslations();

  return createPageMetadata({
    title: t("discovery.categoriesPageTitle"),
    description: t("discovery.categoriesPageDescription"),
  });
}

export default async function CategoriesPage() {
  const { t } = await getTranslations();
  const categories = await getDiscoveryCategories();

  return (
    <PageContainer className="max-w-[1440px] gap-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          {t("discovery.categoriesPageTitle")}
        </h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          {t("discovery.categoriesPageDescription")}
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <CategoryCard
            key={category.id}
            id={category.id}
            name={t(`discovery.categories.${category.id}`)}
            eventsLabel={t("discovery.eventsCount", {
              count: category.eventCount,
            })}
          />
        ))}
      </div>
    </PageContainer>
  );
}
