import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import {Input} from "@/components/ui/input";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import Link from "next/link";

export default async function NewEventPage() {
    return <div className="mx-auto w-full max-w-2xl">

        <Card>
            <CardHeader>

                <CardTitle>Create Event</CardTitle>

            </CardHeader>
            <CardContent>
                <form>
                    <FieldGroup>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="title">
                                       Title
                                    </FieldLabel>
                                    <Input
                                        id="title"
                                        placeholder="Team dinner"
                                        required
                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="description">
                                        Description
                                    </FieldLabel>
                                    <Textarea id="description" placeholder="Optional details about the event"/>
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="location">
                                        Location
                                    </FieldLabel>
                                    <Input
                                        id="location"
                                        placeholder="Optional location"
                                    />
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <FieldSet>
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="eventDate">
                                        Date and time
                                    </FieldLabel>
                                    <Input
                                        id="eventDate"
                                        type="datetime-local"
                                    />

                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <div className="flex items-center gap-3">
                            <Button type={"submit"} className={"cursor-pointer"}>Create event</Button>
                            <Button type={"button"} variant={"outline"} asChild>
                                <Link href={"/dashboard"}>Cancel</Link>
                            </Button>
                        </div>
                    </FieldGroup>
                </form>
            </CardContent>
        </Card>
    </div>
}