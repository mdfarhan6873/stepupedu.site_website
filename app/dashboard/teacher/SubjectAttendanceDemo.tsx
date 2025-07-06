import React, { useState } from 'react';
import { usePatchSubjectAttendance } from '@/lib/hooks/usePatchSubjectAttendance';

export default function SubjectAttendanceDemo() {
  const [form, setForm] = useState({
    className: '',
    section: '',
    date: '',
    subject: '',
    students: '', // JSON string for demo
  });
  const { patchAttendance, loading, error, data } = usePatchSubjectAttendance();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await patchAttendance({
        className: form.className,
        section: form.section,
        date: form.date,
        subject: form.subject,
        students: JSON.parse(form.students),
      });
    } catch {}
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-bold mb-2">Demo: Patch Subject Attendance</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input name="className" value={form.className} onChange={handleChange} placeholder="Class" className="border p-2 w-full" />
        <input name="section" value={form.section} onChange={handleChange} placeholder="Section" className="border p-2 w-full" />
        <input name="date" value={form.date} onChange={handleChange} placeholder="Date (YYYY-MM-DD)" className="border p-2 w-full" />
        <input name="subject" value={form.subject} onChange={handleChange} placeholder="Subject" className="border p-2 w-full" />
        <textarea name="students" value={form.students} onChange={handleChange} placeholder='[{"studentId":"...","status":"Present"}]' className="border p-2 w-full" rows={3} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Submit</button>
      </form>
      {loading && <div className="text-blue-600">Loading...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {data && <pre className="bg-gray-100 p-2 mt-2 text-xs overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
