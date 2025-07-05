'use client'
import React, { useEffect, useState } from 'react';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await fetch('/api/teacher-payment');
        const data = await res.json();
        setPayments(data.filter((p: any) => p.mobileNo === (typeof window !== 'undefined' ? getTeacherMobile() : '')));
      } catch (err) {
        setError('Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  // Helper to get logged-in teacher's mobile from cookie/session
  function getTeacherMobile() {
    const sessionData = document.cookie.split(';').find(cookie => cookie.trim().startsWith('session='));
    if (sessionData) {
      try {
        const userData = JSON.parse(decodeURIComponent(sessionData.split('=')[1]));
        return userData.user.mobileNo;
      } catch {
        return '';
      }
    }
    return '';
  }

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-2">My Payments</h2>
      {payments.length === 0 ? <div>No payments found.</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {payments.map((p: any, i: number) => (
            <div key={p._id || i} className="bg-white rounded shadow p-4 flex flex-col gap-2">
              <div className="font-bold text-lg text-blue-700">₹{p.amount}</div>
              <div><span className="font-semibold">Paid To:</span> {p.paidTo}</div>
              <div><span className="font-semibold">Mobile No:</span> {p.mobileNo}</div>
              <div><span className="font-semibold">Month:</span> {p.month}</div>
              <div><span className="font-semibold">Remark:</span> {p.remark || '-'}</div>
              <div><span className="font-semibold">Payment Date:</span> {p.paymentDate ? new Date(p.paymentDate).toLocaleDateString() : '-'}</div>
              <div><span className="font-semibold">Mode:</span> {p.mode}</div>
              {p.utrNo && <div><span className="font-semibold">UTR No:</span> {p.utrNo}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Payments;
