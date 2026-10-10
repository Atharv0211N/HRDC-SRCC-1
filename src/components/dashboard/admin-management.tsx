"use client";
import { updateAdminRole, deleteAdmin } from "@/actions/admin";
import { Button } from "@/components/ui/button";

export default function AdminManagement({ initialData }: { initialData: any[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Admin Management</h1>
      <div className="bg-[#F8FAFC] p-6 rounded-[14px] border border-[#E2E8F0]">
        <table className="w-full text-left">
          <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
          <tbody>
            {initialData.map(a => (
              <tr key={a.id}>
                <td className="py-2 border-b">{a.name}</td>
                <td className="py-2 border-b">{a.email}</td>
                <td className="py-2 border-b">
                  <select value={a.role} onChange={e => updateAdminRole(a.id, e.target.value)} className="border p-1 rounded">
                    <option value="SUPER_ADMIN">Super Admin</option>
                    <option value="ADMIN">Admin</option>
                    <option value="EDITOR">Editor</option>
                  </select>
                </td>
                <td className="py-2 border-b">
                  <Button variant="destructive" size="sm" onClick={() => deleteAdmin(a.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
