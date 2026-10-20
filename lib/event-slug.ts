import { slugifyEventTitle } from "@/lib/slugify";
import { prisma } from "@/lib/prisma";

export { slugifyEventTitle } from "@/lib/slugify";

export async function ensureUniqueEventSlug(
  baseSlug: string,
  excludeEventId?: string,
): Promise<string> {
  const normalized = slugifyEventTitle(baseSlug) || "event";
  let candidate = normalized;
  let suffix = 0;

  while (true) {
    const existing = await prisma.event.findFirst({
      where: {
        slug: candidate,
        ...(excludeEventId ? { NOT: { id: excludeEventId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    suffix += 1;
    candidate = `${normalized}-${suffix}`;
  }
}
