'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { UserPlusIcon, PlusCircleIcon, ChatBubbleLeftRightIcon, HomeIcon, CurrencyRupeeIcon, DocumentTextIcon, BellIcon } from '@heroicons/react/24/outline';
import { UserGroupIcon, AcademicCapIcon, CalendarDaysIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const Admin = () => {
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [data, setData] = useState<any[]>([]);
  const [filter, setFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  return (
    <div className="flex flex-col items-center gap-8 mt-4 h-100 overflow-hidden">
      {/* Quick Actions Section */}
      <div className="w-full max-w-5xl mb-2 px-2">
        <h3 className="text-lg font-semibold mb-2 ml-1">Quick Actions</h3>
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          <Link href="/dashboard/admin/add-student">
            <div className="flex flex-col items-center cursor-pointer">
              <UserPlusIcon className="h-8 w-8 text-blue-600 mb-1" />
              <span className="text-xs font-semibold">Add Student</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/add-teacher">
            <div className="flex flex-col items-center cursor-pointer">
              <AcademicCapIcon className="h-8 w-8 text-green-600 mb-1" />
              <span className="text-xs font-semibold">Add Teacher</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/add-schedule">
            <div className="flex flex-col items-center cursor-pointer">
              <CalendarDaysIcon className="h-8 w-8 text-indigo-600 mb-1" />
              <span className="text-xs font-semibold">Add Schedule</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/add-notification">
            <div className="flex flex-col items-center cursor-pointer">
              <BellIcon className="h-8 w-8 text-yellow-500 mb-1" />
              <span className="text-xs font-semibold">Add Notification</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/add-notes">
            <div className="flex flex-col items-center cursor-pointer">
              <DocumentTextIcon className="h-8 w-8 text-purple-600 mb-1" />
              <span className="text-xs font-semibold">Add Notes</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/add-student-payment">
            <div className="flex flex-col items-center cursor-pointer">
              <CurrencyRupeeIcon className="h-8 w-8 text-pink-600 mb-1" />
              <span className="text-xs font-semibold">Add Student Payment</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/add-teacher-payment">
            <div className="flex flex-col items-center cursor-pointer">
              <CurrencyRupeeIcon className="h-8 w-8 text-orange-500 mb-1" />
              <span className="text-xs font-semibold">Add Teacher Payment</span>
            </div>
          </Link>
        </div>
      </div>
      {/* View Section */}
      <div className="w-full max-w-5xl mb-2 px-2">
        <h3 className="text-lg font-semibold mb-2 ml-1">View Details</h3>
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          <Link href="/dashboard/admin/view/students">
            <div className="flex flex-col items-center cursor-pointer">
              <UserGroupIcon className="h-8 w-8 text-blue-600 mb-1" />
              <span className="text-xs font-semibold">Students</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/view/teachers">
            <div className="flex flex-col items-center cursor-pointer">
              <AcademicCapIcon className="h-8 w-8 text-green-600 mb-1" />
              <span className="text-xs font-semibold">Teachers</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/view/schedules">
            <div className="flex flex-col items-center cursor-pointer">
              <CalendarDaysIcon className="h-8 w-8 text-indigo-600 mb-1" />
              <span className="text-xs font-semibold">Schedules</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/view/student-payments">
            <div className="flex flex-col items-center cursor-pointer">
              <CurrencyRupeeIcon className="h-8 w-8 text-pink-600 mb-1" />
              <span className="text-xs font-semibold">Student Payments</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/view/teacher-payments">
            <div className="flex flex-col items-center cursor-pointer">
              <CurrencyRupeeIcon className="h-8 w-8 text-orange-500 mb-1" />
              <span className="text-xs font-semibold">Teacher Payments</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/view/notes">
            <div className="flex flex-col items-center cursor-pointer">
              <DocumentTextIcon className="h-8 w-8 text-purple-600 mb-1" />
              <span className="text-xs font-semibold">Notes</span>
            </div>
          </Link>
          <Link href="/dashboard/admin/view/notifications">
            <div className="flex flex-col items-center cursor-pointer">
              <BellIcon className="h-8 w-8 text-yellow-500 mb-1" />
              <span className="text-xs font-semibold">Notifications</span>
            </div>
          </Link>
          <a href="https://chat.whatsapp.com/GZrxcNaoXfUA43zOYSQBBs" target="_blank" rel="noopener noreferrer">
            <div className="flex flex-col items-center cursor-pointer">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-500 mb-1" />
              <span className="text-xs font-semibold">WhatsApp Group</span>
            </div>
          </a>
        </div>
      </div>
      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-40 shadow-md w-full max-w-5xl mx-auto px-2">
        <button
          onClick={() => {
            setActiveTab('home');
            router.push('/dashboard/admin');
          }}
          className={`flex flex-col items-center focus:outline-none ${activeTab === 'home' ? 'text-blue-600' : 'text-gray-400'}`}
        >
          <HomeIcon className="h-7 w-7" />
          <span className="text-xs">Home</span>
        </button>
        <button onClick={() => setShowAddPopup(true)} className="flex flex-col items-center text-blue-600 focus:outline-none">
          <PlusCircleIcon className="h-12 w-12 -mt-4" />
        </button>
        <button onClick={() => setActiveTab('messages')} className={`flex flex-col items-center focus:outline-none ${activeTab === 'messages' ? 'text-blue-600' : 'text-gray-400'}`}>
          <ChatBubbleLeftRightIcon className="h-7 w-7" />
          <span className="text-xs">Messages</span>
        </button>
      </nav>
      {/* Add Popup */}
      {showAddPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col gap-4 w-80">
            <button onClick={() => setShowAddPopup(false)} className="self-end text-gray-400 hover:text-gray-600">✕</button>
            <Link href="/dashboard/admin/add-student" onClick={() => setShowAddPopup(false)}>
              <div className="flex items-center gap-2 p-3 rounded hover:bg-blue-50 cursor-pointer">
                <UserPlusIcon className="h-6 w-6 text-blue-600" />
                <span>Add Student</span>
              </div>
            </Link>
            <Link href="/dashboard/admin/add-teacher" onClick={() => setShowAddPopup(false)}>
              <div className="flex items-center gap-2 p-3 rounded hover:bg-green-50 cursor-pointer">
                <AcademicCapIcon className="h-6 w-6 text-green-600" />
                <span>Add Teacher</span>
              </div>
            </Link>
            <Link href="/dashboard/admin/add-schedule" onClick={() => setShowAddPopup(false)}>
              <div className="flex items-center gap-2 p-3 rounded hover:bg-indigo-50 cursor-pointer">
                <CalendarDaysIcon className="h-6 w-6 text-indigo-600" />
                <span>Add Class Schedule</span>
              </div>
            </Link>
            <Link href="/dashboard/admin/add-notification" onClick={() => setShowAddPopup(false)}>
              <div className="flex items-center gap-2 p-3 rounded hover:bg-yellow-50 cursor-pointer">
                <BellIcon className="h-6 w-6 text-yellow-500" />
                <span>Add Notification</span>
              </div>
            </Link>
            <Link href="/dashboard/admin/add-notes" onClick={() => setShowAddPopup(false)}>
              <div className="flex items-center gap-2 p-3 rounded hover:bg-purple-50 cursor-pointer">
                <DocumentTextIcon className="h-6 w-6 text-purple-600" />
                <span>Add Notes</span>
              </div>
            </Link>
            <Link href="/dashboard/admin/add-student-payment" onClick={() => setShowAddPopup(false)}>
              <div className="flex items-center gap-2 p-3 rounded hover:bg-pink-50 cursor-pointer">
                <CurrencyRupeeIcon className="h-6 w-6 text-pink-600" />
                <span>Add Student Payment</span>
              </div>
            </Link>
            <Link href="/dashboard/admin/add-teacher-payment" onClick={() => setShowAddPopup(false)}>
              <div className="flex items-center gap-2 p-3 rounded hover:bg-orange-50 cursor-pointer">
                <CurrencyRupeeIcon className="h-6 w-6 text-orange-500" />
                <span>Add Teacher Payment</span>
              </div>
            </Link>
          </div>
        </div>
      )}
      {/* Home and Messages Content (Mobile) */}
      {activeTab === 'home' && (
        <div className="w-full flex flex-col items-center mt-4">
          <span className="text-gray-500 text-sm">Welcome to the Admin Dashboard</span>
        </div>
      )}
      {activeTab === 'messages' && (
        <div className="w-full flex flex-col items-center mt-8">
          <ChatBubbleLeftRightIcon className="h-10 w-10 text-indigo-600 mb-2" />
          <span className="font-semibold">Messages (Coming Soon)</span>
        </div>
      )}
    </div>
  );
};

export default Admin;