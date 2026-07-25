import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

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
            Track attendance responses and manage invite links.
          </p>
        </div>
        <Button asChild>
          <Link href="/events/new">Create event</Link>
        </Button>
      </div>

      {/* {list of events} */}

      {events.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No events yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[var(--muted-foreground)]">
              Create your first event to start collecting RSVPs.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {events.map((event) => (
            <Card key={event.id}>
              <CardHeader className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <Button asChild size="sm">
                    <Link href={`/events/${event.id}`}>View Details</Link>
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 text-xs">
                  <Badge variant={"secondary"} />
                  <Badge variant={"secondary"} />
                  <Badge variant={"secondary"} />
                </div>
                <p>
                  {event.eventDate
                    ? new Date(event.eventDate).toLocaleString()
                    : "No date"}
                  {event.location ? ` - ${event.location}` : ""}
                </p>
              </CardHeader>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
