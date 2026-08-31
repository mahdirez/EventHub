import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { submitOrUpdateRsvpAction } from "@/lib/actions/events";
import { formatCapacityLabel } from "@/lib/event-capacity";
import { formatEventSchedule } from "@/lib/copy";
import { countByStatus } from "./dashboard-content";
import { InviteRsvpForm } from "./invite-rsvp-form";

export async function InviteRsvpContent({
  token,
  submitted,
  email,
}: {
  token: string;
  submitted: boolean;
  email?: string;
}) {
  const row = await prisma.eventInvite.findFirst({
    where: {
      token,
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          eventDate: true,
          capacity: true,
          rsvps: { select: { status: true } },
        },
      },
    },
  });

  if (!row) {
    notFound();
  }

  const e = row.event;
  const { goingCount } = countByStatus(e.rsvps);
  const capacityLabel = formatCapacityLabel(e.capacity, goingCount);
  const event = {
    title: e.title,
    description: e.description,
    location: e.location,
    eventDate: e.eventDate ? e.eventDate.toISOString() : null,
  };

  const submitRsvpForToken = submitOrUpdateRsvpAction.bind(null, token);

  const existingRsvp = email
    ? await prisma.eventRsvp.findFirst({
        where: {
          eventId: e.id,
          emailNormalized: email.trim().toLocaleLowerCase(),
        },
        select: {
          name: true,
          email: true,
          status: true,
        },
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader className="space-y-3">
          <Badge variant={"secondary"} className="w-fit">
            RSVP
          </Badge>
          <CardTitle>{event.title}</CardTitle>
          <p className="text-sm text-[var(--muted-foreground)]">
            {formatEventSchedule(event.eventDate, event.location)}
          </p>
          {event.description ? (
            <p className="text-sm text-[var(--muted-foreground)]">
              {event.description}
            </p>
          ) : null}
          {capacityLabel ? (
            <Badge variant="outline" className="w-fit">
              Capacity: {capacityLabel}
            </Badge>
          ) : null}
        </CardHeader>
        <CardContent>
          <InviteRsvpForm
            token={token}
            action={submitRsvpForToken}
            submitted={submitted}
            existingRsvp={existingRsvp}
            capacity={e.capacity}
            goingCount={goingCount}
          />
        </CardContent>
      </Card>
    </div>
  );
}
