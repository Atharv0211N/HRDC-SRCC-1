export const dynamic = 'force-dynamic';
import AdminManagement from "@/components/dashboard/admin-management";
import { getAdmins } from "@/actions/admin";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (session?.user?.role !== "SUPER_ADMIN") {
    redirect("/dashboard");
  }

  const data = await getAdmins();
  return <AdminManagement initialData={data.data || []} />;
}
