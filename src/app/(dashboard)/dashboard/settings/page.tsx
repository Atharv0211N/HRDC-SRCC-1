export const dynamic = 'force-dynamic';
import SettingsManagement from "@/components/dashboard/settings-management";
import { getSiteSettings } from "@/actions/settings";

export default async function Page() {
  const data = await getSiteSettings();
  return <SettingsManagement initialData={data} />;
}
