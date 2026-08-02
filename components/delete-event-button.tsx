"use client";

import { Button } from "@/components/ui/button";

type DeleteEventButtonProps = {
  action: () => Promise<void>;
  eventTitle: string;
};

export function DeleteEventButton({
  action,
  eventTitle,
}: DeleteEventButtonProps) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Delete "${eventTitle}"? This will permanently remove the event, invite link, and all RSVPs.`,
        );

        if (!confirmed) {
          event.preventDefault();
        }
      }}
    >
      <Button type="submit" variant="destructive">
        Delete event
      </Button>
    </form>
  );
}
