"use client";
import { useEffect, useState } from "react";
import { CalendarDaysIcon, MagnifyingGlassIcon, ClockIcon } from "@heroicons/react/24/outline";

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