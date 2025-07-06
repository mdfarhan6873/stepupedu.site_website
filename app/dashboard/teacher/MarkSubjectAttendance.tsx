import React, { useState, useEffect } from 'react';
import { usePatchSubjectAttendance } from '@/lib/hooks/usePatchSubjectAttendance';

// Dummy fetchStudents function (replace with real API call)
async function fetchStudents(className: string, section: string) {
  // Replace with your real API endpoint
  const res = await fetch(`/api/users/student?class=${className}&section=${section}`);
  if (!res.ok) throw new Error('Failed to fetch students');
  return res.json();
}

export default function MarkSubjectAttendance() {
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState('');
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent'>>({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const { patchAttendance, loading, error, data } = usePatchSubjectAttendance();

  useEffect(() => {
    if (className && section) {
      setLoadingStudents(true);
      fetchStudents(className, section)
        .then((data) => {
          setStudents(data);
          // Default all to Present
          const initial: Record<string, 'Present' | 'Absent'> = {};
          data.forEach((s: any) => {
            initial[s._id] = 'Present';
          });
          setAttendance(initial);
        })
        .catch(() => setStudents([]))
        .finally(() => setLoadingStudents(false));
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [className, section]);

  const handleToggle = (studentId: string) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: prev[studentId] === 'Present' ? 'Absent' : 'Present',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await patchAttendance({
      className,
      section,
      date,
      subject,
      students: students.map((s) => ({ studentId: s._id, status: attendance[s._id] })),
    });
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Mark Subject Attendance</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-2">
          <input value={className} onChange={e => setClassName(e.target.value)} placeholder="Class" className="border p-2 flex-1" required />
          <input value={section} onChange={e => setSection(e.target.value)} placeholder="Section" className="border p-2 flex-1" required />
        </div>
        <div className="flex gap-2">
          <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Subject" className="border p-2 flex-1" required />
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 flex-1" required />
        </div>
        <div>
          <h3 className="font-semibold mb-1">Students</h3>
          {loadingStudents && <div>Loading students...</div>}
          {!loadingStudents && students.length === 0 && <div className="text-gray-500">Select class and section to load students.</div>}
          <ul className="divide-y">
            {students.map((student) => (
              <li key={student._id} className="flex items-center justify-between py-2">
                <span>{student.name} ({student.rollNo})</span>
                <button
                  type="button"
                  className={`px-3 py-1 rounded ${attendance[student._id] === 'Present' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
                  onClick={() => handleToggle(student._id)}
                >
                  {attendance[student._id]}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading || students.length === 0}>Submit Attendance</button>
      </form>
      {loading && <div className="text-blue-600">Saving...</div>}
      {error && <div className="text-red-600">Error: {error}</div>}
      {data && <pre className="bg-gray-100 p-2 mt-2 text-xs overflow-x-auto">{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
