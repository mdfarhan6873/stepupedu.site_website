import React, { useEffect, useState } from 'react';

interface Schedule {
  _id: string;
  title: string;
  date: string;
  [key: string]: any;
}

const SchedulesView = () => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [selected, setSelected] = useState<Schedule | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: '', date: '' });

  useEffect(() => { fetchSchedules(); }, []);

  const fetchSchedules = async () => {
    const res = await fetch('/api/schedule');
    const data = await res.json();
    setSchedules(data);
  };

  const handleEdit = (schedule: Schedule) => {
    setSelected(schedule);
    setForm({ title: schedule.title, date: schedule.date });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this schedule?')) return;
    await fetch('/api/schedule', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchSchedules();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    await fetch('/api/schedule', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected._id, ...form }),
    });
    setShowModal(false);
    setSelected(null);
    fetchSchedules();
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Schedules</h2>
      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-2 py-1">Title</th>
            <th className="border px-2 py-1">Date</th>
            <th className="border px-2 py-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s) => (
            <tr key={s._id}>
              <td className="border px-2 py-1">{s.title}</td>
              <td className="border px-2 py-1">{s.date}</td>
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
            <h3 className="text-lg font-bold mb-2">Edit Schedule</h3>
            <form onSubmit={handleSubmit}>
              <input className="border p-1 mb-2 w-full" name="title" value={form.title} onChange={handleChange} placeholder="Title" required />
              <input className="border p-1 mb-2 w-full" name="date" value={form.date} onChange={handleChange} placeholder="Date" required />
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

export default SchedulesView;
