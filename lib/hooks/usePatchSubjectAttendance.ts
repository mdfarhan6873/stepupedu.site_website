import { useState } from 'react';

export function usePatchSubjectAttendance() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const patchAttendance = async ({ className, section, date, subject, students }: {
    className: string;
    section: string;
    date: string;
    subject: string;
    students: { studentId: string; status: 'Present' | 'Absent' }[];
  }) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch('/api/attendance/subject', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ className, section, date, subject, students })
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Failed to update attendance');
      setData(result);
      return result;
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { patchAttendance, loading, error, data };
}
