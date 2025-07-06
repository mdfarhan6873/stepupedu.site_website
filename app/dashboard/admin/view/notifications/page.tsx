"use client";
import { useEffect, useState } from "react";
import { BellIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function ViewNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ title: '', message: '' });

  useEffect(() => {
    fetch("/api/notification")
      .then(res => res.json())
      .then(data => setNotifications(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = notifications.filter(n =>
    (filter.title === '' || (n.title && n.title.toLowerCase().includes(filter.title.toLowerCase()))) &&
    (filter.message === '' || (n.message && n.message.toLowerCase().includes(filter.message.toLowerCase())))
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
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <BellIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">View Notifications</h2>
            <p className="text-gray-300">Manage and browse system notifications</p>
          </div>

          {/* Filter Section */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white border-opacity-20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Filter Notifications</h3>
            </div>
            <div className="flex flex-wrap gap-4">
              <input 
                className="flex-1 min-w-[200px] px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by title..." 
                value={filter.title} 
                onChange={e => setFilter(f => ({ ...f, title: e.target.value }))} 
              />
              <input 
                className="flex-1 min-w-[200px] px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by message..." 
                value={filter.message} 
                onChange={e => setFilter(f => ({ ...f, message: e.target.value }))} 
              />
            </div>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading notifications...
                </div>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 text-center">
                <BellIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-300">No notifications found.</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {grouped.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {row.map((notification, idx) => (
                    <div key={idx} className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex items-start justify-between mb-4">
                        <h3 className="text-lg font-semibold text-white pr-2">{notification.title}</h3>
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                          <BellIcon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <div className="text-sm text-gray-300 bg-white bg-opacity-5 rounded-lg p-3">
                          {notification.message}
                        </div>
                      </div>
                      
                      <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-white border-opacity-10">
                        ID: {notification._id}
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