import {
  buildAttendeesCsv,
  getAttendeesExportFilename,
} from "@/lib/export-attendees";
import { getSession } from "@/lib/auth/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  context: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await context.params;
  const session = await getSession();
  const userId = session.data?.user?.id;

  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  const event = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: { title: true },
  });

  if (!event) {
    return new Response("Not found", { status: 404 });
  }

  const rsvps = await prisma.eventRsvp.findMany({
    where: { eventId },
    orderBy: { respondedAt: "desc" },
    select: {
      name: true,
      email: true,
      status: true,
      respondedAt: true,
    },
  });

  const csv = buildAttendeesCsv(rsvps);
  const filename = getAttendeesExportFilename(event.title);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
