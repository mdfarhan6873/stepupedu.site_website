"use client";
import { useEffect, useState } from "react";
import { CalendarDaysIcon, MagnifyingGlassIcon, ClockIcon } from "@heroicons/react/24/outline";
import React from "react";

export default function ViewSchedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ class: '', section: '', day: '', subject: '' });
  const [selected, setSelected] = useState<any | null>(null);
  const [showModal, setShowModal] = useState(false);
  // Always include week in form state
  const [form, setForm] = useState<{ class: string; section: string; week: any[] }>({ class: '', section: '', week: [] });

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

  const handleEdit = (schedule: any) => {
    setSelected(schedule);
    setForm({
      class: schedule.class,
      section: schedule.section,
      week: schedule.week ? JSON.parse(JSON.stringify(schedule.week)) : [], // deep copy
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this schedule?')) return;
    await fetch('/api/schedule', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setSchedules(schedules.filter(s => s._id !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleWeekChange = (dayIdx: number, periodIdx: number, field: string, value: string) => {
    setForm((prev: any) => {
      const week = [...prev.week];
      const periods = [...week[dayIdx].periods];
      periods[periodIdx] = { ...periods[periodIdx], [field]: value };
      week[dayIdx] = { ...week[dayIdx], periods };
      return { ...prev, week };
    });
  };
  const handleDayChange = (dayIdx: number, value: string) => {
    setForm((prev: any) => {
      const week = [...prev.week];
      week[dayIdx] = { ...week[dayIdx], day: value };
      return { ...prev, week };
    });
  };
  const addPeriod = (dayIdx: number) => {
    setForm((prev: any) => {
      const week = [...prev.week];
      week[dayIdx].periods.push({ subject: '', startTime: '', endTime: '', teacherName: '' });
      return { ...prev, week };
    });
  };
  const removePeriod = (dayIdx: number, periodIdx: number) => {
    setForm((prev: any) => {
      const week = [...prev.week];
      week[dayIdx].periods.splice(periodIdx, 1);
      return { ...prev, week };
    });
  };
  const addDay = () => {
    setForm((prev: any) => ({
      ...prev,
      week: [...(prev.week || []), { day: '', periods: [] }],
    }));
  };
  const removeDay = (dayIdx: number) => {
    setForm((prev: any) => {
      const week = [...prev.week];
      week.splice(dayIdx, 1);
      return { ...prev, week };
    });
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
    // Refresh schedules
    fetch("/api/schedule")
      .then(res => res.json())
      .then(data => setSchedules(data));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <CalendarDaysIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">View Schedules</h2>
            <p className="text-gray-300">Manage and browse class schedules</p>
          </div>

          {/* Filter Section */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white border-opacity-20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Filter Schedules</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by class..." 
                value={filter.class} 
                onChange={e => setFilter(f => ({ ...f, class: e.target.value }))} 
              />
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by section..." 
                value={filter.section} 
                onChange={e => setFilter(f => ({ ...f, section: e.target.value }))} 
              />
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by day..." 
                value={filter.day} 
                onChange={e => setFilter(f => ({ ...f, day: e.target.value }))} 
              />
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by subject..." 
                value={filter.subject} 
                onChange={e => setFilter(f => ({ ...f, subject: e.target.value }))} 
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading schedules...
                </div>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 text-center">
                <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-300">No schedules found.</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {grouped.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {row.map((schedule, idx) => (
                    <div key={idx} className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-white">Class {schedule.class}</h3>
                          <p className="text-sm text-gray-300">Section: {schedule.section}</p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <button className="text-xs text-blue-400 hover:underline" onClick={() => handleEdit(schedule)}>Edit</button>
                          <button className="text-xs text-red-400 hover:underline" onClick={() => handleDelete(schedule._id)}>Delete</button>
                        </div>
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                          <CalendarDaysIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-3">
                          <ClockIcon className="w-4 h-4 text-purple-400" />
                          <span className="text-sm font-medium text-gray-300">Weekly Schedule</span>
                        </div>
                        
                        {Array.isArray(schedule.week) && schedule.week.map((day: any, dIdx: number) => (
                          <div key={dIdx} className="bg-white bg-opacity-5 rounded-lg p-3">
                            <div className="font-semibold text-purple-300 mb-2 text-sm">{day.day}</div>
                            <div className="space-y-2">
                              {Array.isArray(day.periods) && day.periods.map((p: any, pIdx: number) => (
                                <div key={pIdx} className="bg-white bg-opacity-5 rounded-lg p-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                      <span className="text-xs font-medium text-white">{p.subject}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{p.startTime} - {p.endTime}</span>
                                  </div>
                                  <div className="text-xs text-gray-300 mt-1 ml-4">
                                    Teacher: {p.teacherName}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-white border-opacity-10">
                        ID: {schedule._id}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Schedule Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
          <div className="bg-white p-6 rounded shadow-lg min-w-[350px] max-w-2xl w-full">
            <h3 className="text-lg font-bold mb-2">Edit Schedule</h3>
            <form onSubmit={handleSubmit}>
              <input className="border p-1 mb-2 w-full" name="class" value={form.class} onChange={handleChange} placeholder="Class" required />
              <input className="border p-1 mb-2 w-full" name="section" value={form.section} onChange={handleChange} placeholder="Section" required />
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold">Weekly Schedule</span>
                  <button type="button" className="text-xs px-2 py-1 bg-green-200 rounded" onClick={addDay}>+ Add Day</button>
                </div>
                {Array.isArray(form.week) && form.week.map((day: any, dayIdx: number) => (
                  <div key={dayIdx} className="border rounded p-2 mb-2 bg-gray-50">
                    <div className="flex items-center gap-2 mb-1">
                      <input className="border p-1 flex-1" value={day.day} onChange={e => handleDayChange(dayIdx, e.target.value)} placeholder="Day (e.g. Monday)" required />
                      <button type="button" className="text-xs px-2 py-1 bg-red-200 rounded" onClick={() => removeDay(dayIdx)}>- Remove Day</button>
                    </div>
                    <div className="flex flex-col gap-2">
                      {Array.isArray(day.periods) && day.periods.map((period: any, periodIdx: number) => (
                        <div key={periodIdx} className="flex gap-2 items-center">
                          <input className="border p-1 flex-1" value={period.subject} onChange={e => handleWeekChange(dayIdx, periodIdx, 'subject', e.target.value)} placeholder="Subject" required />
                          <input className="border p-1 w-24" value={period.startTime} onChange={e => handleWeekChange(dayIdx, periodIdx, 'startTime', e.target.value)} placeholder="Start Time" required />
                          <input className="border p-1 w-24" value={period.endTime} onChange={e => handleWeekChange(dayIdx, periodIdx, 'endTime', e.target.value)} placeholder="End Time" required />
                          <input className="border p-1 flex-1" value={period.teacherName} onChange={e => handleWeekChange(dayIdx, periodIdx, 'teacherName', e.target.value)} placeholder="Teacher Name" required />
                          <button type="button" className="text-xs px-2 py-1 bg-red-100 rounded" onClick={() => removePeriod(dayIdx, periodIdx)}>-</button>
                        </div>
                      ))}
                      <button type="button" className="text-xs px-2 py-1 bg-blue-100 rounded mt-1" onClick={() => addPeriod(dayIdx)}>+ Add Period</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end gap-2 mt-2">
                <button type="button" className="px-3 py-1 bg-gray-300 rounded" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}