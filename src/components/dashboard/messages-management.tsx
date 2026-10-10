"use client";
import { updateMessageStatus, deleteMessage } from "@/actions/messages";
import { Button } from "@/components/ui/button";

export default function MessagesManagement({ initialData }: { initialData: any[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Contact Messages</h1>
      <div className="bg-[#F8FAFC] p-6 rounded-[14px] border border-[#E2E8F0]">
        <table className="w-full text-left">
          <thead><tr><th>Name</th><th>Email</th><th>Status</th><th>Actions</th></tr></thead>
          <tbody>
            {initialData.map(m => (
              <tr key={m.id}>
                <td className="py-2 border-b">{m.name}</td>
                <td className="py-2 border-b">{m.email}</td>
                <td className="py-2 border-b">
                  <select value={m.status} onChange={e => updateMessageStatus(m.id, e.target.value)} className="border p-1 rounded">
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="RESOLVED">Resolved</option>
                  </select>
                </td>
                <td className="py-2 border-b">
                  <Button variant="destructive" size="sm" onClick={() => deleteMessage(m.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
