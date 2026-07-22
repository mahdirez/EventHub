import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/server";
import { DashboardContent } from "@/components/dashboard-content";

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session.data?.user?.id;

  if (!userId) {
    redirect("/auth");
  }

  return <DashboardContent userId={userId} />;
}
