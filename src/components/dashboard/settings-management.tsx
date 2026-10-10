"use client";
import { useState } from "react";
import { updateSiteSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";

export default function SettingsManagement({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData);

  const handleSave = async () => {
    await updateSiteSettings(data);
    alert("Settings saved!");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Site Settings</h1>
      <div className="bg-[#F8FAFC] p-6 rounded-[14px] border border-[#E2E8F0] space-y-4">
        <div>
          <label className="block text-sm font-medium">Organization Name</label>
          <input className="w-full border rounded p-2" value={data.orgName || ""} onChange={e => setData({...data, orgName: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium">Primary Email</label>
          <input className="w-full border rounded p-2" value={data.primaryEmail || ""} onChange={e => setData({...data, primaryEmail: e.target.value})} />
        </div>
        <Button onClick={handleSave} className="bg-[#0056D2] text-white">Save Settings</Button>
      </div>
    </div>
  );
}
