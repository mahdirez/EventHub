import { DiscoveryEventGridSkeleton } from "@/components/design-system/discovery-event-grid-skeleton";
import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ExploreLoading() {
  return (
    <PageContainer className="max-w-[1440px] gap-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <Skeleton className="h-24 w-full rounded-2xl" />
      <DiscoveryEventGridSkeleton count={6} />
    </PageContainer>
  );
}
