'use client'
import React, { useEffect, useState } from 'react';

const MarkAttendance = () => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [date, setDate] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Set current year, month, date on mount
  useEffect(() => {
    const now = new Date();
    setYear(now.getFullYear().toString());
    setMonth((now.getMonth() + 1).toString().padStart(2, '0'));
    setDate(now.toISOString().slice(0, 10));
  }, []);

  // Fetch students for selected class/section
  useEffect(() => {
    if (className && section) {
      setLoading(true);
      fetch(`/api/users/student?class=${className}&section=${section}`)
        .then(res => res.json())
        .then(data => {
          setStudents(data);
          setAttendance(
            Object.fromEntries(
              data.map((s: any) => [s._id, { status: "present" }])
            )
          );
        })
        .catch(() => setError("Failed to fetch students"))
        .finally(() => setLoading(false));
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [className, section]);

  const handleStatusToggle = (id: string) => {
    setAttendance((prev: any) => {
      const current = prev[id]?.status || "present";
      let next = "present";
      if (current === "present") next = "absent";
      else if (current === "absent") next = "leave";
      else next = "present";
      return { ...prev, [id]: { status: next } };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");
    try {
      const entry = {
        date,
        class: className,
        section,
        subject,
        students: students.map((s: any) => ({
          studentName: s.name,
          rollNo: s.rollNo,
          status: attendance[s._id]?.status || "absent",
        })),
      };
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ year, month, entry }),
      });
      if (!res.ok) throw new Error("Failed to save attendance");
      setSuccess("Attendance saved successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2 sm:p-6 max-w-2xl mx-auto w-full">
      <h2 className="text-lg sm:text-xl font-bold mb-4 text-center">Mark Attendance</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <div className="flex gap-2 w-full sm:w-auto justify-center">
            <span className="bg-gray-100 rounded px-3 py-2 text-sm font-medium">Year: {year}</span>
            <span className="bg-gray-100 rounded px-3 py-2 text-sm font-medium">Month: {month}</span>
            <span className="bg-gray-100 rounded px-3 py-2 text-sm font-medium">Date: {date}</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <input type="text" placeholder="Class" value={className} onChange={e => setClassName(e.target.value)} className="border rounded px-3 py-2 w-full sm:w-24 text-sm focus:ring-2 focus:ring-blue-200" required />
          <input type="text" placeholder="Section" value={section} onChange={e => setSection(e.target.value)} className="border rounded px-3 py-2 w-full sm:w-24 text-sm focus:ring-2 focus:ring-blue-200" required />
          <input type="text" placeholder="Subject" value={subject} onChange={e => setSubject(e.target.value)} className="border rounded px-3 py-2 w-full sm:w-auto text-sm focus:ring-2 focus:ring-blue-200" required />
        </div>
        {students.length > 0 && (
          <div className="overflow-x-auto rounded shadow border bg-white mt-2">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border px-2 py-2 w-20">Roll No</th>
                  <th className="border px-2 py-2">Name</th>
                  <th className="border px-2 py-2 w-20 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {students
                  .sort((a, b) => (a.rollNo || 0) - (b.rollNo || 0))
                  .map((s: any) => (
                  <tr key={s._id} className="hover:bg-blue-50 transition">
                    <td className="border px-2 py-2 text-center font-semibold">{s.rollNo}</td>
                    <td className="border px-2 py-2">{s.name}</td>
                    <td className="border px-2 py-2 text-center">
                      <button
                        type="button"
                        aria-label="Toggle status"
                        onClick={() => handleStatusToggle(s._id)}
                        className="focus:outline-none"
                      >
                        {attendance[s._id]?.status === "present" && (
                          <span title="Present" className="text-green-600 text-2xl sm:text-xl">✔️</span>
                        )}
                        {attendance[s._id]?.status === "absent" && (
                          <span title="Absent" className="text-red-500 text-2xl sm:text-xl">❌</span>
                        )}
                        {attendance[s._id]?.status === "leave" && (
                          <span title="Leave" className="text-yellow-500 text-2xl sm:text-xl">⏸️</span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {error && <div className="text-red-500 text-center text-sm">{error}</div>}
        {success && <div className="text-green-600 text-center text-sm">{success}</div>}
        <button type="submit" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold transition disabled:opacity-60" disabled={loading}>
          {loading ? "Saving..." : "Save Attendance"}
        </button>
      </form>
    </div>
  );
};

export default MarkAttendance;
