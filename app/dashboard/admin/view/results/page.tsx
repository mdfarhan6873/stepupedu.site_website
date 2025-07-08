'use client'
import React, { useEffect, useState } from 'react';
import { ChartBarIcon, MagnifyingGlassIcon, PencilIcon, TrashIcon, XMarkIcon, LinkIcon } from '@heroicons/react/24/outline';

const ResultsViewPage = () => {
  const [tab, setTab] = useState<'together' | 'individual'>('together');
  const [results, setResults] = useState([]);
  const [filter, setFilter] = useState({ title: '', date: '' });
  const [filteredResults, setFilteredResults] = useState([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({ title: '', message: '', link: '' });
  const [showDeleteId, setShowDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchResults = () => {
    fetch('/api/results')
      .then(res => res.json())
      .then(data => setResults(data));
  };

  useEffect(() => {
    if (tab === 'together') {
      fetchResults();
    }
  }, [tab]);

  useEffect(() => {
    let filtered = results;
    if (filter.title) {
      filtered = filtered.filter((r: any) => r.title.toLowerCase().includes(filter.title.toLowerCase()));
    }
    if (filter.date) {
      filtered = filtered.filter((r: any) => r.createdAt && r.createdAt.startsWith(filter.date));
    }
    setFilteredResults(filtered);
  }, [filter, results]);

  const openEdit = (r: any) => {
    setEditId(r._id);
    setEditForm({ title: r.title, message: r.message, link: r.link || '' });
    setError('');
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/results', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editId, ...editForm }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update result');
      }
      setEditId(null);
      fetchResults();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/results', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: showDeleteId }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete result');
      }
      setShowDeleteId(null);
      fetchResults();
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative">
      {/* Animated Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      <div className="relative z-10 min-h-screen px-2 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <ChartBarIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">View Results</h2>
            <p className="text-gray-300">Manage and browse results</p>
          </div>
          {/* Tabs */}
          <div className="flex gap-4 justify-center mb-6">
            <button className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${tab === 'together' ? 'bg-pink-600 text-white' : 'bg-white bg-opacity-20 text-pink-200'}`} onClick={() => setTab('together')}>Together Results</button>
            <button className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-200 ${tab === 'individual' ? 'bg-pink-600 text-white' : 'bg-white bg-opacity-20 text-pink-200'}`} onClick={() => setTab('individual')}>Individual Results</button>
          </div>
          {/* Filter Section */}
          {tab === 'together' && (
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-2 mb-8 border border-white border-opacity-20 shadow-xl">
              <div className="flex items-center gap-2 mb-4">
                <MagnifyingGlassIcon className="w-5 h-5 text-white" />
                <h3 className="text-lg font-semibold text-white">Filter Results</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input type="text" placeholder="Filter by title..." className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300" value={filter.title} onChange={e => setFilter(f => ({ ...f, title: e.target.value }))} />
                <input type="date" className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300" value={filter.date} onChange={e => setFilter(f => ({ ...f, date: e.target.value }))} />
              </div>
              {/* Results Cards */}
              {filteredResults.length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <ChartBarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-300">No results found.</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResults.map((r: any) => (
                    <div key={r._id} className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-[1.02] flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white pr-2 break-words">{r.title}</h3>
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <ChartBarIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className="mb-4">
                        <div className="text-sm text-gray-300 mb-2 break-words"><span className="font-medium text-white">Message:</span> {r.message}</div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-sm text-gray-300">Link:</span>
                          {r.link ? (
                            <a href={r.link} className="inline-flex items-center gap-1 text-pink-400 underline" target="_blank" rel="noopener noreferrer">
                              <LinkIcon className="w-4 h-4" /> Link
                            </a>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </div>
                        <div className="text-sm text-gray-300"><span className="font-medium">Date:</span> {r.createdAt ? new Date(r.createdAt).toLocaleDateString() : '-'}</div>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button className="flex items-center gap-1 px-3 py-1 bg-blue-500 bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg text-xs font-semibold shadow" onClick={() => openEdit(r)}>
                          <PencilIcon className="w-4 h-4" /> Edit
                        </button>
                        <button className="flex items-center gap-1 px-3 py-1 bg-red-500 bg-opacity-80 hover:bg-opacity-100 text-white rounded-lg text-xs font-semibold shadow" onClick={() => setShowDeleteId(r._id)}>
                          <TrashIcon className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {tab === 'individual' && (
            <div className="text-white text-center py-12 opacity-60 bg-white bg-opacity-10 rounded-2xl">(Individual Results tab coming soon...)</div>
          )}
        </div>
      </div>
      {/* Edit Modal */}
      {editId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <form onSubmit={handleEditSubmit} className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg relative">
            <button type="button" className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setEditId(null)}>
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-4">Edit Result</h3>
            <div className="grid grid-cols-1 gap-4">
              <input name="title" value={editForm.title} onChange={handleEditChange} className="border rounded p-2" placeholder="Title" required />
              <textarea name="message" value={editForm.message} onChange={handleEditChange} className="border rounded p-2" placeholder="Message" required />
              <input name="link" value={editForm.link} onChange={handleEditChange} className="border rounded p-2" placeholder="Link (optional)" />
            </div>
            {error && <div className="text-red-500 font-semibold mt-2">{error}</div>}
            <div className="flex gap-2 mt-6">
              <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</button>
              <button type="button" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold" onClick={() => setEditId(null)}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      {/* Delete Modal */}
      {showDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md relative">
            <button className="absolute top-3 right-3 text-gray-400 hover:text-gray-700" onClick={() => setShowDeleteId(null)}>
              <XMarkIcon className="w-6 h-6" />
            </button>
            <h3 className="text-xl font-bold mb-4">Delete Result</h3>
            <p>Are you sure you want to delete this result?</p>
            {error && <div className="text-red-500 font-semibold mb-2">{error}</div>}
            <div className="flex gap-2 mt-6">
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold" onClick={handleDelete} disabled={loading}>{loading ? 'Deleting...' : 'Delete'}</button>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold" onClick={() => setShowDeleteId(null)}>Cancel</button>
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
};

export default ResultsViewPage;
