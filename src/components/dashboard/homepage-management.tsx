"use client";
import { useState } from "react";
import { updateHomepageContent } from "@/actions/homepage";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function HomepageManagement({ initialData }: { initialData: any }) {
  const [formData, setFormData] = useState(initialData || {});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const set = (key: string, value: any) => setFormData((d: any) => ({ ...d, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const result = await updateHomepageContent(formData);
      if (result && (result as any).success === false) {
        setStatus({ ok: false, msg: (result as any).error || "Failed to save." });
      } else {
        setStatus({ ok: true, msg: "Homepage content saved successfully!" });
      }
    } catch (e: any) {
      setStatus({ ok: false, msg: e?.message || "An unexpected error occurred." });
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2] bg-white";
  const labelCls = "block text-sm font-medium text-[#475569] mb-1";

  return (
    <div className="flex flex-col gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0F172A]">Homepage Content</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-[10px] bg-[#0056D2] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {status && (
        <div className={`flex items-center gap-2 rounded-[10px] p-3 text-sm ${status.ok ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {status.ok ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {status.msg}
        </div>
      )}

      {/* Hero Section */}
      <section className="bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-semibold text-[#0F172A]">Hero Section</h2>
        <div>
          <label className={labelCls}>Hero Title *</label>
          <input className={inputCls} value={formData.heroTitle || ""} onChange={e => set("heroTitle", e.target.value)} placeholder="Empowering Future Leaders" />
        </div>
        <div>
          <label className={labelCls}>Hero Subtitle</label>
          <textarea className={inputCls} rows={3} value={formData.heroSubtitle || ""} onChange={e => set("heroSubtitle", e.target.value)} placeholder="Human Resource Development Cell, SRCC..." />
        </div>
        <div>
          <label className={labelCls}>Hero Background Image URL</label>
          <input type="url" className={inputCls} value={formData.heroImage || ""} onChange={e => set("heroImage", e.target.value)} placeholder="https://..." />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Primary CTA Button Text</label>
            <input className={inputCls} value={formData.heroCtaText || ""} onChange={e => set("heroCtaText", e.target.value)} placeholder="Explore Our Work" />
          </div>
          <div>
            <label className={labelCls}>Primary CTA Link</label>
            <input className={inputCls} value={formData.heroCtaLink || ""} onChange={e => set("heroCtaLink", e.target.value)} placeholder="/projects" />
          </div>
          <div>
            <label className={labelCls}>Secondary CTA Button Text</label>
            <input className={inputCls} value={formData.heroSecondaryCtaText || ""} onChange={e => set("heroSecondaryCtaText", e.target.value)} placeholder="Learn About Us" />
          </div>
          <div>
            <label className={labelCls}>Secondary CTA Link</label>
            <input className={inputCls} value={formData.heroSecondaryCtaLink || ""} onChange={e => set("heroSecondaryCtaLink", e.target.value)} placeholder="/about" />
          </div>
        </div>
      </section>

      {/* Looking Ahead Section */}
      <section className="bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-semibold text-[#0F172A]">Looking Ahead Section</h2>
        <div>
          <label className={labelCls}>Section Title</label>
          <input className={inputCls} value={formData.lookingAheadTitle || ""} onChange={e => set("lookingAheadTitle", e.target.value)} placeholder="Looking Ahead" />
        </div>
        <div>
          <label className={labelCls}>Section Description</label>
          <textarea className={inputCls} rows={3} value={formData.lookingAheadDescription || ""} onChange={e => set("lookingAheadDescription", e.target.value)} placeholder="Our vision for the future..." />
        </div>
      </section>

      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-[10px] bg-[#0056D2] px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
