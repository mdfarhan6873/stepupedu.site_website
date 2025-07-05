'use client'
import React, { useEffect, useState } from 'react';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedules = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/schedule');
        const data = await res.json();
        setSchedules(data);
      } catch (err) {
        setError('Failed to fetch schedules');
      } finally {
        setLoading(false);
      }
    };
    fetchSchedules();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">Schedules</h2>
      {schedules.length === 0 ? <div>No schedules found.</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {schedules.map((s: any, i: number) => (
            <div key={s._id || i} className="bg-white rounded shadow p-4 flex flex-col gap-2">
              <div className="font-bold text-lg text-blue-700">Class: {s.class} - Section: {s.section}</div>
              {s.week && s.week.length > 0 ? (
                <div className="mt-2">
                  <div className="font-semibold mb-1">Weekly Schedule:</div>
                  <ul className="list-disc ml-4">
                    {s.week.map((day: any, di: number) => (
                      <li key={di} className="mb-1">
                        <span className="font-semibold">{day.day}:</span>
                        <ul className="ml-4">
                          {day.periods && day.periods.length > 0 ? day.periods.map((p: any, pi: number) => (
                            <li key={pi}>
                              {p.startTime} - {p.endTime}: {p.subject} ({p.teacherName})
                            </li>
                          )) : <li>No periods</li>}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : <div>No week schedule found.</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Schedules;
