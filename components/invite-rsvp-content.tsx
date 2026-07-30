import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import type { RsvpStatus as PrismaRsvpStatus } from "@/app/generated/prisma/enums";
import { Badge } from "./ui/badge";
import { notFound } from "next/navigation";
import { Field, FieldGroup, FieldLabel, FieldSet } from "./ui/field";
import { Input } from "./ui/input";
import { submitOrUpdateRsvpAction } from "@/lib/actions/events";

export async function InviteRsvpContent({
  token,
  submitted,
}: {
  token: string;
  submitted: boolean;
}) {
  const invites = await prisma.eventInvite.findMany();

  console.log(invites);
  const row = await prisma.eventInvite.findFirst({
    where: {
      token,
    },
    include: {
      event: {
        select: {
          id: true,
          title: true,
          description: true,
          location: true,
          eventDate: true,
        },
      },
    },
  });

  if (!row) {
    notFound();
  }

  const e = row.event;
  const event = {
    title: e.title,
    description: e.description,
    location: e.location,
    eventDate: e.eventDate ? e.eventDate.toISOString() : null,
  };

  const submitRsvpForToken = submitOrUpdateRsvpAction.bind(null, token);
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader className="space-y-3">
          <Badge variant={"secondary"} className="w-fit">
            RSVP
          </Badge>
          <CardTitle>{event.title}</CardTitle>
          <p className="text-sm text-[var(--muted-foreground)]">
            {event.eventDate
              ? new Date(event.eventDate).toLocaleString()
              : "No date selected."}
          </p>
          {event.description ? (
            <p className="text-sm text-[var(--muted-foreground)]">
              {event.description}
            </p>
          ) : null}
        </CardHeader>
        <CardContent>
          {submitted ? (
            <p className="mb-4 rounded-md border border-[var(--accent)]/50 bg-[var(--surface)]/15 p-3">
              Your RSVP has been recorded.
            </p>
          ) : null}
          <form action={submitRsvpForToken}>
            <FieldGroup>
              <FieldSet>
                <Field>
                  <FieldLabel htmlFor="name">Name</FieldLabel>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Your Name"
                    required
                  />
                </Field>
              </FieldSet>
              <FieldSet>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                  />
                </Field>
              </FieldSet>
              <FieldSet>
                <Field>
                  <FieldLabel htmlFor="status">Attendance</FieldLabel>
                  <select
                    id="status"
                    name="status"
                    required
                    defaultValue="going"
                    className="flex h-10 w-full rounded-md border border-[var(--border)] bg-[var(--surface)] px-3"
                  >
                    <option value="going">Going</option>
                    <option value="maybe">Maybe</option>
                    <option value="not_going">Not going</option>
                  </select>
                </Field>
              </FieldSet>
              <Button type="submit" className="w-fit">
                Submit RSVP
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
