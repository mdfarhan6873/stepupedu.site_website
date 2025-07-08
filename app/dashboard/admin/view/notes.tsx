import React, { useEffect, useState } from 'react';

interface Note {
  _id: string;
  title: string;
  content: string;
  [key: string]: any;
}

const NotesView = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selected, setSelected] = useState<Note | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', content: '' });

  useEffect(() => { fetchNotes(); }, []);

  const fetchNotes = async () => {
    const res = await fetch('/api/notes');
    const data = await res.json();
    setNotes(data);
  };

  const handleEdit = (note: Note) => {
    setSelected(note);
    setForm({ title: note.title, content: note.content });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this note?')) return;
    await fetch('/api/notes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchNotes();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    await fetch('/api/notes', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected._id, ...form }),
    });
    setShowModal(false);
    setSelected(null);
    fetchNotes();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Notes</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Content</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notes.map((n) => (
            <tr key={n._id}>
              <td className="border px-2 py-1">{n.title}</td>
              <td className="border px-2 py-1">{n.content}</td>
              <td className="border px-2 py-1">
                <button className="mr-2 text-blue-600" onClick={() => handleEdit(n)}>Edit</button>
                <button className="text-red-600" onClick={() => handleDelete(n._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
            <h3 className="text-lg font-bold mb-2">Edit Note</h3>
            <form onSubmit={handleSubmit}>
              <input className="border p-1 mb-2 w-full" name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
              <textarea className="border p-1 mb-2 w-full" name="content" value={form.content} onChange={handleChange} placeholder="Content" required />
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesView;
