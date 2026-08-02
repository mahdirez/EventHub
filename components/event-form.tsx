import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toDatetimeLocalValue } from "@/lib/event-datetime";

type EventFormValues = {
  title: string;
  description?: string | null;
  location?: string | null;
  eventDate?: Date | string | null;
};

type EventFormProps = {
  title: string;
  submitLabel: string;
  cancelHref: string;
  action: (formData: FormData) => Promise<void>;
  defaultValues?: EventFormValues;
};

export function EventForm({
  title,
  submitLabel,
  cancelHref,
  action,
  defaultValues,
}: EventFormProps) {
  return (
    <div className="mx-auto w-full max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={action}>
            <FieldGroup>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="title">Title</FieldLabel>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Team dinner"
                      defaultValue={defaultValues?.title ?? ""}
                      required
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="description">Description</FieldLabel>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="Optional details about the event"
                      defaultValue={defaultValues?.description ?? ""}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="location">Location</FieldLabel>
                    <Input
                      id="location"
                      name="location"
                      placeholder="Optional location"
                      defaultValue={defaultValues?.location ?? ""}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <FieldSet>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="eventDate">Date and time</FieldLabel>
                    <Input
                      id="eventDate"
                      name="eventDate"
                      type="datetime-local"
                      defaultValue={toDatetimeLocalValue(defaultValues?.eventDate)}
                    />
                  </Field>
                </FieldGroup>
              </FieldSet>
              <div className="flex items-center gap-3">
                <Button type="submit">{submitLabel}</Button>
                <Button type="button" variant="outline" asChild>
                  <Link href={cancelHref}>Cancel</Link>
                </Button>
              </div>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
