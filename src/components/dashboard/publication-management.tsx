'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createPublication, updatePublication, softDeletePublication, restorePublication } from '@/actions/publications';
import { Publication } from '@prisma/client';
import { PUBLICATION_TYPE_LABELS } from '@/lib/constants';

interface Props {
  initialData: Publication[];
}

export function PublicationManagement({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Publication | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (editingItem) {
        await updatePublication(editingItem.id, formData);
      } else {
        await createPublication(formData);
      }
      setIsFormOpen(false);
      setEditingItem(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('An error occurred while saving.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this publication?')) {
      setIsDeleting(null);
      return;
    }
    
    try {
      await softDeletePublication(id);
      setIsDeleting(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting.');
    }
  }

  async function handleRestore(id: string) {
    try {
      await restorePublication(id);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('An error occurred while restoring.');
    }
  }

  function openForm(item?: Publication) {
    if (item) {
      setEditingItem(item);
    } else {
      setEditingItem(null);
    }
    setIsFormOpen(true);
  }

  const filteredData = initialData.filter(item => {
    if (item.isDeleted) return false;
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0F172A]">Publication Management</h1>
        <div className="flex gap-4 items-center">
          <select 
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none"
          >
            <option value="all">All Types</option>
            {Object.entries(PUBLICATION_TYPE_LABELS || {}).map(([key, label]) => (
              <option key={key} value={key}>{label as string}</option>
            ))}
            <option value="RESEARCH_PAPER">Research Paper</option>
            <option value="ARTICLE">Article</option>
            <option value="MAGAZINE">Magazine</option>
          </select>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 rounded-[10px] bg-[#0056D2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Publication
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#475569]">
            <thead className="border-b border-[#E2E8F0] bg-white text-[#64748B]">
              <tr>
                <th className="px-6 py-4 font-medium">Cover</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] bg-white">
              {filteredData.map((pub) => (
                <tr key={pub.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <img 
                      src={pub.coverImage || 'https://via.placeholder.com/40x60'} 
                      alt={pub.title} 
                      className="h-12 w-8 rounded-[4px] object-cover border border-[#E2E8F0]"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{pub.title}</td>
                  <td className="px-6 py-4">{PUBLICATION_TYPE_LABELS[pub.type] || pub.type}</td>
                  <td className="px-6 py-4">{new Date(pub.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    {pub.featured ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Yes</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openForm(pub)}
                        className="rounded-[10px] p-2 text-[#64748B] hover:bg-slate-100 hover:text-[#0056D2] transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleting(pub.id);
                          handleDelete(pub.id);
                        }}
                        disabled={isDeleting === pub.id}
                        className="rounded-[10px] p-2 text-[#64748B] hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#64748B]">
                    No publications found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-sm">
          <div className="h-full w-full max-w-2xl bg-white shadow-xl overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-[#0F172A]">
                  {editingItem ? 'Edit Publication' : 'Add Publication'}
                </h2>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="rounded-full p-2 text-[#64748B] hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Title</label>
                  <input 
                    type="text" 
                    name="title" 
                    required
                    defaultValue={editingItem?.title}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Slug</label>
                  <input 
                    type="text" 
                    name="slug" 
                    defaultValue={editingItem?.slug}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-1">Date</label>
                    <input 
                      type="date" 
                      name="date" 
                      required
                      defaultValue={editingItem?.date ? new Date(editingItem.date).toISOString().slice(0, 10) : ''}
                      className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-1">Type</label>
                    <select 
                      name="type" 
                      required
                      defaultValue={editingItem?.type}
                      className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]"
                    >
                      <option value="">Select a type</option>
                      {Object.entries(PUBLICATION_TYPE_LABELS || {}).map(([key, label]) => (
                        <option key={key} value={key}>{label as string}</option>
                      ))}
                      <option value="RESEARCH_PAPER">Research Paper</option>
                      <option value="ARTICLE">Article</option>
                      <option value="MAGAZINE">Magazine</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Cover Image URL</label>
                  <input 
                    type="url" 
                    name="coverImage" 
                    defaultValue={editingItem?.coverImage || ''}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Summary</label>
                  <textarea 
                    name="summary" 
                    rows={3}
                    defaultValue={editingItem?.summary || ''}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Content (for articles/blogs)</label>
                  <textarea 
                    name="content" 
                    rows={6}
                    defaultValue={editingItem?.content || ''}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">PDF URL</label>
                  <input 
                    type="url" 
                    name="pdfUrl" 
                    defaultValue={editingItem?.pdfUrl || ''}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">External Link</label>
                  <input 
                    type="url" 
                    name="externalLink" 
                    defaultValue={editingItem?.externalLink || ''}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Tags (comma separated)</label>
                  <input 
                    type="text" 
                    name="tags" 
                    defaultValue={(editingItem?.tags as string[])?.join(', ') || ''}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Related Project ID (optional)</label>
                  <input 
                    type="text" 
                    name="relatedProjectId" 
                    defaultValue={editingItem?.relatedProjectId || ''}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <input 
                    type="checkbox" 
                    id="featured"
                    name="featured" 
                    defaultChecked={editingItem?.featured}
                    className="h-4 w-4 rounded border-[#E2E8F0] text-[#0056D2] focus:ring-[#0056D2]" 
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-[#475569]">
                    Feature Publication
                  </label>
                </div>

                <div className="mt-8 flex justify-end gap-3 pb-8">
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
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
