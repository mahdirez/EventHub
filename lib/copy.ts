import type { RsvpStatus } from "@/app/generated/prisma/enums";
import type { Dictionary } from "@/lib/i18n";

export function formatRsvpStatus(
  status: RsvpStatus | string,
  labels: Dictionary["rsvp"]["status"],
): string {
  switch (status) {
    case "going":
      return labels.going;
    case "maybe":
      return labels.maybe;
    case "not_going":
      return labels.notGoing;
    default:
      return status;
  }
}

export function formatEventSchedule(
  eventDate: string | null,
  noDateLabel: string,
  location?: string | null,
): string {
  const datePart = eventDate
    ? new Date(eventDate).toLocaleString()
    : noDateLabel;

  if (!location) {
    return datePart;
  }

  return `${datePart} · ${location}`;
}
