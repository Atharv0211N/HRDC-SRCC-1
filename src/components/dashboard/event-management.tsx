'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, RotateCcw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createEvent, updateEvent, softDeleteEvent, restoreEvent } from '@/actions/events';
import { Event } from '@prisma/client';
import { EVENT_CATEGORY_LABELS } from '@/lib/constants';

interface Props {
  initialData: Event[];
}

export function EventManagement({ initialData }: Props) {
  const [data, setData] = useState(initialData);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Event | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'archived'>('all');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      if (editingItem) {
        await updateEvent(editingItem.id, formData);
      } else {
        await createEvent(formData);
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
    if (!confirm('Are you sure you want to delete this event?')) {
      setIsDeleting(null);
      return;
    }
    
    try {
      await softDeleteEvent(id);
      setIsDeleting(null);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('An error occurred while deleting.');
    }
  }

  async function handleRestore(id: string) {
    try {
      await restoreEvent(id);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert('An error occurred while restoring.');
    }
  }

  function openForm(item?: Event) {
    if (item) {
      setEditingItem(item);
    } else {
      setEditingItem(null);
    }
    setIsFormOpen(true);
  }

  const filteredData = initialData.filter(item => {
    if (item.isDeleted) return false; // Default: hide deleted, though maybe we want another filter
    if (filter === 'all') return true;
    if (filter === 'archived') return item.archived;
    if (filter === 'upcoming') return !item.archived;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0F172A]">Event Management</h1>
        <div className="flex gap-4 items-center">
          <select 
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none"
          >
            <option value="all">All Events</option>
            <option value="upcoming">Upcoming</option>
            <option value="archived">Archived</option>
          </select>
          <button
            onClick={() => openForm()}
            className="flex items-center gap-2 rounded-[10px] bg-[#0056D2] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Event
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-[14px] border border-[#E2E8F0] bg-[#F8FAFC] shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-[#475569]">
            <thead className="border-b border-[#E2E8F0] bg-white text-[#64748B]">
              <tr>
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Title</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Featured</th>
                <th className="px-6 py-4 font-medium">Archived</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] bg-white">
              {filteredData.map((event) => (
                <tr key={event.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <img 
                      src={event.heroImage || 'https://via.placeholder.com/60x40'} 
                      alt={event.title} 
                      className="h-10 w-16 rounded-[6px] object-cover border border-[#E2E8F0]"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-[#0F172A]">{event.title}</td>
                  <td className="px-6 py-4">{new Date(event.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4">{EVENT_CATEGORY_LABELS[event.category] || event.category}</td>
                  <td className="px-6 py-4">
                    {event.featured ? (
                      <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">Yes</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {event.archived ? (
                      <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">Yes</span>
                    ) : (
                      <span className="inline-flex rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">No</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openForm(event)}
                        className="rounded-[10px] p-2 text-[#64748B] hover:bg-slate-100 hover:text-[#0056D2] transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setIsDeleting(event.id);
                          handleDelete(event.id);
                        }}
                        disabled={isDeleting === event.id}
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
                  <td colSpan={7} className="px-6 py-8 text-center text-[#64748B]">
                    No events found.
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
                  {editingItem ? 'Edit Event' : 'Add Event'}
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
                    <label className="block text-sm font-medium text-[#475569] mb-1">Start Date</label>
                    <input 
                      type="datetime-local" 
                      name="date" 
                      required
                      defaultValue={editingItem?.date ? new Date(editingItem.date).toISOString().slice(0, 16) : ''}
                      className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#475569] mb-1">End Date</label>
                    <input 
                      type="datetime-local" 
                      name="endDate" 
                      defaultValue={editingItem?.endDate ? new Date(editingItem.endDate).toISOString().slice(0, 16) : ''}
                      className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Category</label>
                  <select 
                    name="category" 
                    required
                    defaultValue={editingItem?.category}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]"
                  >
                    <option value="">Select a category</option>
                    {Object.entries(EVENT_CATEGORY_LABELS || {}).map(([key, label]) => (
                      <option key={key} value={key}>{label as string}</option>
                    ))}
                    <option value="WORKSHOP">Workshop</option>
                    <option value="SEMINAR">Seminar</option>
                    <option value="COMPETITION">Competition</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Description</label>
                  <textarea 
                    name="description" 
                    rows={4}
                    defaultValue={editingItem?.description || ''}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Hero Image URL</label>
                  <input 
                    type="url" 
                    name="heroImage" 
                    defaultValue={editingItem?.heroImage || ''}
                    className="w-full rounded-[10px] border border-[#E2E8F0] px-3 py-2 text-sm text-[#0F172A] focus:border-[#0056D2] focus:outline-none focus:ring-1 focus:ring-[#0056D2]" 
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-[#475569] mb-1">Venue</label>
                  <input 
                    type="text" 
                    name="venue" 
                    defaultValue={editingItem?.venue || ''}
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

                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="featured"
                      name="featured" 
                      defaultChecked={editingItem?.featured}
                      className="h-4 w-4 rounded border-[#E2E8F0] text-[#0056D2] focus:ring-[#0056D2]" 
                    />
                    <label htmlFor="featured" className="text-sm font-medium text-[#475569]">
                      Feature Event
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="archived"
                      name="archived" 
                      defaultChecked={editingItem?.archived}
                      className="h-4 w-4 rounded border-[#E2E8F0] text-[#0056D2] focus:ring-[#0056D2]" 
                    />
                    <label htmlFor="archived" className="text-sm font-medium text-[#475569]">
                      Archived
                    </label>
                  </div>
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
