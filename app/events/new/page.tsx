import { EventForm } from "@/components/event-form";
import { createEventAction } from "@/lib/actions/events";

export default function NewEventPage() {
  return (
    <EventForm
      title="Create Event"
      submitLabel="Create event"
      pendingLabel="Creating..."
      cancelHref="/dashboard"
      action={createEventAction}
    />
  );
}
