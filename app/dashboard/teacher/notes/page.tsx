'use client'
import React, { useEffect, useState } from 'react';

const Notes = () => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [url, setUrl] = useState("");
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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
    <div className="p-2 sm:p-6 max-w-2xl mx-auto w-full">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">Notes</h2>
      <form onSubmit={handleSubmit} className="space-y-3 bg-white rounded shadow p-4 mb-6">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="border rounded px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-200"
          required
        />
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
          className="border rounded px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-200"
          rows={3}
          required
        />
        <input
          type="url"
          placeholder="Attachment URL (optional)"
          value={url}
          onChange={e => setUrl(e.target.value)}
          className="border rounded px-3 py-2 w-full text-sm focus:ring-2 focus:ring-blue-200"
        />
        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center">{success}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition disabled:opacity-60"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Add Note'}
        </button>
      </form>
      <div className="space-y-4">
        {notes.length === 0 && !loading && (
          <div className="text-center text-gray-500">No notes yet.</div>
        )}
        {notes.map((note: any) => (
          <div key={note._id} className="bg-white rounded shadow p-4 border">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
              <div className="font-semibold text-base text-blue-700">{note.title}</div>
              <div className="text-xs text-gray-400 mt-1 sm:mt-0">{new Date(note.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-gray-800 whitespace-pre-line mb-2">{note.message}</div>
            {note.url && (
              <a href={note.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline break-all text-sm">Attachment</a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
