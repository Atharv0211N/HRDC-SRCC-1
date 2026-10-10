export const dynamic = 'force-dynamic';
import PartnersManagement from "@/components/dashboard/partners-management";
import { getPartners } from "@/actions/partners";

export default async function Page() {
  const data = await getPartners();
  return <PartnersManagement initialData={data} />;
}
