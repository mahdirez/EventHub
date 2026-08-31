import { formatRsvpStatus } from "@/lib/copy";

type AttendeeRow = {
  name: string;
  email: string;
  status: string;
  respondedAt: Date;
};

function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function slugifyFilename(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "event";
}

export function buildAttendeesCsv(rows: AttendeeRow[]): string {
  const header = ["Name", "Email", "Status", "Responded at"];

  const lines = rows.map((row) =>
    [
      escapeCsvField(row.name),
      escapeCsvField(row.email),
      escapeCsvField(formatRsvpStatus(row.status)),
      escapeCsvField(row.respondedAt.toISOString()),
    ].join(","),
  );

  return `\uFEFF${[header.join(","), ...lines].join("\r\n")}`;
}

export function getAttendeesExportFilename(eventTitle: string): string {
  return `${slugifyFilename(eventTitle)}-attendees.csv`;
}
