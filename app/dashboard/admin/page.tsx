'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserPlusIcon, PlusCircleIcon, ChatBubbleLeftRightIcon, HomeIcon, CurrencyRupeeIcon, DocumentTextIcon, BellIcon, CheckCircleIcon, ChatBubbleBottomCenterIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon, AcademicCapIcon, CalendarDaysIcon, ChartBarIcon, ClockIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const Admin = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    revenue: 0,
  });
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [studentsRes, teachersRes, studentPaymentsRes, teacherPaymentsRes] = await Promise.all([
          axios.get('/api/users/student'),
          axios.get('/api/users/teacher'),
          axios.get('/api/student-payment'),
          axios.get('/api/teacher-payment'),
        ]);
        const students = studentsRes.data?.length || 0;
        const teachers = teachersRes.data?.length || 0;
        const studentPayments = Array.isArray(studentPaymentsRes.data)
          ? studentPaymentsRes.data.reduce((sum, p) => sum + (p.amount || 0), 0)
          : 0;
        const teacherPayments = Array.isArray(teacherPaymentsRes.data)
          ? teacherPaymentsRes.data.reduce((sum, p) => sum + (p.amount || 0), 0)
          : 0;
        setStats({
          students,
          teachers,
          revenue: studentPayments - teacherPayments,
        });
      } catch (err) {
        // fallback to 0s
        setStats({ students: 0, teachers: 0, revenue: 0 });
      }
    };
    fetchStats();
  }, []);

  const quickActions = [
    { href: '/dashboard/admin/add-student', icon: UserPlusIcon, label: 'Add Student', gradient: 'from-blue-500 to-indigo-600' },
    { href: '/dashboard/admin/add-teacher', icon: AcademicCapIcon, label: 'Add Teacher', gradient: 'from-emerald-500 to-teal-600' },
    { href: '/dashboard/admin/add-results', icon: ChartBarIcon, label: 'Add Result', gradient: 'from-pink-500 to-rose-600' },
    { href: '/dashboard/admin/add-schedule', icon: CalendarDaysIcon, label: 'Add Schedule', gradient: 'from-purple-500 to-pink-600' },
    { href: '/dashboard/admin/add-notification', icon: BellIcon, label: 'Add Notification', gradient: 'from-yellow-500 to-orange-500' },
    { href: '/dashboard/admin/add-notes', icon: DocumentTextIcon, label: 'Add Notes', gradient: 'from-violet-500 to-purple-600' },
    { href: '/dashboard/admin/add-whatsapp-group', icon: ChatBubbleLeftRightIcon, label: 'Add WhatsApp Group', gradient: 'from-green-500 to-emerald-600' },
    { href: '/dashboard/admin/add-student-payment', icon: CurrencyRupeeIcon, label: 'Student Payment', gradient: 'from-pink-500 to-rose-600' },
    { href: '/dashboard/admin/add-teacher-payment', icon: CurrencyRupeeIcon, label: 'Teacher Payment', gradient: 'from-orange-500 to-red-500' },
  ];

  const viewActions = [
    { href: '/dashboard/admin/view/students', icon: UserGroupIcon, label: 'Students', gradient: 'from-blue-500 to-indigo-600' },
    { href: '/dashboard/admin/view/teachers', icon: AcademicCapIcon, label: 'Teachers', gradient: 'from-emerald-500 to-teal-600' },
    { href: '/dashboard/admin/view/schedules', icon: CalendarDaysIcon, label: 'Schedules', gradient: 'from-purple-500 to-pink-600' },
    { href: '/dashboard/admin/view/student-payments', icon: CurrencyRupeeIcon, label: 'Student Payments', gradient: 'from-pink-500 to-rose-600' },
    { href: '/dashboard/admin/view/teacher-payments', icon: CurrencyRupeeIcon, label: 'Teacher Payments', gradient: 'from-orange-500 to-red-500' },
    { href: '/dashboard/admin/view/notes', icon: DocumentTextIcon, label: 'Notes', gradient: 'from-violet-500 to-purple-600' },
    { href: '/dashboard/admin/view/notifications', icon: BellIcon, label: 'Notifications', gradient: 'from-yellow-500 to-orange-500' },
    { href: '/dashboard/admin/view/results', icon: ChartBarIcon, label: 'Results', gradient: 'from-pink-500 to-rose-600' },
    { href: '/dashboard/admin/view/whatsapp-groups', icon: ChatBubbleLeftRightIcon, label: 'WhatsApp Groups', gradient: 'from-green-500 to-emerald-600' },
    { href: '/dashboard/admin/view/student-attendance', icon: CheckCircleIcon, label: 'Student Attendance', gradient: 'from-cyan-500 to-blue-600' },
    { href: '/dashboard/admin/view/class-attendance', icon: CalendarDaysIcon, label: 'Class Attendance', gradient: 'from-indigo-500 to-purple-600' },
    { href: '/dashboard/admin/view/homepagewithEnquaries', icon: ChatBubbleBottomCenterIcon, label: 'Homepage students and enquaries', gradient: 'from-indigo-500 to-purple-600' },
  ];

  const ActionCard = ({ action, index }: { action: any, index: number }) => (
    <Link href={action.href} key={action.label}>
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
    </Link>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-24">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-16 pb-8 px-6">
        <div className="text-center">
          
         
          <p className="text-gray-300 text-lg">Manage your educational platform</p>
          <div className="mt-4 bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl px-4 py-2 inline-block">
            <p className="text-white text-sm font-medium">{currentTime.toLocaleDateString()}</p>
            <p className="text-gray-300 text-xs">{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      <div className="relative z-10 px-6 pb-24">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-4 border border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs font-medium">Total Students</p>
                <p className="text-2xl font-bold text-white">{stats.students}</p>
              </div>
              <UserGroupIcon className="h-8 w-8 text-blue-400" />
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-4 border border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs font-medium">Total Teachers</p>
                <p className="text-2xl font-bold text-white">{stats.teachers}</p>
              </div>
              <AcademicCapIcon className="h-8 w-8 text-emerald-400" />
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-4 border border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs font-medium">Active Classes</p>
                <p className="text-2xl font-bold text-white">12</p>
              </div>
              <CalendarDaysIcon className="h-8 w-8 text-purple-400" />
            </div>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-4 border border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300 text-xs font-medium">This Month</p>
                <p className="text-2xl font-bold text-white">₹{stats.revenue.toLocaleString()}</p>
              </div>
              <ChartBarIcon className="h-8 w-8 text-pink-400" />
            </div>
          </div>
        </div>

        {/* Quick Actions Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Quick Actions</h2>
            <div className="flex items-center text-sm text-gray-300">
              <ClockIcon className="h-4 w-4 mr-1" />
              Frequently used
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {quickActions.map((action, index) => (
              <ActionCard key={action.label} action={action} index={index} />
            ))}
          </div>
        </div>

        {/* View Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">View & Manage</h2>
            <div className="flex items-center text-sm text-gray-300">
              <ChartBarIcon className="h-4 w-4 mr-1" />
              Data insights
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
            {viewActions.map((action, index) => (
              <ActionCard key={action.label} action={action} index={index} />
            ))}
            <a href="https://chat.whatsapp.com/HEITVMEtis83Uy8vpWPmly" target="_blank" rel="noopener noreferrer">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl p-6 rounded-3xl border border-white border-opacity-20 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer group transform hover:-translate-y-2 hover:scale-105">
                <div className="flex flex-col items-center space-y-3">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-white text-center leading-tight">
                    Main WhatsApp
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-10 backdrop-blur-xl border-t border-white border-opacity-20 shadow-2xl z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around items-center h-16">
            <button
              onClick={() => {
                setActiveTab('home');
                router.push('/dashboard/admin');
              }}
              className={`flex flex-col items-center focus:outline-none transition-colors duration-300 ${
                activeTab === 'home' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <HomeIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Home</span>
            </button>
            <button 
              onClick={() => setShowAddPopup(true)} 
              className="flex flex-col items-center text-white focus:outline-none bg-gradient-to-r from-purple-500 to-pink-600 rounded-full p-3 -mt-4 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
            >
              <PlusCircleIcon className="h-8 w-8" />
            </button>
            <button 
              onClick={() => setActiveTab('messages')} 
              className={`flex flex-col items-center focus:outline-none transition-colors duration-300 ${
                activeTab === 'messages' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <ChatBubbleLeftRightIcon className="h-6 w-6" />
              <span className="text-xs mt-1">Messages</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Enhanced Add Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto border border-white border-opacity-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Quick Add</h3>
              <button 
                onClick={() => setShowAddPopup(false)} 
                className="text-gray-300 hover:text-white transition-colors duration-300 p-1"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-3">
              {quickActions.map((action, index) => (
                <Link key={action.label} href={action.href} onClick={() => setShowAddPopup(false)}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white bg-opacity-10 backdrop-blur-lg hover:bg-opacity-20 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] border border-white border-opacity-20">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${action.gradient} shadow-lg`}>
                      <action.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="font-medium text-white">{action.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Home and Messages Content (Mobile) */}
      {activeTab === 'home' && (
        <div className="w-full flex flex-col items-center mt-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl border border-white border-opacity-20 p-6 mx-4">
            <div className="text-center">
             
              <p className="text-gray-300 text-sm">Manage your educational platform efficiently</p>
            </div>
          </div>
        </div>
      )}
      
      {activeTab === 'messages' && (
        <div className="w-full flex flex-col items-center mt-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl border border-white border-opacity-20 p-6 mx-4">
            <div className="text-center">
              <div className="h-16 w-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Messages</h3>
              <p className="text-gray-300 text-sm">Communication features coming soon</p>
              <div className="mt-4">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500 bg-opacity-20 text-indigo-300 border border-indigo-500 border-opacity-30">
                  Coming Soon
                </div>
              </div>
            </div>
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
};

export default Admin;