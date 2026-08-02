import { EventForm } from "@/components/event-form";
import { createEventAction } from "@/lib/actions/events";

export default function NewEventPage() {
  return (
    <EventForm
      title="Create Event"
      submitLabel="Create event"
      cancelHref="/dashboard"
      action={createEventAction}
    />
  );
}
