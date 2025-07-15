
'use client';
import React, { useState, useEffect } from 'react';
import { CalendarIcon, DocumentTextIcon, ClipboardIcon, BellIcon, CreditCardIcon, CheckCircleIcon, ChatBubbleLeftRightIcon, UserIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  role: string;
  mobileNo: string;
  class?: string;
  section?: string;
  rollNo?: string;
}

interface WhatsAppGroup {
  _id: string;
  class: string;
  section: string;
  groupLink: string;
  groupName: string;
  description: string;
  isActive: boolean;
}

const StudentDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [user, setUser] = useState<User | null>(null);
  const [whatsAppGroup, setWhatsAppGroup] = useState<WhatsAppGroup | null>(null);
  const [groupLoading, setGroupLoading] = useState(true);
  const [groupError, setGroupError] = useState('');
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [attendanceLoading, setAttendanceLoading] = useState(true);
  const [currentMonthAttendance, setCurrentMonthAttendance] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Get user data from session cookie
  useEffect(() => {
    const sessionData = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('session='));
    if (sessionData) {
      try {
        const userData = JSON.parse(decodeURIComponent(sessionData.split('=')[1]));
        setUser(userData.user);
      } catch (error) {
        console.error('Error parsing session data:', error);
      }
    }
  }, []);

  // Fetch attendance data for current month calculation
  useEffect(() => {
    if (!user || !user.class || !user.section) {
      setAttendanceLoading(false);
      return;
    }

    const fetchAttendanceData = async () => {
      try {
        setAttendanceLoading(true);
        const response = await fetch(`/api/attendance/student?class=${user.class}&section=${user.section}&studentId=${user.id}`);
        const data = await response.json();
        setAttendanceData(data);
        
        // Calculate current month attendance
        const currentMonth = new Date().getMonth() + 1; // 1-12
        const currentMonthStr = currentMonth.toString().padStart(2, '0');
        const currentYear = new Date().getFullYear();
        
        const monthData = data.filter((a: any) => {
          if (!a.date) return false;
          const attendanceYear = a.date.slice(0, 4);
          const attendanceMonth = a.date.slice(5, 7);
          return attendanceYear === currentYear.toString() && attendanceMonth === currentMonthStr;
        });
        
        let present = 0, absent = 0;
        monthData.forEach((a: any) => {
          a.subjects?.forEach((subj: any) => {
            subj.students?.forEach((stu: any) => {
              if (stu.studentId === user.id) {
                if (stu.status === 'Present') present++;
                if (stu.status === 'Absent') absent++;
              }
            });
          });
        });
        
        const total = present + absent;
        const percentage = total ? Math.round((present / total) * 100) : 0;
        setCurrentMonthAttendance(percentage);
        
      } catch (error) {
        console.error('Error fetching attendance data:', error);
        setCurrentMonthAttendance(0);
      } finally {
        setAttendanceLoading(false);
      }
    };

    fetchAttendanceData();
  }, [user]);

  // Fetch WhatsApp group for student's class and section
  useEffect(() => {
    if (!user || !user.class || !user.section) {
      setGroupLoading(false);
      return;
    }

    const fetchWhatsAppGroup = async () => {
      try {
        setGroupLoading(true);
        const response = await fetch('/api/whatsapp-groups');
        const groups: WhatsAppGroup[] = await response.json();
        
        // Find group matching student's class and section
        const studentGroup = groups.find(
          group => group.class === user.class && 
                  group.section === user.section && 
                  group.isActive
        );
        
        if (studentGroup) {
          setWhatsAppGroup(studentGroup);
        } else {
          setGroupError('No WhatsApp group found for your class and section');
        }
      } catch (error) {
        console.error('Error fetching WhatsApp groups:', error);
        setGroupError('Failed to fetch WhatsApp group information');
      } finally {
        setGroupLoading(false);
      }
    };

    fetchWhatsAppGroup();
  }, [user]);

  const quickActions = [
    { href: '/dashboard/student/schedule', icon: CalendarIcon, label: 'Schedule', gradient: 'from-blue-500 to-indigo-600' },
    { href: '/dashboard/student/notes', icon: DocumentTextIcon, label: 'Notes', gradient: 'from-violet-500 to-purple-600' },
    { href: '/dashboard/student/assignments', icon: ClipboardIcon, label: 'Assignments', gradient: 'from-yellow-500 to-orange-500' },
    { href: '/dashboard/student/notifications', icon: BellIcon, label: 'Notifications', gradient: 'from-red-500 to-pink-600' },
    { href: '/dashboard/student/payments', icon: CreditCardIcon, label: 'My Payments', gradient: 'from-emerald-500 to-teal-600' },
    { href: '/dashboard/student/attendance', icon: CheckCircleIcon, label: 'My Attendance', gradient: 'from-purple-500 to-pink-600' },
  ];

  const ActionCard = ({ action, index }: { action: any, index: number }) => (
    <a href={action.href} key={action.label}>
      <div className="bg-white bg-opacity-10 backdrop-blur-xl p-6 rounded-3xl border border-white border-opacity-20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 hover:scale-105"
           style={{ animationDelay: `${index * 0.1}s` }}>
        <div className="flex flex-col items-center space-y-3">
          <div className={`p-4 rounded-2xl bg-gradient-to-r ${action.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <action.icon className="h-8 w-8 text-white" />
          </div>
          <span className="text-sm font-semibold text-white text-center leading-tight">
            {action.label}
          </span>
        </div>
      </div>
    </a>
  );

  const handleWhatsAppClick = () => {
    if (whatsAppGroup && whatsAppGroup.groupLink) {
      window.open(whatsAppGroup.groupLink, '_blank', 'noopener,noreferrer');
    }
  };

  // Get current month name for display
  const getCurrentMonthName = () => {
    return new Date().toLocaleString('default', { month: 'long' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-16 pb-8 px-4">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Student Dashboard</h1>
          <p className="text-gray-300 text-lg">Your learning journey starts here</p>
          {user && user.class && user.section && (
            <div className="mt-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl px-3 py-1 inline-block">
              <span className="text-white text-sm font-medium">Class {user.class} - Section {user.section}</span>
            </div>
          )}
          <div className="mt-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl px-4 py-2 inline-block">
            <p className="text-white text-sm font-medium">{currentTime.toLocaleDateString()}</p>
            <p className="text-gray-300 text-xs">{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-2 pb-24">
        {/* Welcome Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white border-opacity-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back, {user?.name || 'Student'}!</h2>
            <p className="text-gray-300">Ready to continue your educational journey?</p>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl px-3 py-1">
              <span className="text-gray-300 text-sm">Student Tools</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <ActionCard key={action.label} action={action} index={index} />
            ))}
          </div>
        </div>

        {/* View Results Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6">View Results</h2>
          <a href="/dashboard/student/view-results">
            <div className="bg-white bg-opacity-10 backdrop-blur-xl p-2 rounded-3xl border border-white border-opacity-20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 hover:scale-101">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <svg className="h-8 w-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h4m0 0V7m0 4l-4-4m4 4l4-4" /></svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Results</h3>
                    <p className="text-gray-300 text-sm">See all published results</p>
                  </div>
                </div>
                <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </a>
        </div>

        {/* WhatsApp Section - Class Specific */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Class WhatsApp Group</h2>
          
          {groupLoading ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-xl p-6 rounded-3xl border border-white border-opacity-20 shadow-xl">
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                <span className="text-white">Loading WhatsApp group...</span>
              </div>
            </div>
          ) : whatsAppGroup ? (
            <div 
              onClick={handleWhatsAppClick}
              className="bg-white bg-opacity-10 backdrop-blur-xl p-2 rounded-3xl border border-white border-opacity-20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 hover:scale-101"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{whatsAppGroup.groupName}</h3>
                    <p className="text-gray-300 text-sm">
                      {user?.class && user?.section ? `Class ${user.class} - Section ${user.section}` : 'Your class group'}
                    </p>
                    {whatsAppGroup.description && (
                      <p className="text-gray-400 text-xs mt-1">{whatsAppGroup.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="bg-green-500 bg-opacity-20 text-green-300 text-xs px-2 py-1 rounded-full mr-3">
                    Active
                  </div>
                  <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-amber-500 bg-opacity-10 backdrop-blur-xl p-6 rounded-3xl border border-amber-500 border-opacity-30 shadow-xl">
              <div className="flex items-center space-x-4">
                <div className="p-4 rounded-2xl bg-amber-500 bg-opacity-20">
                  <ExclamationTriangleIcon className="h-8 w-8 text-amber-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-amber-300 mb-2">Group Not Available</h3>
                  <p className="text-amber-200 text-sm mb-2">
                    Currently, your class-related WhatsApp group is not added.
                  </p>
                  <p className="text-amber-200 text-xs">
                    {user?.class && user?.section 
                      ? `No group found for Class ${user.class} - Section ${user.section}. Please try again later.`
                      : 'Please try again later or contact administration.'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Study Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-4 border border-white border-opacity-20">
            <div className="text-center">
              {attendanceLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                </div>
              ) : (
                <>
                  <div className={`text-2xl font-bold ${currentMonthAttendance >= 75 ? 'text-green-400' : currentMonthAttendance >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                    {currentMonthAttendance}%
                  </div>
                  <div className="text-gray-300 text-xs">
                    {getCurrentMonthName()} Attendance
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-4 border border-white border-opacity-20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">12</div>
              <div className="text-gray-300 text-xs">Assignments Due</div>
            </div>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 bg-opacity-20 backdrop-blur-xl rounded-3xl p-6 border border-white border-opacity-20">
          <div className="text-center">
            <p className="text-white text-lg font-medium italic mb-2">
              "Education is the most powerful weapon which you can use to change the world."
            </p>
            <p className="text-gray-300 text-sm">- Nelson Mandela</p>
          </div>
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

export default StudentDashboard;
