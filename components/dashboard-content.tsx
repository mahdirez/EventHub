import {Button} from "@/components/ui/button";
import Link from "next/link";

export function DashboardContent({ userId }: { userId: string }) {
    return <div className="flex flex-1 flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                  <h1 className="text-2xl font-semibold tracking-tight ">Your Event</h1>
                  <p className="text-sm text-[var(--muted-foreground)]">Tranck attence responses and manage invite links.</p>
              </div>
              <Button asChild>
                  <Link href="/event/new">Create event</Link>
              </Button>
          </div>
    </div>
}