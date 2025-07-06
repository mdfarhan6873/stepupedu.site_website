'use client'
import React, { useEffect, useState } from 'react';
import { CalendarIcon, ArrowLeftIcon, ClockIcon, BookOpenIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const daysOfWeek = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

const Schedule = () => {
  const [periodsByDay, setPeriodsByDay] = useState<Record<string, any[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debug, setDebug] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    // Get user info from session cookie
    const sessionData = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('session='));
    if (!sessionData) {
      setError('User not logged in');
      setLoading(false);
      return;
    }
    let user;
    try {
      const userData = JSON.parse(decodeURIComponent(sessionData.split('=')[1]));
      user = { ...userData.user, class: "10", section: "A" }; // Remove this hardcode after fixing backend
    } catch {
      setError('Invalid session');
      setLoading(false);
      return;
    }
    // Fetch schedule for class/section
    fetch(`/api/schedule`)
      .then(res => res.json())
      .then(data => {
        // Debug: log user and data
        setDebug({ user, data });
        // Find the schedule for this class/section
        const schedule = data.find((s: any) => s.class === user.class && s.section === user.section);
        if (!schedule || !schedule.week) {
          setPeriodsByDay({});
          setLoading(false);
          return;
        }
        // Flatten periods by day
        const grouped: Record<string, any[]> = {};
        daysOfWeek.forEach(day => {
          const dayObj = schedule.week.find((w: any) => w.day === day);
          grouped[day] = dayObj && dayObj.periods ? dayObj.periods : [];
        });
        setPeriodsByDay(grouped);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch schedules');
        setLoading(false);
      });
  }, []);

  const hasAnyPeriods = Object.values(periodsByDay).some(arr => arr.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">My Weekly Schedule</h2>
            <p className="text-gray-300">View your class timetable and schedules</p>
          </div>

          {/* Debug Section - Only shown in development */}
          {debug && process.env.NODE_ENV === 'development' && (
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-4 mb-8 border border-white border-opacity-20">
              <details className="text-white">
                <summary className="cursor-pointer text-sm font-medium mb-2">Debug Info (Development Only)</summary>
                <div className="text-xs space-y-2">
                  <div><b>User:</b> {JSON.stringify(debug.user)}</div>
                  <div><b>API Data:</b> {JSON.stringify(debug.data)}</div>
                </div>
              </details>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading schedule...
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-500 bg-opacity-20 backdrop-blur-xl rounded-2xl p-8 border border-red-500 border-opacity-30 text-center">
              <div className="text-red-300">{error}</div>
            </div>
          ) : !hasAnyPeriods ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 text-center">
              <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-300">No schedules found.</div>
            </div>
          ) : (
            <div className="space-y-8">
              {daysOfWeek.map(day => (
                periodsByDay[day] && periodsByDay[day].length > 0 && (
                  <div key={day} className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 border border-white border-opacity-20 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                        <CalendarIcon className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-white">{day}</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {periodsByDay[day].map((period: any, idx: number) => (
                        <div key={idx} className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-15 transition-all duration-300 transform hover:scale-[1.02]">
                          <div className="flex items-start justify-between mb-4">
                            <h4 className="text-lg font-bold text-white pr-2">{period.subject}</h4>
                            <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <BookOpenIcon className="w-4 h-4 text-white" />
                            </div>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="bg-white bg-opacity-5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <ClockIcon className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-300">Time:</span>
                              </div>
                              <span className="text-sm text-white font-medium">
                                {period.startTime} - {period.endTime}
                              </span>
                            </div>
                            
                            <div className="bg-white bg-opacity-5 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-2">
                                <AcademicCapIcon className="w-4 h-4 text-blue-400" />
                                <span className="text-sm text-gray-300">Teacher:</span>
                              </div>
                              <span className="text-sm text-white font-medium">
                                {period.teacherName}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
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

export default Schedule;