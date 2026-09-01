import { formatRsvpStatus } from "@/lib/copy";
import type { Dictionary } from "@/lib/i18n";

type AttendeeRow = {
  name: string;
  email: string;
  status: string;
  respondedAt: Date;
};

type CsvLabels = {
  headers: Pick<Dictionary["table"], "name" | "email" | "status" | "respondedAt">;
  status: Dictionary["rsvp"]["status"];
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

export function buildAttendeesCsv(rows: AttendeeRow[], labels: CsvLabels): string {
  const header = [
    labels.headers.name,
    labels.headers.email,
    labels.headers.status,
    labels.headers.respondedAt,
  ];

  const lines = rows.map((row) =>
    [
      escapeCsvField(row.name),
      escapeCsvField(row.email),
      escapeCsvField(formatRsvpStatus(row.status, labels.status)),
      escapeCsvField(row.respondedAt.toISOString()),
    ].join(","),
  );

  return `\uFEFF${[header.join(","), ...lines].join("\r\n")}`;
}

export function getAttendeesExportFilename(eventTitle: string): string {
  return `${slugifyFilename(eventTitle)}-attendees.csv`;
}
