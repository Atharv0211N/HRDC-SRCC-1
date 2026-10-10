export const dynamic = 'force-dynamic';
import MediaManagement from "@/components/dashboard/media-management";
import { getMediaAssets } from "@/actions/media";

export default async function Page() {
  const data = await getMediaAssets();
  return <MediaManagement initialData={data} />;
}
