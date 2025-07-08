"use client";
import { useEffect, useState } from "react";
import { AcademicCapIcon, MagnifyingGlassIcon, ClipboardDocumentIcon, PhoneIcon, BookOpenIcon, PencilIcon, TrashIcon, XMarkIcon } from "@heroicons/react/24/outline";

export default function ViewTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', mobileNo: '', address: '', subject: '' });
  const [editModal, setEditModal] = useState<{ open: boolean; teacher: any | null }>({ open: false, teacher: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; teacher: any | null }>({ open: false, teacher: null });
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/users/teacher")
      .then(res => res.json())
      .then(data => setTeachers(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = teachers.filter(t =>
    (filter.name === '' || (t.name && t.name.toLowerCase().includes(filter.name.toLowerCase()))) &&
    (filter.mobileNo === '' || (t.mobileNo && t.mobileNo.includes(filter.mobileNo))) &&
    (filter.address === '' || (t.address && t.address.toLowerCase().includes(filter.address.toLowerCase()))) &&
    (filter.subject === '' || (Array.isArray(t.subjects) && t.subjects.some((s: any) => s.subjectName.toLowerCase().includes(filter.subject.toLowerCase()))))
  );

  const groupSize = filtered.length <= 4 ? 2 : 3;
  const grouped = [];
  for (let i = 0; i < filtered.length; i += groupSize) {
    grouped.push(filtered.slice(i, i + groupSize));
  }

  // Edit handler
  const openEdit = (teacher: any) => {
    setForm({ ...teacher });
    setEditModal({ open: true, teacher });
  };
  const closeEdit = () => setEditModal({ open: false, teacher: null });
  const handleEditChange = (e: any) => {
    setForm((f: any) => ({ ...f, [e.target.name]: e.target.value }));
  };
  const submitEdit = async () => {
    setSaving(true);
    // Ensure id is present in body for PATCH
    const patchBody = { ...form, id: form._id };
    await fetch(`/api/users/teacher`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patchBody),
    });
    // Re-fetch from backend to ensure data is up-to-date
    fetch("/api/users/teacher")
      .then(res => res.json())
      .then(data => setTeachers(data));
    setSaving(false);
    closeEdit();
  };

  // Delete handler
  const openDelete = (teacher: any) => setDeleteModal({ open: true, teacher });
  const closeDelete = () => setDeleteModal({ open: false, teacher: null });
  const confirmDelete = async () => {
    setDeleting(true);
    await fetch(`/api/users/teacher`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteModal.teacher._id }),
    });
    setTeachers((prev) => prev.filter((t) => t._id !== deleteModal.teacher._id));
    setDeleting(false);
    closeDelete();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <AcademicCapIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">View Teachers</h2>
            <p className="text-gray-300">Manage and browse teacher records</p>
          </div>

          {/* Filter Section */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white border-opacity-20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Filter Teachers</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by name..." 
                value={filter.name} 
                onChange={e => setFilter(f => ({ ...f, name: e.target.value }))} 
              />
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by mobile no..." 
                value={filter.mobileNo} 
                onChange={e => setFilter(f => ({ ...f, mobileNo: e.target.value }))} 
              />
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by address..." 
                value={filter.address} 
                onChange={e => setFilter(f => ({ ...f, address: e.target.value }))} 
              />
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by subject..." 
                value={filter.subject} 
                onChange={e => setFilter(f => ({ ...f, subject: e.target.value }))} 
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading teachers...
                </div>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 text-center">
                <AcademicCapIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-300">No teachers found.</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {grouped.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {row.map((teacher, idx) => (
                    <div key={idx} className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white pr-2">{teacher.name}</h3>
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                          <AcademicCapIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="bg-white bg-opacity-5 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Mobile:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-white font-mono">{teacher.mobileNo}</span>
                              <button
                                className="p-1 bg-white bg-opacity-10 rounded hover:bg-opacity-20 transition-all duration-300"
                                onClick={() => navigator.clipboard.writeText(teacher.mobileNo)}
                                title="Copy Mobile No"
                              >
                                <ClipboardDocumentIcon className="w-3 h-3 text-gray-300" />
                              </button>
                              <a
                                href={`tel:${teacher.mobileNo}`}
                                className="p-1 bg-green-500 bg-opacity-20 rounded hover:bg-opacity-30 transition-all duration-300"
                                title="Call Teacher"
                              >
                                <PhoneIcon className="w-3 h-3 text-green-300" />
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-sm text-gray-300">
                          <span className="font-medium">Address:</span> {teacher.address}
                        </div>
                        
                        <div className="bg-white bg-opacity-5 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <BookOpenIcon className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm font-medium text-gray-300">Subjects:</span>
                          </div>
                          {Array.isArray(teacher.subjects) && teacher.subjects.length > 0 ? (
                            <div className="space-y-2">
                              {teacher.subjects.map((s: any, i: number) => (
                                <div key={i} className="bg-white bg-opacity-5 rounded-lg p-2">
                                  <div className="font-medium text-white text-sm">{s.subjectName}</div>
                                  {Array.isArray(s.classes) && s.classes.length > 0 && (
                                    <div className="text-xs text-emerald-300 mt-1">
                                      Classes: {s.classes.join(', ')}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-gray-400 text-sm">No subjects assigned</div>
                          )}
                        </div>
                        
                        <div className="bg-white bg-opacity-5 rounded-lg p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-300">Password:</span>
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-white font-mono">{teacher.password}</span>
                              <button
                                className="p-1 bg-white bg-opacity-10 rounded hover:bg-opacity-20 transition-all duration-300"
                                onClick={() => navigator.clipboard.writeText(teacher.password)}
                                title="Copy Password"
                              >
                                <ClipboardDocumentIcon className="w-3 h-3 text-gray-300" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2 mt-4">
                        <button
                          className="flex items-center gap-1 px-3 py-1 bg-emerald-500 bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg text-xs font-semibold shadow"
                          onClick={() => openEdit(teacher)}
                        >
                          <PencilIcon className="w-4 h-4" /> Edit
                        </button>
                        <button
                          className="flex items-center gap-1 px-3 py-1 bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg text-xs font-semibold shadow"
                          onClick={() => openDelete(teacher)}
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
            <h3 className="text-xl font-bold mb-4">Edit Teacher</h3>
            <div className="grid grid-cols-1 gap-4">
              <input name="name" value={form.name || ""} onChange={handleEditChange} className="border rounded p-2" placeholder="Name" />
              <input name="mobileNo" value={form.mobileNo || ""} onChange={handleEditChange} className="border rounded p-2" placeholder="Mobile No" />
              <input name="address" value={form.address || ""} onChange={handleEditChange} className="border rounded p-2" placeholder="Address" />
              <input name="password" value={form.password || ""} onChange={handleEditChange} className="border rounded p-2" placeholder="Password" />
              {/* Subjects editing can be added here if needed */}
            </div>
            <div className="flex gap-2 mt-6">
              <button className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold" onClick={submitEdit} disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold" onClick={closeEdit}>Cancel</button>
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
            <h3 className="text-xl font-bold mb-4">Delete Teacher</h3>
            <p>Are you sure you want to delete <span className="font-semibold">{deleteModal.teacher?.name}</span>?</p>
            <div className="flex gap-2 mt-6">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold" onClick={confirmDelete} disabled={deleting}>{deleting ? "Deleting..." : "Delete"}</button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold" onClick={closeDelete}>Cancel</button>
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