import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { CalendarDaysIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { EmptyState } from "./empty-state";
import type { RsvpStatus as PrismaRsvpStatus } from "@/app/generated/prisma/enums";
import { formatEventSchedule } from "@/lib/copy";
import { Badge } from "./ui/badge";

export function countByStatus(rsvps: { status: PrismaRsvpStatus }[]) {
  let goingCount = 0;
  let maybeCount = 0;
  let notGoingCount = 0;
  for (const r of rsvps) {
    if (r.status === "going") goingCount += 1;
    else if (r.status === "maybe") maybeCount += 1;
    else if (r.status === "not_going") notGoingCount += 1;
  }
  return { goingCount, maybeCount, notGoingCount };
}

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
      rsvps: { select: { status: true } },
    },
  });

  const events = rows.map(row => ({
    id: row.id,
    title: row.title,
    eventDate: row.eventDate ? row.eventDate.toISOString() : null,
    location: row.location,
    ...countByStatus(row.rsvps),
  }));
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your events</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            Track attendance responses and manage invite links.
          </p>
        </div>
        <Button asChild>
          <Link href="/events/new">Create event</Link>
        </Button>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={CalendarDaysIcon}
              title="No events yet"
              description="Create your first event, generate an invite link, and start collecting RSVPs from guests."
              action={
                <Button asChild>
                  <Link href="/events/new">Create your first event</Link>
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map(event => (
            <Card key={event.id}>
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Button asChild size="sm">
                    <Link href={`/events/${event.id}`}>View details</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant={"secondary"}>Going: {event.goingCount}</Badge>
                  <Badge variant={"secondary"}>Maybe: {event.maybeCount}</Badge>
                  <Badge variant="secondary">
                    Not going: {event.notGoingCount}
                  </Badge>
                </div>
                <p className="text-sm text-[var(--muted-foreground)]">
                  {formatEventSchedule(event.eventDate, event.location)}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
