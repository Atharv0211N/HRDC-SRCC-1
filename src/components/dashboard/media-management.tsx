"use client";
import { useState } from "react";
import { uploadMedia, deleteMedia } from "@/actions/media";
import { Button } from "@/components/ui/button";

export default function MediaManagement({ initialData }: { initialData: any[] }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", e.target.files[0]);
    fd.append("folder", "general");
    try {
      await uploadMedia(fd);
      alert("Uploaded!");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#0F172A]">Media Library</h1>
        <div>
          <label className="bg-[#0056D2] text-white px-4 py-2 rounded cursor-pointer">
            {uploading ? "Uploading..." : "Upload File"}
            <input type="file" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {initialData.map(m => (
          <div key={m.id} className="bg-[#F8FAFC] p-2 rounded-[14px] border border-[#E2E8F0] relative group">
            <img src={m.url} alt={m.name} className="h-32 w-full object-cover rounded-md" />
            <p className="text-xs mt-2 truncate font-medium">{m.name}</p>
            <button onClick={() => deleteMedia(m.id)} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">X</button>
          </div>
        ))}
      </div>
    </div>
  );
}
