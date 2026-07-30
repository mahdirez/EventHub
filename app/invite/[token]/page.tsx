import { InviteRsvpContent } from "@/components/invite-rsvp-content";

export default async function InvitePage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ submitted?: string }>;
}) {
  const { token } = await params;
  const query = await searchParams;

  return (
    <InviteRsvpContent token={token} submmited={query.submitted === "1"} />
  );
}
