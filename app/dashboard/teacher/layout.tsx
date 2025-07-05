'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BellIcon, HomeIcon, PlusCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  role: string;
  mobileNo: string;
}

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Get user from session
    const sessionData = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('session='));
    
    if (sessionData) {
      try {
        const userData = JSON.parse(decodeURIComponent(sessionData.split('=')[1]));
        setUser(userData.user);
        if (userData.user.role !== 'teacher') {
          router.replace(`/dashboard/${userData.user.role}`);
        } else {
          setLoading(false);
        }
      } catch {
        router.replace('/login');
      }
    } else {
      router.replace('/login');
    }
  }, [router]);

  const handleLogout = async () => {
    // Clear session cookie
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="font-semibold text-lg">
                Welcome, {user?.name || 'User'}
              </span>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      {/* Bottom Navigation for Mobile - visible on all teacher routes */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-40 shadow-md w-full max-w-5xl mx-auto px-2">
        <a href="/dashboard/teacher" className="flex flex-col items-center focus:outline-none text-blue-600">
          <HomeIcon className="h-7 w-7" />
          <span className="text-xs">Home</span>
        </a>
        
        <a href="/dashboard/teacher/notifications" className="flex flex-col items-center focus:outline-none text-gray-400 hover:text-blue-600">
          <BellIcon className="h-7 w-7" />
          <span className="text-xs">Notifications</span>
        </a>
        <a href="/dashboard/teacher/mark-my-attendance" className="flex flex-col items-center focus:outline-none text-green-600 hover:text-green-700">
          <CheckCircleIcon className="h-7 w-7" />
          <span className="text-xs">My Attendance</span>
        </a>
      </nav>
    </div>
  );
}