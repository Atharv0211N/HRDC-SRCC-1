export const dynamic = 'force-dynamic';
import StatisticsManagement from "@/components/dashboard/statistics-management";
import { getStatistics } from "@/actions/statistics";

export default async function Page() {
  const data = await getStatistics();
  return <StatisticsManagement initialData={data} />;
}
