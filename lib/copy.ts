import type { RsvpStatus } from "@/app/generated/prisma/enums";

export const NO_DATE_LABEL = "No date set";

export function formatRsvpStatus(status: RsvpStatus | string): string {
  switch (status) {
    case "going":
      return "Going";
    case "maybe":
      return "Maybe";
    case "not_going":
      return "Not going";
    default:
      return status;
  }
}

export function formatEventSchedule(
  eventDate: string | null,
  location?: string | null,
): string {
  const datePart = eventDate
    ? new Date(eventDate).toLocaleString()
    : NO_DATE_LABEL;

  if (!location) {
    return datePart;
  }

  return `${datePart} · ${location}`;
}
