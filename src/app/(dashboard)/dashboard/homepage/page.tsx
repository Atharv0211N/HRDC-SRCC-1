export const dynamic = 'force-dynamic';
import HomepageManagement from "@/components/dashboard/homepage-management";
import { getHomepageContent } from "@/actions/homepage";

export default async function Page() {
  const data = await getHomepageContent();
  return <HomepageManagement initialData={data} />;
}
