import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import { DashboardContent } from "@/components/dashboard-content";
import { createPageMetadata } from "@/lib/metadata";

export const metadata = createPageMetadata({
  title: "Dashboard",
  description: "View your events and track RSVP responses.",
});

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session.data?.user?.id;

  if (!userId) {
    redirect("/auth");
  }

  return <DashboardContent userId={userId} />;
}
