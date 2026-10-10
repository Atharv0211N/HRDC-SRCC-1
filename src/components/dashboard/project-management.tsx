'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createProject, updateProject, softDeleteProject, restoreProject } from '@/actions/projects';
import { Project } from '@prisma/client';

interface Props {
  initialData: Project[];
}

export function ProjectManagement({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    // Convert arrays back from form if needed, depending on how actions handle them
    // For simplicity, we just pass formData
    
    try {
      if (editingItem) {
        await updateProject(editingItem.id, formData);
      } else {
        await createProject(formData);
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
    if (!confirm('Are you sure you want to delete this project?')) {
      setIsDeleting(null);
      return;
    }
    
    try {
      await softDeleteProject(id);
      setIsDeleting(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting.');
    }
  }

  async function handleRestore(id: string) {
    try {
      await restoreProject(id);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('An error occurred while restoring.');
    }
  }

  function openForm(item?: Project) {
    if (item) {
      setEditingItem(item);
    } else {
      setEditingItem(null);
    }
    setIsFormOpen(true);
  }

  const filteredData = initialData.filter(item => 
    showDeleted ? item.isDeleted : !item.isDeleted
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0F172A]">Project Management</h1>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-[#475569]">
            <input 
              type="checkbox" 
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
              className="rounded border-[#E2E8F0] text-[#0056D2] focus:ring-[#0056D2]"
            />
            Show Deleted
          </label>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 rounded-[10px] bg-[#0056D2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#475569]">
            <thead className="border-b border-[#E2E8F0] bg-white text-[#64748B]">
              <tr>
                <th className="px-6 py-4 font-medium">Cover</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Slug</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] bg-white">
              {filteredData.map((project) => (
                <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <img 
                      src={project.coverImage || 'https://via.placeholder.com/60x40'} 
                      alt={project.name} 
                      className="h-10 w-16 rounded-[6px] object-cover border border-[#E2E8F0]"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{project.name}</td>
                  <td className="px-6 py-4">{project.slug}</td>
                  <td className="px-6 py-4">
                    {project.featured ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Yes</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {project.isDeleted ? (
                      <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">Deleted</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">Active</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {!project.isDeleted ? (
                        <>
                          <button
                            onClick={() => openForm(project)}
                            className="rounded-[10px] p-2 text-[#64748B] hover:bg-slate-100 hover:text-[#0056D2] transition-colors"
                            title="Edit"
                          >
                            <Pencil className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => {
                              setIsDeleting(project.id);
                              handleDelete(project.id);
                            }}
                            disabled={isDeleting === project.id}
                            className="rounded-[10px] p-2 text-[#64748B] hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleRestore(project.id)}
                          className="rounded-[10px] p-2 text-[#64748B] hover:bg-green-50 hover:text-green-600 transition-colors"
                          title="Restore"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-[#64748B]">
                    No projects found.
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
                  {editingItem ? 'Edit Project' : 'Add Project'}
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
                  <label className="block text-sm font-medium text-[#475569] mb-1">Name</label>
                  <input 
                    type="text" 
                    name="name" 
                    required
                    defaultValue={editingItem?.name}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Slug (auto-generated if empty)</label>
                  <input 
                    type="text" 
                    name="slug" 
                    defaultValue={editingItem?.slug}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Short Description</label>
                  <input 
                    type="text" 
                    name="shortDescription" 
                    required
                    defaultValue={editingItem?.shortDescription || ''}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Full Description</label>
                  <textarea 
                    name="fullDescription" 
                    rows={4}
                    defaultValue={editingItem?.fullDescription || ''}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
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
                  <label className="block text-sm font-medium text-[#475569] mb-1">Objectives (comma separated for now)</label>
                  <input 
                    type="text" 
                    name="objectives" 
                    defaultValue={(editingItem?.objectives as string[])?.join(', ') || ''}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Activities (comma separated for now)</label>
                  <input 
                    type="text" 
                    name="activities" 
                    defaultValue={(editingItem?.activities as string[])?.join(', ') || ''}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Impact Summary</label>
                  <textarea 
                    name="impactSummary" 
                    rows={2}
                    defaultValue={editingItem?.impactSummary || ''}
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
                    id="featured"
                    name="featured" 
                    defaultChecked={editingItem?.featured}
                    className="h-4 w-4 rounded border-[#E2E8F0] text-[#0056D2] focus:ring-[#0056D2]" 
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-[#475569]">
                    Feature Project
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
