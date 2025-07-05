'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BellIcon } from '@heroicons/react/24/outline';

interface User {
  id: string;
  name: string;
  role: string;
  mobileNo: string;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const sessionData = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('session='));
    if (sessionData) {
      try {
        const userData = JSON.parse(decodeURIComponent(sessionData.split('=')[1]));
        setUser(userData.user);
        if (userData.user.role !== 'admin') {
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

  const handleLogout = () => {
    document.cookie = 'session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    router.push('/login');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-lg">{user?.name || 'Admin'}</span>
            <span className="text-xs text-gray-500">({user?.role})</span>
          </div>
          <div className="flex items-center space-x-4">
            <button className="relative p-2 rounded-full hover:bg-gray-100 focus:outline-none">
              <BellIcon className="h-6 w-6 text-gray-600" />
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <main className="py-10 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
      {/* Bottom Navigation for Mobile - visible on all admin routes */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center h-16 z-40 shadow-md w-full max-w-5xl mx-auto px-2">
        <a href="/dashboard/admin" className="flex flex-col items-center focus:outline-none text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125h3.375v-4.5c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125v4.5h3.375c.621 0 1.125-.504 1.125-1.125V9.75" />
          </svg>
          <span className="text-xs">Home</span>
        </a>
        <a href="/dashboard/admin/add-student" className="flex flex-col items-center text-blue-600 focus:outline-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-12 w-12 -mt-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </a>
        <a href="/dashboard/admin/view/notifications" className="flex flex-col items-center focus:outline-none text-gray-400 hover:text-blue-600">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-7 w-7">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75l1.5-1.5M21.75 18.75l-1.5-1.5M12 3v1.5m0 15V21m8.25-9h-1.5m-13.5 0h-1.5m15.364-6.364l-1.06 1.06M6.364 4.636l1.06 1.06" />
          </svg>
          <span className="text-xs">Notifications</span>
        </a>
      </nav>
    </div>
  );
}