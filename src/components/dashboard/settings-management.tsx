"use client";
import { useState } from "react";
import { updateSiteSettings } from "@/actions/settings";
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function SettingsManagement({ initialData }: { initialData: any }) {
  const [data, setData] = useState(initialData || {});
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const set = (key: string, value: any) => setData((d: any) => ({ ...d, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const result = await updateSiteSettings(data);
      if (result && (result as any).success === false) {
        setStatus({ ok: false, msg: (result as any).error || "Failed to save settings." });
      } else {
        setStatus({ ok: true, msg: "Settings saved successfully!" });
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
        <h1 className="text-2xl font-semibold text-[#0F172A]">Site Settings</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-[10px] bg-[#0056D2] px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      {status && (
        <div className={`flex items-center gap-2 rounded-[10px] p-3 text-sm ${status.ok ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {status.ok ? <CheckCircle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {status.msg}
        </div>
      )}

      {/* Organization */}
      <section className="bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-semibold text-[#0F172A]">Organization Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Organization Name *</label>
            <input className={inputCls} value={data.orgName || ""} onChange={e => set("orgName", e.target.value)} placeholder="HRDC SRCC" />
          </div>
          <div>
            <label className={labelCls}>Institution *</label>
            <input className={inputCls} value={data.institution || ""} onChange={e => set("institution", e.target.value)} placeholder="Shri Ram College of Commerce" />
          </div>
          <div>
            <label className={labelCls}>Founded Year</label>
            <input className={inputCls} value={data.founded || ""} onChange={e => set("founded", e.target.value)} placeholder="e.g. 2004" />
          </div>
          <div>
            <label className={labelCls}>Motto / Tagline</label>
            <input className={inputCls} value={data.motto || ""} onChange={e => set("motto", e.target.value)} placeholder="Empowering Future Leaders" />
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-semibold text-[#0F172A]">Contact Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Primary Email *</label>
            <input type="email" className={inputCls} value={data.primaryEmail || ""} onChange={e => set("primaryEmail", e.target.value)} placeholder="contact@hrdc-srcc.org" />
          </div>
          <div>
            <label className={labelCls}>Phone</label>
            <input className={inputCls} value={data.phone || ""} onChange={e => set("phone", e.target.value)} placeholder="+91 00000 00000" />
          </div>
          <div className="md:col-span-2">
            <label className={labelCls}>Address</label>
            <textarea className={inputCls} rows={2} value={data.address || ""} onChange={e => set("address", e.target.value)} placeholder="Maurice Nagar, University of Delhi, Delhi - 110007" />
          </div>
        </div>
      </section>

      {/* Social */}
      <section className="bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-semibold text-[#0F172A]">Social Media</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>LinkedIn URL</label>
            <input type="url" className={inputCls} value={data.linkedIn || ""} onChange={e => set("linkedIn", e.target.value)} placeholder="https://linkedin.com/company/hrdc-srcc" />
          </div>
          <div>
            <label className={labelCls}>Instagram URL</label>
            <input type="url" className={inputCls} value={data.instagram || ""} onChange={e => set("instagram", e.target.value)} placeholder="https://instagram.com/hrdc.srcc" />
          </div>
        </div>
      </section>

      {/* Recruitment */}
      <section className="bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-semibold text-[#0F172A]">Recruitment</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => set("recruitmentOpen", !data.recruitmentOpen)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.recruitmentOpen ? "bg-[#0056D2]" : "bg-slate-300"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${data.recruitmentOpen ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <span className="text-sm font-medium text-[#475569]">
            Recruitment is currently <strong>{data.recruitmentOpen ? "OPEN" : "CLOSED"}</strong>
          </span>
        </div>
        <div>
          <label className={labelCls}>Recruitment Form URL</label>
          <input type="url" className={inputCls} value={data.recruitmentFormUrl || ""} onChange={e => set("recruitmentFormUrl", e.target.value)} placeholder="https://forms.google.com/..." />
        </div>
      </section>

      {/* Announcement Banner */}
      <section className="bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-semibold text-[#0F172A]">Announcement Banner</h2>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => set("announcementBannerEnabled", !data.announcementBannerEnabled)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${data.announcementBannerEnabled ? "bg-[#0056D2]" : "bg-slate-300"}`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${data.announcementBannerEnabled ? "translate-x-6" : "translate-x-1"}`} />
          </button>
          <span className="text-sm font-medium text-[#475569]">Banner {data.announcementBannerEnabled ? "enabled" : "disabled"}</span>
        </div>
        <div>
          <label className={labelCls}>Banner Text</label>
          <input className={inputCls} value={data.announcementBannerText || ""} onChange={e => set("announcementBannerText", e.target.value)} placeholder="Recruitment 2025 is now open! Apply here →" />
        </div>
        <div>
          <label className={labelCls}>Banner Link (optional)</label>
          <input type="url" className={inputCls} value={data.announcementBannerLink || ""} onChange={e => set("announcementBannerLink", e.target.value)} placeholder="https://..." />
        </div>
      </section>

      {/* SEO */}
      <section className="bg-[#F8FAFC] rounded-[14px] border border-[#E2E8F0] p-6 space-y-4">
        <h2 className="text-base font-semibold text-[#0F172A]">SEO Defaults</h2>
        <div className="space-y-4">
          <div>
            <label className={labelCls}>Default SEO Title</label>
            <input className={inputCls} value={data.defaultSeoTitle || ""} onChange={e => set("defaultSeoTitle", e.target.value)} placeholder="HRDC SRCC — Human Resource Development Cell" />
          </div>
          <div>
            <label className={labelCls}>Default SEO Description</label>
            <textarea className={inputCls} rows={3} value={data.defaultSeoDescription || ""} onChange={e => set("defaultSeoDescription", e.target.value)} placeholder="Official website of HRDC, SRCC..." />
          </div>
          <div>
            <label className={labelCls}>Default SEO Image URL</label>
            <input type="url" className={inputCls} value={data.defaultSeoImage || ""} onChange={e => set("defaultSeoImage", e.target.value)} placeholder="https://..." />
          </div>
        </div>
      </section>

      <div className="flex justify-end pb-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-[10px] bg-[#0056D2] px-6 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-60"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
