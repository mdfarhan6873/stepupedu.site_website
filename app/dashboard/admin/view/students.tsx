import React, { useEffect, useState } from 'react';

interface Student {
  _id: string;
  name: string;
  class: string;
  section: string;
  [key: string]: any;
}

const StudentsView = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [selected, setSelected] = useState<Student | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', class: '', section: '' });

  useEffect(() => { fetchStudents(); }, []);

  const fetchStudents = async () => {
    const res = await fetch('/api/users/student');
    const data = await res.json();
    setStudents(data);
  };

  const handleEdit = (student: Student) => {
    setSelected(student);
    setForm({ name: student.name, class: student.class, section: student.section });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this student?')) return;
    await fetch('/api/users/student', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchStudents();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    await fetch('/api/users/student', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected._id, ...form }),
    });
    setShowModal(false);
    setSelected(null);
    fetchStudents();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Students</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Class</th>
            <th className="border px-2 py-1">Section</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s._id}>
              <td className="border px-2 py-1">{s.name}</td>
              <td className="border px-2 py-1">{s.class}</td>
              <td className="border px-2 py-1">{s.section}</td>
              <td className="border px-2 py-1">
                <button className="mr-2 text-blue-600" onClick={() => handleEdit(s)}>Edit</button>
                <button className="text-red-600" onClick={() => handleDelete(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
            <h3 className="text-lg font-bold mb-2">Edit Student</h3>
            <form onSubmit={handleSubmit}>
              <input className="border p-1 mb-2 w-full" name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
              <input className="border p-1 mb-2 w-full" name="class" value={form.class} onChange={handleChange} placeholder="Class" required />
              <input className="border p-1 mb-2 w-full" name="section" value={form.section} onChange={handleChange} placeholder="Section" required />
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

export default StudentsView;
