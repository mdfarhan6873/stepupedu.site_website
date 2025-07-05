"use client";
import { useEffect, useState } from "react";

export default function ViewNotes() {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ title: '', content: '' });

  useEffect(() => {
    fetch("/api/notes")
      .then(res => res.json())
      .then(data => setNotes(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = notes.filter(n =>
    (filter.title === '' || (n.title && n.title.toLowerCase().includes(filter.title.toLowerCase()))) &&
    (filter.content === '' || (n.content && n.content.toLowerCase().includes(filter.content.toLowerCase())))
  );

  const groupSize = filtered.length <= 4 ? 2 : 3;
  const grouped = [];
  for (let i = 0; i < filtered.length; i += groupSize) {
    grouped.push(filtered.slice(i, i + groupSize));
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Notes</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <input className="input w-full max-w-xs" placeholder="Filter by title..." value={filter.title} onChange={e => setFilter(f => ({ ...f, title: e.target.value }))} />
        <input className="input w-full max-w-xs" placeholder="Filter by content..." value={filter.content} onChange={e => setFilter(f => ({ ...f, content: e.target.value }))} />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-400">No notes found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-4">
              {row.map((note, idx) => (
                <div key={idx} className="flex-1 bg-white rounded shadow p-4 flex flex-col gap-2 border min-w-[220px]">
                  <div className="font-semibold text-lg">{note.title}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    Message: <span>{note.message}</span>
                    <button
                      className="text-blue-600 text-xs border px-1 rounded hover:bg-blue-50"
                      onClick={() => navigator.clipboard.writeText(note.message)}
                      title="Copy Message"
                    >Copy</button>
                  </div>
                  {note.url && (
                    <div className="text-sm text-gray-600 flex items-center gap-2">
                      Link: <a href={note.url} target="_blank" rel="noopener noreferrer" className="underline text-blue-700 break-all">{note.url}</a>
                      <button
                        className="text-blue-600 text-xs border px-1 rounded hover:bg-blue-50"
                        onClick={() => navigator.clipboard.writeText(note.url)}
                        title="Copy Link"
                      >Copy</button>
                    </div>
                  )}
                  <div className="text-xs text-gray-400 mt-2">ID: {note._id}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
