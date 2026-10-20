import { DiscoveryEventGridSkeleton } from "@/components/design-system/discovery-event-grid-skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryDetailLoading() {
  return (
    <PageContainer className="max-w-[1440px] gap-8">
      <Skeleton className="h-9 w-48" />
      <DiscoveryEventGridSkeleton count={6} />
    </PageContainer>
  );
}
