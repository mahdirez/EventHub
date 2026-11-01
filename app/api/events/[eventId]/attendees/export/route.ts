import {
  buildAttendeesCsv,
  getAttendeesExportFilename,
} from "@/lib/export-attendees";
import { getSession } from "@/lib/auth/server";
import { getTranslations } from "@/lib/i18n/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  context: { params: Promise<{ eventId: string }> },
) {
  const { eventId } = await context.params;
  const session = await getSession();
  const userId = session.data?.user?.id;
  const { t, dictionary } = await getTranslations();

  if (!userId) {
    return new Response(t("api.unauthorized"), { status: 401 });
  }

  const event = await prisma.event.findFirst({
    where: { id: eventId, ownerUserId: userId },
    select: { title: true },
  });

  if (!event) {
    return new Response(t("api.notFound"), { status: 404 });
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

  const csv = buildAttendeesCsv(rsvps, {
    headers: dictionary.table,
    status: dictionary.rsvp.status,
  });
  const filename = getAttendeesExportFilename(event.title);

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
