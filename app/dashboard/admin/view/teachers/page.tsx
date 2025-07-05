"use client";
import { useEffect, useState } from "react";

export default function ViewTeachers() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ name: '', mobileNo: '', address: '', subject: '' });

  useEffect(() => {
    fetch("/api/users/teacher")
      .then(res => res.json())
      .then(data => setTeachers(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = teachers.filter(t =>
    (filter.name === '' || (t.name && t.name.toLowerCase().includes(filter.name.toLowerCase()))) &&
    (filter.mobileNo === '' || (t.mobileNo && t.mobileNo.includes(filter.mobileNo))) &&
    (filter.address === '' || (t.address && t.address.toLowerCase().includes(filter.address.toLowerCase()))) &&
    (filter.subject === '' || (Array.isArray(t.subjects) && t.subjects.some((s: any) => s.subjectName.toLowerCase().includes(filter.subject.toLowerCase()))))
  );

  const groupSize = filtered.length <= 4 ? 2 : 3;
  const grouped = [];
  for (let i = 0; i < filtered.length; i += groupSize) {
    grouped.push(filtered.slice(i, i + groupSize));
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Teachers</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <input className="input w-full max-w-xs" placeholder="Filter by name..." value={filter.name} onChange={e => setFilter(f => ({ ...f, name: e.target.value }))} />
        <input className="input w-full max-w-xs" placeholder="Filter by mobile no..." value={filter.mobileNo} onChange={e => setFilter(f => ({ ...f, mobileNo: e.target.value }))} />
        <input className="input w-full max-w-xs" placeholder="Filter by address..." value={filter.address} onChange={e => setFilter(f => ({ ...f, address: e.target.value }))} />
        <input className="input w-full max-w-xs" placeholder="Filter by subject..." value={filter.subject} onChange={e => setFilter(f => ({ ...f, subject: e.target.value }))} />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-400">No teachers found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-4">
              {row.map((teacher, idx) => (
                <div key={idx} className="flex-1 bg-white rounded shadow p-4 flex flex-col gap-2 border min-w-[220px]">
                  <div className="font-semibold text-lg">{teacher.name}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    Mobile: <span>{teacher.mobileNo}</span>
                    <button
                      className="text-blue-600 text-xs border px-1 rounded hover:bg-blue-50"
                      onClick={() => navigator.clipboard.writeText(teacher.mobileNo)}
                      title="Copy Mobile No"
                    >Copy</button>
                  </div>
                  <div className="text-sm text-gray-600">Address: {teacher.address}</div>
                  <div className="text-sm text-gray-600">
                    Subjects:
                    {Array.isArray(teacher.subjects) && teacher.subjects.length > 0 ? (
                      <ul className="list-disc ml-4">
                        {teacher.subjects.map((s: any, i: number) => (
                          <li key={i}>
                            <span className="font-medium">{s.subjectName}</span>
                            {Array.isArray(s.classes) && s.classes.length > 0 && (
                              <span className="text-xs text-gray-500"> (Classes: {s.classes.join(', ')})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span> - </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    Password: <span>{teacher.password}</span>
                    <button
                      className="text-blue-600 text-xs border px-1 rounded hover:bg-blue-50"
                      onClick={() => navigator.clipboard.writeText(teacher.password)}
                      title="Copy Password"
                    >Copy</button>
                  </div>
                  <div className="text-xs text-gray-400 mt-2">ID: {teacher._id}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
