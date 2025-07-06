'use client';
import React, { useEffect, useState } from 'react';
import { DocumentTextIcon, ArrowLeftIcon, LinkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    fetch('/api/notes')
      .then(res => res.json())
      .then(data => setNotes(data))
      .catch(() => setError('Failed to fetch notes'))
      .finally(() => setLoading(false));
  }, []);

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
            <p className="text-gray-300">Access your educational notes and materials</p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading notes...
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-500 bg-opacity-20 backdrop-blur-xl rounded-2xl p-8 border border-red-500 border-opacity-30 text-center">
              <div className="text-red-300">{error}</div>
            </div>
          ) : notes.length === 0 ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 text-center">
              <DocumentTextIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-300">No notes found.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {notes.map((note: any) => (
                <div key={note._id} className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white pr-2">{note.title}</h3>
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
                    {note.createdAt ? new Date(note.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Date not available'}
                  </div>
                </div>
              ))}
            </div>
          )}
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