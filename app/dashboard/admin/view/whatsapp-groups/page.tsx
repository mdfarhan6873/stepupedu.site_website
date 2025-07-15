"use client";
import { useEffect, useState } from "react";
import { ChatBubbleLeftRightIcon, MagnifyingGlassIcon, LinkIcon, PencilIcon, TrashIcon, XMarkIcon, ClipboardDocumentIcon } from "@heroicons/react/24/outline";

export default function ViewWhatsAppGroups() {
  const [groups, setGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ class: '', section: '', groupName: '' });
  const [editModal, setEditModal] = useState<{ open: boolean; group: any | null }>({ open: false, group: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; group: any | null }>({ open: false, group: null });
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/whatsapp-groups");
      const data = await response.json();
      setGroups(data);
    } catch (error) {
      console.error("Error fetching groups:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = groups.filter(g =>
    (filter.class === '' || (g.class && g.class.toLowerCase().includes(filter.class.toLowerCase()))) &&
    (filter.section === '' || (g.section && g.section.toLowerCase().includes(filter.section.toLowerCase()))) &&
    (filter.groupName === '' || (g.groupName && g.groupName.toLowerCase().includes(filter.groupName.toLowerCase())))
  );

  const groupSize = filtered.length <= 4 ? 2 : 3;
  const grouped = [];
  for (let i = 0; i < filtered.length; i += groupSize) {
    grouped.push(filtered.slice(i, i + groupSize));
  }

  // Edit handler
  const openEdit = (group: any) => {
    setForm({ ...group });
    setEditModal({ open: true, group });
  };
  const closeEdit = () => setEditModal({ open: false, group: null });
  const handleEditChange = (e: any) => {
    setForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const submitEdit = async () => {
    setSaving(true);
    try {
      const patchBody = { ...form, id: form._id };
      await fetch(`/api/whatsapp-groups`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patchBody),
      });
      await fetchGroups(); // Re-fetch to ensure data is up-to-date
      setSaving(false);
      closeEdit();
    } catch (error) {
      console.error("Error updating group:", error);
      setSaving(false);
    }
  };

  // Delete handler
  const openDelete = (group: any) => setDeleteModal({ open: true, group });
  const closeDelete = () => setDeleteModal({ open: false, group: null });
  const confirmDelete = async () => {
    setDeleting(true);
    try {
      await fetch(`/api/whatsapp-groups`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteModal.group._id }),
      });
      setGroups((prev) => prev.filter((g) => g._id !== deleteModal.group._id));
      setDeleting(false);
      closeDelete();
    } catch (error) {
      console.error("Error deleting group:", error);
      setDeleting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const classes = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'];
  const sections = ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">WhatsApp Groups</h2>
            <p className="text-gray-300">Manage class WhatsApp groups</p>
          </div>

          {/* Filter Section */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white border-opacity-20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Filter Groups</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by class..." 
                value={filter.class}
                onChange={e => setFilter(f => ({ ...f, class: e.target.value }))}
              />
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by section..." 
                value={filter.section}
                onChange={e => setFilter(f => ({ ...f, section: e.target.value }))}
              />
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by group name..." 
                value={filter.groupName}
                onChange={e => setFilter(f => ({ ...f, groupName: e.target.value }))}
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading WhatsApp groups...
                </div>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 text-center">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-300">No WhatsApp groups found.</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {grouped.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {row.map((group, idx) => (
                    <div key={idx} className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white pr-2">{group.groupName}</h3>
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                          <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-300">Class:</span>
                          <span className="text-sm text-white font-medium">{group.class}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-300">Section:</span>
                          <span className="text-sm text-white font-medium">{group.section}</span>
                        </div>
                        
                        <div className="bg-white bg-opacity-5 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-300">Group Link:</span>
                            <div className="flex items-center gap-2">
                              <button
                                className="p-1 bg-white bg-opacity-10 rounded hover:bg-opacity-20 transition-all duration-300"
                                onClick={() => copyToClipboard(group.groupLink)}
                                title="Copy Group Link"
                              >
                                <ClipboardDocumentIcon className="w-3 h-3 text-gray-300" />
                              </button>
                              <a
                                href={group.groupLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1 bg-green-500 bg-opacity-20 rounded hover:bg-opacity-30 transition-all duration-300"
                                title="Open WhatsApp Group"
                              >
                                <LinkIcon className="w-3 h-3 text-green-300" />
                              </a>
                            </div>
                          </div>
                          <div className="text-xs text-gray-400 break-all">
                            {group.groupLink}
                          </div>
                        </div>
                        
                        {group.description && (
                          <div className="text-sm text-gray-300">
                            <span className="font-medium">Description:</span> {group.description}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-300">Status:</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${group.isActive ? 'bg-green-500 bg-opacity-20 text-green-300' : 'bg-red-500 bg-opacity-20 text-red-300'}`}>
                            {group.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        
                        <div className="text-xs text-gray-400">
                          Created: {new Date(group.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <button
                          className="flex items-center gap-1 px-3 py-1 bg-blue-500 bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg text-xs font-semibold shadow"
                          onClick={() => openEdit(group)}
                        >
                          <PencilIcon className="w-4 h-4" /> Edit
                        </button>
                        <button
                          className="flex items-center gap-1 px-3 py-1 bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg text-xs font-semibold shadow"
                          onClick={() => openDelete(group)}
                        >
                          <TrashIcon className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={closeEdit}>
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-4">Edit WhatsApp Group</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
                <select
                  name="class"
                  value={form.class || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                <select
                  name="section"
                  value={form.section || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                >
                  <option value="">Select Section</option>
                  {sections.map(section => (
                    <option key={section} value={section}>{section}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Name</label>
                <input
                  name="groupName"
                  value={form.groupName || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  placeholder="Group Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Group Link</label>
                <input
                  name="groupLink"
                  value={form.groupLink || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  placeholder="WhatsApp Group Link"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  name="description"
                  value={form.description || ""}
                  onChange={handleEditChange}
                  className="w-full border rounded p-2"
                  placeholder="Description"
                  rows={3}
                />
              </div>
              <div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive || false}
                    onChange={(e) => setForm((f: any) => ({ ...f, isActive: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold"
                onClick={submitEdit}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold" onClick={closeEdit}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={closeDelete}>
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-4">Delete WhatsApp Group</h3>
            <p>Are you sure you want to delete <span className="font-semibold">{deleteModal.group?.groupName}</span>?</p>
            <div className="flex gap-2 mt-6">
              <button
                className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold"
                onClick={confirmDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold" onClick={closeDelete}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}