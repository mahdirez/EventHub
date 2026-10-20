import { describe, expect, it } from "vitest";

import { createTranslator, getDictionary } from "@/lib/i18n";
import { createEventFormSchema } from "@/lib/validations/event";

describe("createEventFormSchema", () => {
  const t = createTranslator(getDictionary("en"));
  const schema = createEventFormSchema(t);

  it("requires category for public events", () => {
    const result = schema.safeParse({
      title: "My Event",
      description: "",
      location: "",
      eventDate: "",
      capacity: "",
      visibility: "public",
      categorySlug: "",
      city: "",
      coverImageUrl: "",
      slug: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((issue) => issue.message);
      expect(messages).toContain(
        "Please choose a category for public events.",
      );
    }
  });
});
