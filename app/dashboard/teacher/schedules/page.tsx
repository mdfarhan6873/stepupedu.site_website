'use client'
import React, { useEffect, useState } from 'react';
import { CalendarDaysIcon, ClockIcon, ArrowLeftIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const Schedules = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

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
          <div className="flex items-center mb-8">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl px-4 py-2 text-white hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>
          </div>

          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                <CalendarDaysIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Schedules</h2>
            <p className="text-gray-300">View class schedules and timetables</p>
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
          ) : error ? (
            <div className="bg-red-500 bg-opacity-20 backdrop-blur-xl rounded-2xl p-8 border border-red-500 border-opacity-30 text-center">
              <div className="text-red-300">{error}</div>
            </div>
          ) : schedules.length === 0 ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 text-center">
              <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-300">No schedules found.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {schedules.map((schedule: any, i: number) => (
                <div key={schedule._id || i} className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Class {schedule.class}</h3>
                      <p className="text-sm text-gray-300">Section: {schedule.section}</p>
                    </div>
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                      <CalendarDaysIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  {schedule.week && schedule.week.length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-3">
                        <ClockIcon className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-gray-300">Weekly Schedule</span>
                      </div>
                      
                      {schedule.week.map((day: any, dIdx: number) => (
                        <div key={dIdx} className="bg-white bg-opacity-5 rounded-lg p-3">
                          <div className="font-semibold text-purple-300 mb-2 text-sm">{day.day}</div>
                          <div className="space-y-2">
                            {day.periods && day.periods.length > 0 ? (
                              day.periods.map((period: any, pIdx: number) => (
                                <div key={pIdx} className="bg-white bg-opacity-5 rounded-lg p-2">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                      <span className="text-xs font-medium text-white">{period.subject}</span>
                                    </div>
                                    <span className="text-xs text-gray-400">{period.startTime} - {period.endTime}</span>
                                  </div>
                                  <div className="text-xs text-gray-300 mt-1 ml-4 flex items-center gap-1">
                                    <BookOpenIcon className="w-3 h-3" />
                                    Teacher: {period.teacherName}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-xs text-gray-400 ml-4">No periods scheduled</div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white bg-opacity-5 rounded-lg p-4 text-center">
                      <CalendarDaysIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-gray-400 text-sm">No weekly schedule found</div>
                    </div>
                  )}
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
};

export default Schedules;