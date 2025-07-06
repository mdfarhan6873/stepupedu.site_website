'use client';
import React, { useState, useEffect } from 'react';
import { CalendarIcon, DocumentTextIcon, ClipboardIcon, BellIcon, CreditCardIcon, CheckCircleIcon, ChatBubbleLeftRightIcon, UserIcon } from '@heroicons/react/24/outline';

const StudentDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-16 pb-8 px-6">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Student Dashboard</h1>
          <p className="text-gray-300 text-lg">Your learning journey starts here</p>
          <div className="mt-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl px-4 py-2 inline-block">
            <p className="text-white text-sm font-medium">{currentTime.toLocaleDateString()}</p>
            <p className="text-gray-300 text-xs">{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 pb-24">
        {/* Welcome Card */}
        <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white border-opacity-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Welcome Back!</h2>
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

        {/* WhatsApp Section */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-6">Connect with Us</h2>
          <a href="https://chat.whatsapp.com/HEITVMEtis83Uy8vpWPmly" target="_blank" rel="noopener noreferrer">
            <div className="bg-white bg-opacity-10 backdrop-blur-xl p-6 rounded-3xl border border-white border-opacity-20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 hover:scale-105">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">WhatsApp Group</h3>
                    <p className="text-gray-300 text-sm">Join the student community</p>
                  </div>
                </div>
                <svg className="w-6 h-6 text-gray-300 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </a>
        </div>

        {/* Study Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-4 border border-white border-opacity-20">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">85%</div>
              <div className="text-gray-300 text-xs">Attendance</div>
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