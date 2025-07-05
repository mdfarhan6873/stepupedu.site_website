'use client'
import React, { useEffect, useState } from 'react';

interface Notification {
  _id: string;
  title?: string;
  message?: string;
  createdAt?: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/notification');
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data.reverse() : []);
      } catch (err) {
        setError('Failed to fetch notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-2 sm:p-6 max-w-2xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-center flex-1">Notifications</h2>
        <button
          type="button"
          title="Mark My Attendance"
          className="ml-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-full p-2 shadow transition focus:outline-none"
          onClick={() => alert('Mark My Attendance feature coming soon!')}
        >
          <span className="text-2xl" role="img" aria-label="Mark Attendance">📝</span>
        </button>
      </div>
      {notifications.length === 0 ? (
        <div className="text-center text-gray-500">No notifications found.</div>
      ) : (
        <div className="space-y-4">
          {notifications.map((n: Notification) => (
            <div key={n._id} className="bg-white rounded shadow p-4 border flex flex-col gap-1">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                <div className="font-semibold text-base text-blue-700">{n.title || 'Notification'}</div>
                <div className="text-xs text-gray-400 mt-1 sm:mt-0">{n.createdAt ? new Date(n.createdAt).toLocaleString() : ''}</div>
              </div>
              <div className="text-gray-800 whitespace-pre-line">{n.message || ''}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
