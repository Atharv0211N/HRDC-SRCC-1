'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X, AlertCircle } from 'lucide-react';
import { createTeamMember, updateTeamMember, deleteTeamMember } from '@/actions/team';
import { TeamMember } from '@prisma/client';
import { DEPARTMENT_LABELS } from '@/lib/constants';

interface Props {
  initialData: TeamMember[];
}

const DEPT_OPTIONS = [
  { value: 'PRESIDENCY', label: 'Presidency' },
  { value: 'RESEARCH_EDITORIAL', label: 'Research & Editorial' },
  { value: 'CREATIVE_TECHNICAL', label: 'Creative & Technical' },
  { value: 'PROJECT_DEVELOPMENT', label: 'Project Development' },
  { value: 'EVENT_CORPORATE', label: 'Event & Corporate' },
];

export function TeamManagement({ initialData }: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    try {
      let result: any;
      if (editingItem) {
        result = await updateTeamMember(editingItem.id, formData);
      } else {
        result = await createTeamMember(formData);
      }
      if (result?.success === false) {
        setFormError(result.error || 'Failed to save team member.');
        return;
      }
      setIsFormOpen(false);
      setEditingItem(null);
      router.refresh();
    } catch (error: any) {
      setFormError(error?.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this team member?')) {
      setIsDeleting(null);
      return;
    }

    try {
      const result = await deleteTeamMember(id);
      if (result?.success === false) {
        alert(result.error || 'Failed to delete member.');
        return;
      }
      setIsDeleting(null);
      router.refresh();
    } catch (error: any) {
      alert(error?.message || 'An error occurred while deleting.');
    }
  }

  function openForm(item?: TeamMember) {
    setEditingItem(item || null);
    setFormError(null);
    setIsFormOpen(true);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0F172A]">Team Management</h1>
        <button
          onClick={() => openForm()}
          className="flex items-center gap-2 rounded-[10px] bg-[#0056D2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Member
        </button>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#475569]">
            <thead className="border-b border-[#E2E8F0] bg-white text-[#64748B]">
              <tr>
                <th className="px-6 py-4 font-medium">Photo</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Designation</th>
                <th className="px-6 py-4 font-medium">Department</th>
                <th className="px-6 py-4 font-medium">Term</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] bg-white">
              {initialData.map((member) => (
                <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <img
                      src={member.photo || 'https://placehold.co/40x40/E2E8F0/94A3B8?text=No+Photo'}
                      alt={member.name}
                      className="h-10 w-10 rounded-full object-cover border border-[#E2E8F0]"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{member.name}</td>
                  <td className="px-6 py-4">{member.designation}</td>
                  <td className="px-6 py-4">
                    {(DEPARTMENT_LABELS as any)?.[member.department] || member.department}
                  </td>
                  <td className="px-6 py-4 text-xs text-[#64748B]">{member.term}</td>
                  <td className="px-6 py-4">
                    {member.featuredOnHomepage ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Yes</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openForm(member)}
                        className="rounded-[10px] p-2 text-[#64748B] hover:bg-slate-100 hover:text-[#0056D2] transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { setIsDeleting(member.id); handleDelete(member.id); }}
                        disabled={isDeleting === member.id}
                        className="rounded-[10px] p-2 text-[#64748B] hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {initialData.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-[#64748B]">
                    No team members found. Click &apos;Add Member&apos; to create one.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-[18px] bg-white p-6 shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-[#0F172A]">
                {editingItem ? 'Edit Team Member' : 'Add Team Member'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="rounded-full p-2 text-[#64748B] hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && (
              <div className="mb-4 flex items-start gap-2 rounded-[10px] bg-red-50 border border-red-200 p-3 text-sm text-red-700">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  required
                  defaultValue={editingItem?.name}
                  className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1">Designation *</label>
                <input
                  type="text"
                  name="designation"
                  required
                  defaultValue={editingItem?.designation}
                  className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1">Department *</label>
                <select
                  name="department"
                  required
                  defaultValue={editingItem?.department}
                  className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]"
                >
                  <option value="">Select a department</option>
                  {DEPT_OPTIONS.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1">Photo URL *</label>
                <input
                  type="url"
                  name="photo"
                  required
                  defaultValue={editingItem?.photo || ''}
                  placeholder="https://..."
                  className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1">LinkedIn URL</label>
                <input
                  type="url"
                  name="linkedIn"
                  defaultValue={editingItem?.linkedIn || ''}
                  placeholder="https://linkedin.com/in/..."
                  className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1">Term *</label>
                <input
                  type="text"
                  name="term"
                  required
                  placeholder="e.g. 2024-2025"
                  defaultValue={editingItem?.term || ''}
                  className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#475569] mb-1">Display Order</label>
                <input
                  type="number"
                  name="displayOrder"
                  defaultValue={editingItem?.displayOrder || 0}
                  className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]"
                />
              </div>

              <div className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  id="featuredOnHomepage"
                  name="featuredOnHomepage"
                  defaultChecked={editingItem?.featuredOnHomepage}
                  className="h-4 w-4 rounded border-[#E2E8F0] text-[#0056D2] focus:ring-[#0056D2]"
                />
                <label htmlFor="featuredOnHomepage" className="text-sm font-medium text-[#475569]">
                  Feature on Homepage
                </label>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-[10px] px-4 py-2 text-sm font-medium text-[#475569] border border-[#E2E8F0] hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-[10px] bg-[#0056D2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
