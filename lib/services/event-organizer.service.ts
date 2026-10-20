import type { EventVisibility } from "@/app/generated/prisma/enums";
import { ensureUniqueEventSlug, slugifyEventTitle } from "@/lib/event-slug";
import type { EventFormInput } from "@/lib/validations/event";

export type EventWriteData = {
  title: string;
  description: string | null;
  location: string | null;
  city: string | null;
  eventDate: Date | null;
  capacity: number | null;
  visibility: EventVisibility;
  categorySlug: string | null;
  coverImageUrl: string | null;
  slug: string | null;
};

export async function buildEventWriteData(
  input: EventFormInput,
  options?: { excludeEventId?: string },
): Promise<EventWriteData> {
  const visibility = input.visibility;
  const categorySlug =
    visibility === "public" ? input.categorySlug ?? null : null;

  let slug: string | null = null;
  if (visibility === "public") {
    const base = input.slug?.trim() || slugifyEventTitle(input.title);
    if (base) {
      slug = await ensureUniqueEventSlug(base, options?.excludeEventId);
    }
  }

  return {
    title: input.title,
    description: input.description,
    location: input.location,
    city: input.city,
    eventDate: input.eventDate ? new Date(input.eventDate) : null,
    capacity: input.capacity,
    visibility,
    categorySlug,
    coverImageUrl: input.coverImageUrl,
    slug,
  };
}
