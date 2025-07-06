'use client'
import React, { useEffect, useState } from 'react'

function getMonthName(month: number) {
  return new Date(2025, month - 1, 1).toLocaleString('default', { month: 'long' });
}

const attendance = () => {
  const [user, setUser] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Get user from session cookie
    const sessionData = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('session='));
    if (sessionData) {
      try {
        const userData = JSON.parse(decodeURIComponent(sessionData.split('=')[1]));
        setUser(userData.user);
      } catch {
        setError('Session error');
        setLoading(false);
        return;
      }
    } else {
      setError('Not logged in');
      setLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    // Fetch attendance for this student by class, section, and studentId
    fetch(`/api/attendance/student?class=${user.class}&section=${user.section}&studentId=${user.id}`)
      .then(res => res.json())
      .then(data => setAttendanceData(data))
      .catch(() => setError('Failed to fetch attendance'))
      .finally(() => setLoading(false));
  }, [user]);

  // Calculate monthly summary
  const monthlySummary = Array.from({ length: 12 }, (_, i) => {
    const month = (i + 1).toString().padStart(2, '0');
    const monthData = attendanceData.filter((a: any) => a.date && a.date.slice(5, 7) === month);
    let present = 0, absent = 0;
    monthData.forEach((a: any) => {
      a.subjects?.forEach((subj: any) => {
        subj.students?.forEach((stu: any) => {
          if (stu.studentId === user?.id) {
            if (stu.status === 'Present') present++;
            if (stu.status === 'Absent') absent++;
          }
        });
      });
    });
    const total = present + absent;
    const percent = total ? Math.round((present / total) * 100) : 0;
    return { month: getMonthName(i + 1), present, absent, percent };
  });

  if (loading) return <div className="text-center py-10 text-lg text-gray-400">Loading attendance...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-white">Attendance Summary (2025)</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {monthlySummary.map((m, idx) => (
          <div key={m.month} className="bg-white bg-opacity-10 rounded-2xl p-4 flex flex-col items-center border border-white border-opacity-20">
            <div className="text-lg font-semibold mb-2 text-white">{m.month}</div>
            <div className="flex gap-4 mb-2">
              <span className="text-green-400 font-bold">Present: {m.present}</span>
              <span className="text-red-400 font-bold">Absent: {m.absent}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
              <div className="bg-green-400 h-3 rounded-full" style={{ width: `${m.percent}%` }}></div>
            </div>
            <div className="text-sm text-white">Attendance: <span className="font-bold">{m.percent}%</span></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default attendance