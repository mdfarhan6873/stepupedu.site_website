'use client'
import React, { useEffect, useState } from 'react';
import { DocumentTextIcon, PlusIcon, LinkIcon, ClipboardDocumentIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const Notes = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch('/api/notes');
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setNotes(data.reverse());
    } catch (err: any) {
      setError(err.message || 'Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message, url }),
      });
      if (!res.ok) throw new Error('Failed to add note');
      setTitle("");
      setMessage("");
      setUrl("");
      setSuccess('Note added successfully!');
      fetchNotes();
    } catch (err: any) {
      setError(err.message || 'Failed to add note');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-violet-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl px-4 py-2 text-white hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>
          </div>

          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl flex items-center justify-center">
                <DocumentTextIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Notes</h2>
            <p className="text-gray-300">Create and manage educational notes</p>
          </div>

          {/* Add Note Form */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 border border-white border-opacity-20 shadow-xl mb-8">
            <div className="flex items-center gap-2 mb-6">
              <PlusIcon className="w-5 h-5 text-violet-400" />
              <h3 className="text-lg font-semibold text-white">Add New Note</h3>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white mb-2">Title</label>
                <input
                  type="text"
                  placeholder="Enter note title"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Message</label>
                <textarea
                  placeholder="Enter note content"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300 resize-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Attachment URL (optional)</label>
                <input
                  type="url"
                  placeholder="https://example.com/attachment"
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              {/* Messages */}
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-xl p-4">
                  <div className="text-red-300 text-center">{error}</div>
                </div>
              )}
              {success && (
                <div className="bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-xl p-4">
                  <div className="text-green-300 text-center">{success}</div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </div>
                ) : (
                  "Add Note"
                )}
              </button>
            </form>
          </div>

          {/* Notes List */}
          <div className="space-y-6">
            <h3 className="text-xl font-bold text-white">Your Notes</h3>
            
            {notes.length === 0 && !loading ? (
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 text-center">
                <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-300">No notes yet. Create your first note above!</div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {notes.map((note: any) => (
                  <div key={note._id} className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-[1.02]">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-lg font-semibold text-white pr-2">{note.title}</h4>
                      <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <DocumentTextIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-300 bg-white bg-opacity-5 rounded-lg p-3 mb-4 whitespace-pre-line">
                      {note.message}
                    </div>
                    
                    {note.url && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <LinkIcon className="w-4 h-4 text-violet-400" />
                          <span className="text-sm text-gray-300">Attachment:</span>
                          <button
                            className="p-1 bg-white bg-opacity-10 rounded hover:bg-opacity-20 transition-all duration-300"
                            onClick={() => navigator.clipboard.writeText(note.url)}
                            title="Copy Link"
                          >
                            <ClipboardDocumentIcon className="w-3 h-3 text-gray-300" />
                          </button>
                        </div>
                        <a 
                          href={note.url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-sm text-blue-300 hover:text-blue-200 underline break-all bg-white bg-opacity-5 rounded-lg p-2 block transition-colors duration-300"
                        >
                          {note.url}
                        </a>
                      </div>
                    )}
                    
                    <div className="text-xs text-gray-400 pt-4 border-t border-white border-opacity-10">
                      Created: {new Date(note.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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

export default Notes;