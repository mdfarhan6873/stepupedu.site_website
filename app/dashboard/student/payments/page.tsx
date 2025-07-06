'use client';
import React, { useEffect, useState } from 'react';
import { CreditCardIcon, ArrowLeftIcon, CalendarIcon, CurrencyRupeeIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    // Get user info from session cookie
    const sessionData = document.cookie
      .split(';')
      .find(cookie => cookie.trim().startsWith('session='));
    if (!sessionData) {
      setError('User not logged in');
      setLoading(false);
      return;
    }
    let user;
    try {
      const userData = JSON.parse(decodeURIComponent(sessionData.split('=')[1]));
      user = userData.user;
    } catch {
      setError('Invalid session');
      setLoading(false);
      return;
    }
    // Fetch filtered payments
    fetch(`/api/student-payment?mobileNo=${encodeURIComponent(user.mobileNo)}`)
      .then(res => res.json())
      .then(data => setPayments(data))
      .catch(() => setError('Failed to fetch payments'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-teal-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 bg-white bg-opacity-10 backdrop-blur-lg rounded-xl px-4 py-2 text-white hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20"
            >
              <ArrowLeftIcon className="h-4 w-4" />
              Back
            </button>
          </div>

          {/* Title Section */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <CreditCardIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">My Payments</h2>
            <p className="text-gray-300">View your payment history and transactions</p>
          </div>

          {/* Content */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading payments...
                </div>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-500 bg-opacity-20 backdrop-blur-xl rounded-2xl p-8 border border-red-500 border-opacity-30 text-center">
              <div className="text-red-300">{error}</div>
            </div>
          ) : payments.length === 0 ? (
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 text-center">
              <CreditCardIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-300">No payments found.</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {payments.map((payment: any) => (
                <div key={payment._id} className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-[1.02]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                        <CurrencyRupeeIcon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white">₹{payment.amount}</h3>
                        <p className="text-sm text-gray-300">Payment</p>
                      </div>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.mode === 'online' 
                        ? 'bg-green-500 bg-opacity-20 text-green-300' 
                        : 'bg-blue-500 bg-opacity-20 text-blue-300'
                    }`}>
                      {payment.mode?.toUpperCase()}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {(payment.description || payment.remark) && (
                      <div className="bg-white bg-opacity-5 rounded-lg p-3">
                        <span className="text-sm text-gray-300">Description:</span>
                        <div className="text-sm text-white mt-1">{payment.description || payment.remark}</div>
                      </div>
                    )}
                    
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">Paid By:</span>
                      <span className="text-sm text-white">{payment.paidBy || 'N/A'}</span>
                    </div>
                    
                    {payment.utrNo && (
                      <div className="bg-white bg-opacity-5 rounded-lg p-3">
                        <span className="text-sm text-gray-300">UTR/Txn No:</span>
                        <div className="text-sm text-white font-mono mt-1">{payment.utrNo}</div>
                      </div>
                    )}
                    
                    <div className="bg-white bg-opacity-5 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarIcon className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm text-gray-300">Payment Date:</span>
                      </div>
                      <span className="text-sm text-white">
                        {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : (payment.date ? new Date(payment.date).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        }) : 'N/A')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-white border-opacity-10">
                    Created: {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </div>
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
};

export default Payments;