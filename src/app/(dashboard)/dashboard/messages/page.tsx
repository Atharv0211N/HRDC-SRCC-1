export const dynamic = 'force-dynamic';
import MessagesManagement from "@/components/dashboard/messages-management";
import { getMessages } from "@/actions/messages";

export default async function Page() {
  const data = await getMessages();
  return <MessagesManagement initialData={data} />;
}
