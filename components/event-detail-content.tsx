import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Link2Icon, UsersIcon, DownloadIcon } from "lucide-react";
import { countByStatus } from "./dashboard-content";
import { Button } from "./ui/button";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { EmptyState } from "./empty-state";
import { createInviteLinkAction, deleteEventAction } from "@/lib/actions/events";
import { formatCapacityLabel } from "@/lib/event-capacity";
import { formatEventSchedule, formatRsvpStatus } from "@/lib/copy";
import { DeleteEventDialog } from "./delete-event-dialog";
import { CopyInviteLinkButton } from "./copy-invite-link-button";
import { GenerateInviteForm } from "./generate-invite-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export async function EventDetailContent({
  eventId,
  userId,
}: {
  eventId: string;
  userId: string;
}) {
  const row = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: {
      id: true,
      title: true,
      description: true,
      location: true,
      eventDate: true,
      capacity: true,
      invites: { select: { token: true } },
      rsvps: { select: { status: true } },
    },
  });

  if (!row) {
    notFound();
  }

  const counts = countByStatus(row.rsvps);

  const event = {
    id: row.id,
    title: row.title,
    description: row.description,
    location: row.location,
    eventDate: row.eventDate ? row.eventDate.toISOString() : null,
    capacity: row.capacity,
    inviteToken: row.invites?.token ?? null,
    goingCount: counts.goingCount,
    maybeCount: counts.maybeCount,
    notGoingCount: counts.notGoingCount,
  };

  const rsvpRows = await prisma.eventRsvp.findMany({
    where: { eventId },
    orderBy: { respondedAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      respondedAt: true,
    },
  });

  const rsvps = rsvpRows.map((rsvp) => ({
    id: rsvp.id,
    name: rsvp.name,
    email: rsvp.email,
    status: rsvp.status,
    respondedAt: rsvp.respondedAt.toISOString(),
  }));

  const createInviteActionForEvent = createInviteLinkAction.bind(
    null,
    event.id,
  );
  const deleteEventActionForEvent = deleteEventAction.bind(null, event.id);

  const inviteUrl = event.inviteToken
    ? `/invite/${event.inviteToken}`
    : null;
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="text-2xl font-semibold tracking-tight">
            {event.title}
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            {formatEventSchedule(event.eventDate, event.location)}
          </p>
          {event.description && (
            <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
              {event.description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard">Back</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={`/events/${event.id}/edit`}>Edit event</Link>
          </Button>
          <DeleteEventDialog
            action={deleteEventActionForEvent}
            eventTitle={event.title}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge>Going: {event.goingCount}</Badge>
        <Badge variant={"secondary"}>Maybe: {event.maybeCount}</Badge>
        <Badge variant="outline">Not going: {event.notGoingCount}</Badge>
        {formatCapacityLabel(event.capacity, event.goingCount) ? (
          <Badge variant="outline">
            Capacity: {formatCapacityLabel(event.capacity, event.goingCount)}
          </Badge>
        ) : null}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Invite link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[var(--muted-foreground)]">
            Share this link with guests so they can RSVP without creating an
            account.
          </p>
          {inviteUrl ? (
            <div className="flex flex-wrap items-center gap-2">
              <div className="min-w-0 flex-1 rounded-md border border-[var(--border)] bg-[var(--surface)] p-3 text-sm break-all">
                {inviteUrl}
              </div>
              <CopyInviteLinkButton token={event.inviteToken} />
            </div>
          ) : (
            <EmptyState
              icon={Link2Icon}
              title="No invite link yet"
              description="Generate a link and share it with guests so they can RSVP without an account."
              action={
                <GenerateInviteForm action={createInviteActionForEvent} />
              }
              className="py-6"
            />
          )}
          {inviteUrl ? (
            <GenerateInviteForm action={createInviteActionForEvent} />
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3">
          <CardTitle>Attendees</CardTitle>
          {rsvps.length > 0 ? (
            <Button asChild variant="outline" size="sm">
              <a href={`/api/events/${event.id}/attendees/export`}>
                <DownloadIcon />
                Export CSV
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <DownloadIcon />
              Export CSV
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {rsvps.length === 0 ? (
            <EmptyState
              icon={UsersIcon}
              title="No RSVPs yet"
              description={
                inviteUrl
                  ? "Share your invite link with guests. Their responses will appear here as they RSVP."
                  : "Generate an invite link first, then share it with guests to start collecting responses."
              }
              className="py-6"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map((rsvp) => (
                  <TableRow key={rsvp.id}>
                    <TableCell>{rsvp.name}</TableCell>
                    <TableCell>{rsvp.email}</TableCell>
                    <TableCell>
                      <Badge>{formatRsvpStatus(rsvp.status)}</Badge>
                    </TableCell>
                    <TableCell>{new Date(rsvp.respondedAt).toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
