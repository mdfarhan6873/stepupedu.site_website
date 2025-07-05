import React from 'react'
import Link from 'next/link'
import { ClipboardDocumentCheckIcon, CalendarDaysIcon, DocumentTextIcon, BellIcon, CurrencyRupeeIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

const whatsappGroupLink = "https://chat.whatsapp.com/GZrxcNaoXfUA43zOYSQBBs";

const TeacherDashboard = () => {
  return (
    <div className="flex flex-col items-center gap-8 mt-4 min-h-screen pb-24">
      {/* Quick Actions Section */}
      <div className="w-full max-w-3xl mb-2 px-2">
        <h3 className="text-lg font-semibold mb-2 ml-1">Quick Actions</h3>
        <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
          <Link href="/dashboard/teacher/mark-attendance">
            <div className="flex flex-col items-center cursor-pointer">
              <ClipboardDocumentCheckIcon className="h-8 w-8 text-blue-600 mb-1" />
              <span className="text-xs font-semibold">Mark Attendance</span>
            </div>
          </Link>
          <Link href="/dashboard/teacher/schedules">
            <div className="flex flex-col items-center cursor-pointer">
              <CalendarDaysIcon className="h-8 w-8 text-indigo-600 mb-1" />
              <span className="text-xs font-semibold">Schedules</span>
            </div>
          </Link>
          <Link href="/dashboard/teacher/notes">
            <div className="flex flex-col items-center cursor-pointer">
              <DocumentTextIcon className="h-8 w-8 text-purple-600 mb-1" />
              <span className="text-xs font-semibold">Notes</span>
            </div>
          </Link>
          <Link href="/dashboard/teacher/notifications">
            <div className="flex flex-col items-center cursor-pointer">
              <BellIcon className="h-8 w-8 text-yellow-500 mb-1" />
              <span className="text-xs font-semibold">Notifications</span>
            </div>
          </Link>
          <a href={whatsappGroupLink} target="_blank" rel="noopener noreferrer">
            <div className="flex flex-col items-center cursor-pointer">
              <ChatBubbleLeftRightIcon className="h-8 w-8 text-green-500 mb-1" />
              <span className="text-xs font-semibold">WhatsApp Group</span>
            </div>
          </a>
          <Link href="/dashboard/teacher/payments">
            <div className="flex flex-col items-center cursor-pointer">
              <CurrencyRupeeIcon className="h-8 w-8 text-pink-600 mb-1" />
              <span className="text-xs font-semibold">My Payments</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard