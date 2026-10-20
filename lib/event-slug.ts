import { prisma } from "@/lib/prisma";

export function slugifyEventTitle(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug.slice(0, 80);
}

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
