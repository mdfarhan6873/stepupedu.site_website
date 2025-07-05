"use client";
import { useEffect, useState } from "react";

export default function ViewTeacherPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ mobileNo: '', paidTo: '', mode: '', month: '' });

  useEffect(() => {
    fetch("/api/teacher-payment")
      .then(res => res.json())
      .then(data => setPayments(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter(p =>
    (filter.mobileNo === '' || (p.mobileNo && p.mobileNo.includes(filter.mobileNo))) &&
    (filter.paidTo === '' || (p.paidTo && p.paidTo.toLowerCase().includes(filter.paidTo.toLowerCase()))) &&
    (filter.mode === '' || (p.mode && p.mode.toLowerCase().includes(filter.mode.toLowerCase()))) &&
    (filter.month === '' || (p.month && p.month.toLowerCase().includes(filter.month.toLowerCase())))
  );

  const groupSize = filtered.length <= 4 ? 2 : 3;
  const grouped = [];
  for (let i = 0; i < filtered.length; i += groupSize) {
    grouped.push(filtered.slice(i, i + groupSize));
  }

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Teacher Payments</h2>
      <div className="flex flex-wrap gap-4 mb-6">
        <input className="input w-full max-w-xs" placeholder="Filter by mobile no..." value={filter.mobileNo} onChange={e => setFilter(f => ({ ...f, mobileNo: e.target.value }))} />
        <input className="input w-full max-w-xs" placeholder="Filter by paid to..." value={filter.paidTo} onChange={e => setFilter(f => ({ ...f, paidTo: e.target.value }))} />
        <input className="input w-full max-w-xs" placeholder="Filter by mode..." value={filter.mode} onChange={e => setFilter(f => ({ ...f, mode: e.target.value }))} />
        <input className="input w-full max-w-xs" placeholder="Filter by month..." value={filter.month} onChange={e => setFilter(f => ({ ...f, month: e.target.value }))} />
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : filtered.length === 0 ? (
        <div className="text-gray-400">No payments found.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {grouped.map((row, rowIdx) => (
            <div key={rowIdx} className="flex gap-4">
              {row.map((payment, idx) => (
                <div key={idx} className="flex-1 bg-white rounded shadow p-4 flex flex-col gap-2 border min-w-[220px]">
                  <div className="font-semibold text-lg">Amount: ₹{payment.amount}</div>
                  <div className="text-sm text-gray-600">Mobile: {payment.mobileNo}</div>
                  <div className="text-sm text-gray-600">Paid To: {payment.paidTo}</div>
                  <div className="text-sm text-gray-600">Month: {payment.month}</div>
                  <div className="text-sm text-gray-600">Date: {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : ''}</div>
                  <div className="text-sm text-gray-600">Mode: {payment.mode}</div>
                  {payment.utrNo && <div className="text-sm text-gray-600">UTR: {payment.utrNo}</div>}
                  {payment.remark && <div className="text-xs text-gray-500">Remark: {payment.remark}</div>}
                  <div className="text-xs text-gray-400 mt-2">ID: {payment._id}</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
