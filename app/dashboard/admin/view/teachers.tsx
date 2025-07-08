import React, { useEffect, useState } from 'react';

interface Teacher {
  _id: string;
  name: string;
  mobileNo: string;
  address: string;
  subjects: any;
  [key: string]: any;
}

const TeachersView = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selected, setSelected] = useState<Teacher | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', mobileNo: '', address: '', subjects: '' });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    const res = await fetch('/api/users/teacher');
    const data = await res.json();
    setTeachers(data);
  };

  const handleEdit = (teacher: Teacher) => {
    setSelected(teacher);
    setForm({
      name: teacher.name,
      mobileNo: teacher.mobileNo,
      address: teacher.address,
      subjects: teacher.subjects?.map((s: any) => `${s.subjectName}[${s.classes.join(',')}]`).join(', ') || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this teacher?')) return;
    await fetch('/api/users/teacher', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchTeachers();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    await fetch('/api/users/teacher', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected._id, ...form }),
    });
    setShowModal(false);
    setSelected(null);
    fetchTeachers();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Teachers</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Mobile</th>
            <th className="border px-2 py-1">Address</th>
            <th className="border px-2 py-1">Subjects</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((t) => (
            <tr key={t._id}>
              <td className="border px-2 py-1">{t.name}</td>
              <td className="border px-2 py-1">{t.mobileNo}</td>
              <td className="border px-2 py-1">{t.address}</td>
              <td className="border px-2 py-1">{t.subjects?.map((s: any) => `${s.subjectName}[${s.classes.join(',')}]`).join(', ')}</td>
              <td className="border px-2 py-1">
                <button className="mr-2 text-blue-600" onClick={() => handleEdit(t)}>Edit</button>
                <button className="text-red-600" onClick={() => handleDelete(t._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[300px]">
            <h3 className="text-lg font-bold mb-2">Edit Teacher</h3>
            <form onSubmit={handleSubmit}>
              <input
                className="border p-1 mb-2 w-full"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                required
              />
              <input
                className="border p-1 mb-2 w-full"
                name="mobileNo"
                value={form.mobileNo}
                onChange={handleChange}
                placeholder="Mobile No"
                required
              />
              <input
                className="border p-1 mb-2 w-full"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Address"
                required
              />
              <input
                className="border p-1 mb-2 w-full"
                name="subjects"
                value={form.subjects}
                onChange={handleChange}
                placeholder="Subjects (e.g. Math[6,7], Science[8])"
                required
              />
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

export default TeachersView;
