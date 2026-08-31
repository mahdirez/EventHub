import { EventForm } from "@/components/event-form";
import { createEventAction } from "@/lib/actions/events";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Create event",
  description: "Add a new event with title, date, location, and details.",
});

export default function NewEventPage() {
  return (
    <EventForm
      title="Create event"
      submitLabel="Create event"
      pendingLabel="Creating..."
      cancelHref="/dashboard"
      action={createEventAction}
    />
  );
}
