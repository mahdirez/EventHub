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
import { getTranslations } from "@/lib/i18n/server";
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
  const { t, dictionary } = await getTranslations();

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

  const capacityLabel = formatCapacityLabel(
    event.capacity,
    event.goingCount,
    t("badges.capacity"),
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-2">
          <div className="text-2xl font-semibold tracking-tight">
            {event.title}
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            {formatEventSchedule(
              event.eventDate,
              dictionary.common.noDateSet,
              event.location,
            )}
          </p>
          {event.description && (
            <p className="max-w-2xl text-sm text-[var(--muted-foreground)]">
              {event.description}
            </p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button asChild variant="outline">
            <Link href="/dashboard">{t("common.back")}</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link href={`/events/${event.id}/edit`}>{t("common.editEvent")}</Link>
          </Button>
          <DeleteEventDialog
            action={deleteEventActionForEvent}
            eventTitle={event.title}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2 text-xs">
        <Badge>{t("badges.going", { count: event.goingCount })}</Badge>
        <Badge variant="secondary">
          {t("badges.maybe", { count: event.maybeCount })}
        </Badge>
        <Badge variant="outline">
          {t("badges.notGoing", { count: event.notGoingCount })}
        </Badge>
        {capacityLabel ? (
          <Badge variant="outline">
            {t("common.capacity")}: {capacityLabel}
          </Badge>
        ) : null}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("common.inviteLink")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[var(--muted-foreground)]">
            {t("event.inviteDescription")}
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
              title={t("event.noInviteTitle")}
              description={t("event.noInviteDescription")}
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
          <CardTitle>{t("common.attendees")}</CardTitle>
          {rsvps.length > 0 ? (
            <Button asChild variant="outline" size="sm">
              <a href={`/api/events/${event.id}/attendees/export`}>
                <DownloadIcon />
                {t("common.exportCsv")}
              </a>
            </Button>
          ) : (
            <Button variant="outline" size="sm" disabled>
              <DownloadIcon />
              {t("common.exportCsv")}
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {rsvps.length === 0 ? (
            <EmptyState
              icon={UsersIcon}
              title={t("event.noRsvpsTitle")}
              description={
                inviteUrl
                  ? t("event.noRsvpsWithLink")
                  : t("event.noRsvpsWithoutLink")
              }
              className="py-6"
            />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("table.name")}</TableHead>
                  <TableHead>{t("table.email")}</TableHead>
                  <TableHead>{t("table.status")}</TableHead>
                  <TableHead>{t("table.updated")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rsvps.map((rsvp) => (
                  <TableRow key={rsvp.id}>
                    <TableCell>{rsvp.name}</TableCell>
                    <TableCell>{rsvp.email}</TableCell>
                    <TableCell>
                      <Badge>
                        {formatRsvpStatus(rsvp.status, dictionary.rsvp.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(rsvp.respondedAt).toLocaleDateString()}
                    </TableCell>
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
