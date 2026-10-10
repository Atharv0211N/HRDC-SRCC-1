"use client";
import { createPartner, deletePartner } from "@/actions/partners";
import { Button } from "@/components/ui/button";

export default function PartnersManagement({ initialData }: { initialData: any[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Partners Management</h1>
      <div className="grid grid-cols-3 gap-4">
        {initialData.map(p => (
          <div key={p.id} className="bg-[#F8FAFC] p-4 rounded-[14px] border border-[#E2E8F0] flex flex-col items-center">
            <img src={p.logo} alt={p.name} className="h-16 mb-2 object-contain" />
            <h3 className="font-bold">{p.name}</h3>
            <p className="text-sm text-[#64748B]">{p.category}</p>
            <Button variant="destructive" size="sm" className="mt-2" onClick={() => deletePartner(p.id)}>Delete</Button>
          </div>
        ))}
      </div>
    </div>
  );
}
