import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export async function DashboardContent({ userId }: { userId: string }) {
  const rows = await prisma.event.findMany({
    where: {
      ownerUserId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      eventDate: true,
      location: true,
      //   rsvps: { select: { status: true } },
    },
  });

  const events = rows.map((row) => ({
    id: row.id,
    title: row.title,
    eventDate: row.eventDate ? row.eventDate.toISOString() : null,
    location: row.location,
    // rsvpCount: row.rsvps.length,
  }));
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight ">Your Event</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Tranck attence responses and manage invite links.
          </p>
        </div>
        <Button asChild>
          <Link href="/events/new">Create event</Link>
        </Button>
      </div>
    </div>
  );
}
