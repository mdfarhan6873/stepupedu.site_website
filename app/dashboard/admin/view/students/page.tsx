"use client";
import { useEffect, useState } from "react";

export default function ViewStudents() {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ class: '', name: '', mobileNo: '' });

  useEffect(() => {
    fetch("/api/users/student")
      .then(res => res.json())
      .then(data => setStudents(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = students.filter(s =>
    (filter.class === '' || (s.class && s.class.toLowerCase().includes(filter.class.toLowerCase()))) &&
    (filter.name === '' || (s.name && s.name.toLowerCase().includes(filter.name.toLowerCase()))) &&
    (filter.mobileNo === '' || (s.mobileNo && s.mobileNo.includes(filter.mobileNo)))
  );

  // Group students into rows of 2 or 3 for horizontal card layout
  const groupSize = filtered.length <= 4 ? 2 : 3;
  const grouped = [];
  for (let i = 0; i < filtered.length; i += groupSize) {
    grouped.push(filtered.slice(i, i + groupSize));
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Students</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <input
          className="input w-full max-w-xs"
          placeholder="Filter by class..."
          value={filter.class}
          onChange={e => setFilter(f => ({ ...f, class: e.target.value }))}
        />
        <input
          className="input w-full max-w-xs"
          placeholder="Filter by name..."
          value={filter.name}
          onChange={e => setFilter(f => ({ ...f, name: e.target.value }))}
        />
        <input
          className="input w-full max-w-xs"
          placeholder="Filter by mobile no..."
          value={filter.mobileNo}
          onChange={e => setFilter(f => ({ ...f, mobileNo: e.target.value }))}
        />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-400">No students found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-4">
              {row.map((student, idx) => (
                <div key={idx} className="flex-1 bg-white rounded shadow p-4 flex flex-col gap-2 border min-w-[220px]">
                  <div className="font-semibold text-lg">{student.name}</div>
                  <div className="text-sm text-gray-600">Roll No: {student.rollNo}</div>
                  <div className="text-sm text-gray-600">Class: {student.class}</div>
                  <div className="text-sm text-gray-600">Section: {student.section}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    Mobile: <span>{student.mobileNo}</span>
                    <button
                      className="text-blue-600 text-xs border px-1 rounded hover:bg-blue-50"
                      onClick={() => navigator.clipboard.writeText(student.mobileNo)}
                      title="Copy Mobile No"
                    >Copy</button>
                  </div>
                  <div className="text-sm text-gray-600">Parent Name: {student.parentName}</div>
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    Parent Mobile: <span>{student.parentMobileNo}</span>
                    <button
                      className="text-blue-600 text-xs border px-1 rounded hover:bg-blue-50"
                      onClick={() => navigator.clipboard.writeText(student.parentMobileNo)}
                      title="Copy Parent Mobile No"
                    >Copy</button>
                  </div>
                  <div className="text-sm text-gray-600">Address: {student.address}</div>
                  <div className="text-sm text-gray-600">Password: {student.password}</div>
                  <div className="text-xs text-gray-400 mt-2">ID: {student._id}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
