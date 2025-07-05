"use client";
import { useEffect, useState } from "react";

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
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Notifications</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <input className="input w-full max-w-xs" placeholder="Filter by title..." value={filter.title} onChange={e => setFilter(f => ({ ...f, title: e.target.value }))} />
        <input className="input w-full max-w-xs" placeholder="Filter by message..." value={filter.message} onChange={e => setFilter(f => ({ ...f, message: e.target.value }))} />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-400">No notifications found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-4">
              {row.map((notification, idx) => (
                <div key={idx} className="flex-1 bg-white rounded shadow p-4 flex flex-col gap-2 border min-w-[220px]">
                  <div className="font-semibold text-lg">{notification.title}</div>
                  <div className="text-sm text-gray-600">{notification.message}</div>
                  <div className="text-xs text-gray-400 mt-2">ID: {notification._id}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
