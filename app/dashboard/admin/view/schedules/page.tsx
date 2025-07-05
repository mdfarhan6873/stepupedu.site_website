"use client";
import { useEffect, useState } from "react";

export default function ViewSchedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ class: '', section: '', day: '', subject: '' });

  useEffect(() => {
    fetch("/api/schedule")
      .then(res => res.json())
      .then(data => setSchedules(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = schedules.filter(s =>
    (filter.class === '' || (s.class && s.class.toLowerCase().includes(filter.class.toLowerCase()))) &&
    (filter.section === '' || (s.section && s.section.toLowerCase().includes(filter.section.toLowerCase()))) &&
    (filter.day === '' || (Array.isArray(s.week) && s.week.some((d: any) => d.day.toLowerCase().includes(filter.day.toLowerCase())))) &&
    (filter.subject === '' || (Array.isArray(s.week) && s.week.some((d: any) => Array.isArray(d.periods) && d.periods.some((p: any) => p.subject && p.subject.toLowerCase().includes(filter.subject.toLowerCase())))))
  );

  const groupSize = filtered.length <= 4 ? 2 : 3;
  const grouped = [];
  for (let i = 0; i < filtered.length; i += groupSize) {
    grouped.push(filtered.slice(i, i + groupSize));
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Schedules</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <input className="input w-full max-w-xs" placeholder="Filter by class..." value={filter.class} onChange={e => setFilter(f => ({ ...f, class: e.target.value }))} />
        <input className="input w-full max-w-xs" placeholder="Filter by section..." value={filter.section} onChange={e => setFilter(f => ({ ...f, section: e.target.value }))} />
        <input className="input w-full max-w-xs" placeholder="Filter by day..." value={filter.day} onChange={e => setFilter(f => ({ ...f, day: e.target.value }))} />
        <input className="input w-full max-w-xs" placeholder="Filter by subject..." value={filter.subject} onChange={e => setFilter(f => ({ ...f, subject: e.target.value }))} />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-400">No schedules found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-4">
              {row.map((schedule, idx) => (
                <div key={idx} className="flex-1 bg-white rounded shadow p-4 flex flex-col gap-2 border min-w-[220px]">
                  <div className="font-semibold text-lg">Class: {schedule.class} - Section: {schedule.section}</div>
                  <div className="text-sm text-gray-600">Week:</div>
                  <div className="ml-2">
                    {Array.isArray(schedule.week) && schedule.week.map((day: any, dIdx: number) => (
                      <div key={dIdx} className="mb-2">
                        <div className="font-semibold text-blue-600">{day.day}</div>
                        <ul className="ml-4 list-disc">
                          {Array.isArray(day.periods) && day.periods.map((p: any, pIdx: number) => (
                            <li key={pIdx} className="text-xs text-gray-700">
                              {p.startTime} - {p.endTime}: {p.subject} ({p.teacherName})
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-gray-400 mt-2">ID: {schedule._id}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
