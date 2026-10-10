"use client";
import { useState } from "react";
import { updateHomepageContent } from "@/actions/homepage";
import { Button } from "@/components/ui/button";

export default function HomepageManagement({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState(initialData);

  const handleSave = async () => {
    await updateHomepageContent(formData);
    alert("Saved");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Homepage Management</h1>
      <div className="bg-[#F8FAFC] p-6 rounded-[14px] border border-[#E2E8F0] space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Hero Title</label>
          <input className="w-full border rounded p-2" value={formData.heroTitle || ""} onChange={e => setFormData({...formData, heroTitle: e.target.value})} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Hero Subtitle</label>
          <textarea className="w-full border rounded p-2" value={formData.heroSubtitle || ""} onChange={e => setFormData({...formData, heroSubtitle: e.target.value})} />
        </div>
        <Button onClick={handleSave} className="bg-[#0056D2] hover:bg-[#0047B3] text-white">Save Changes</Button>
      </div>
    </div>
  );
}
