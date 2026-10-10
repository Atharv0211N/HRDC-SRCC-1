const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function write(filePath, content) {
  ensureDir(filePath);
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
}

// ----------------------------------------------------
// PAGES & COMPONENTS
// ----------------------------------------------------

const pages = [
  { name: 'homepage', comp: 'HomepageManagement' },
  { name: 'statistics', comp: 'StatisticsManagement' },
  { name: 'partners', comp: 'PartnersManagement' },
  { name: 'messages', comp: 'MessagesManagement' },
  { name: 'settings', comp: 'SettingsManagement' },
  { name: 'admins', comp: 'AdminManagement' },
  { name: 'media', comp: 'MediaManagement' }
];

pages.forEach(p => {
  write(path.join(srcDir, 'app', '(dashboard)', 'dashboard', p.name, 'page.tsx'), `
import ${p.comp} from "@/components/dashboard/${p.name === 'admins' ? 'admin' : p.name}-management";
import { get${p.name.charAt(0).toUpperCase() + p.name.slice(1)} } from "@/actions/${p.name}";

export default async function Page() {
  const data = await get${p.name.charAt(0).toUpperCase() + p.name.slice(1)}();
  return <${p.comp} initialData={data} />;
}
`);
});

// Components
write(path.join(srcDir, 'components', 'dashboard', 'homepage-management.tsx'), `
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
`);

write(path.join(srcDir, 'components', 'dashboard', 'statistics-management.tsx'), `
"use client";
import { useState } from "react";
import { createStatistic, updateStatistic, deleteStatistic } from "@/actions/statistics";
import { Button } from "@/components/ui/button";

export default function StatisticsManagement({ initialData }: { initialData: any[] }) {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[#0F172A]">Statistics Management</h1>
      <div className="bg-[#F8FAFC] p-6 rounded-[14px] border border-[#E2E8F0]">
        <table className="w-full text-left border-collapse">
          <thead><tr><th className="border-b py-2">Label</th><th className="border-b py-2">Value</th><th className="border-b py-2">Actions</th></tr></thead>
          <tbody>
            {initialData.map(stat => (
              <tr key={stat.id}>
                <td className="py-2 border-b">{stat.label}</td>
                <td className="py-2 border-b">{stat.value}</td>
                <td className="py-2 border-b">
                  <Button variant="destructive" size="sm" onClick={() => deleteStatistic(stat.id)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
`);

write(path.join(srcDir, 'components', 'dashboard', 'partners-management.tsx'), `
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
`);

write(path.join(srcDir, 'components', 'dashboard', 'messages-management.tsx'), `
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
`);

write(path.join(srcDir, 'components', 'dashboard', 'settings-management.tsx'), `
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
`);

write(path.join(srcDir, 'components', 'dashboard', 'admin-management.tsx'), `
"use client";
import { updateAdminRole, deleteAdmin } from "@/actions/admins";
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
`);

write(path.join(srcDir, 'components', 'dashboard', 'media-management.tsx'), `
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
`);

// Adjust the get... function calls in pages to handle plural/singular correctly
const replaceInPage = (filePath, oldStr, newStr) => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(oldStr, newStr);
  fs.writeFileSync(filePath, content, 'utf8');
};

console.log("Pages generated.");
