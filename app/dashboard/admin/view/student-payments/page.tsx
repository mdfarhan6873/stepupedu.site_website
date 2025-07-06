"use client";
import { useEffect, useState } from "react";
import { CurrencyRupeeIcon, MagnifyingGlassIcon, CalendarIcon, CreditCardIcon } from "@heroicons/react/24/outline";

export default function ViewStudentPayments() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ mobileNo: '', paidBy: '', mode: '' });

  useEffect(() => {
    fetch("/api/student-payment")
      .then(res => res.json())
      .then(data => setPayments(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter(p =>
    (filter.mobileNo === '' || (p.mobileNo && p.mobileNo.includes(filter.mobileNo))) &&
    (filter.paidBy === '' || (p.paidBy && p.paidBy.toLowerCase().includes(filter.paidBy.toLowerCase()))) &&
    (filter.mode === '' || (p.mode && p.mode.toLowerCase().includes(filter.mode.toLowerCase())))
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
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-rose-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-xl flex items-center justify-center">
                <CurrencyRupeeIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">View Student Payments</h2>
            <p className="text-gray-300">Track and manage student payment records</p>
          </div>

          {/* Filter Section */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white border-opacity-20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Filter Payments</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by mobile no..." 
                value={filter.mobileNo} 
                onChange={e => setFilter(f => ({ ...f, mobileNo: e.target.value }))} 
              />
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by paid by..." 
                value={filter.paidBy} 
                onChange={e => setFilter(f => ({ ...f, paidBy: e.target.value }))} 
              />
              <input 
                className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-300" 
                placeholder="Filter by mode..." 
                value={filter.mode} 
                onChange={e => setFilter(f => ({ ...f, mode: e.target.value }))} 
              />
            </div>
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
          ) : filtered.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 text-center">
                <CurrencyRupeeIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-300">No payments found.</div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {grouped.map((row, rowIdx) => (
                <div key={rowIdx} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {row.map((payment, idx) => (
                    <div key={idx} className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-[1.02]">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                            <CurrencyRupeeIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-white">₹{payment.amount}</h3>
                            <p className="text-sm text-gray-300">Student Payment</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.mode === 'online' 
                            ? 'bg-green-500 bg-opacity-20 text-green-300' 
                            : 'bg-blue-500 bg-opacity-20 text-blue-300'
                        }`}>
                          {payment.mode}
                        </div>
                      </div>
                      
                      <div className="space-y-3 mb-4">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-300">Mobile:</span>
                          <span className="text-sm text-white font-mono">{payment.mobileNo}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-300">Paid By:</span>
                          <span className="text-sm text-white">{payment.paidBy || 'N/A'}</span>
                        </div>
                        
                        <div className="bg-white bg-opacity-5 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <CalendarIcon className="w-4 h-4 text-pink-400" />
                            <span className="text-sm text-gray-300">Payment Date:</span>
                          </div>
                          <span className="text-sm text-white">
                            {payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            }) : 'N/A'}
                          </span>
                        </div>
                        
                        {payment.utrNo && (
                          <div className="bg-white bg-opacity-5 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <CreditCardIcon className="w-4 h-4 text-green-400" />
                              <span className="text-sm text-gray-300">UTR Number:</span>
                            </div>
                            <span className="text-sm text-white font-mono">{payment.utrNo}</span>
                          </div>
                        )}
                        
                        {payment.remark && (
                          <div className="bg-white bg-opacity-5 rounded-lg p-3">
                            <span className="text-sm text-gray-300">Remark:</span>
                            <div className="text-sm text-white mt-1">{payment.remark}</div>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-xs text-gray-400 mt-4 pt-4 border-t border-white border-opacity-10">
                        ID: {payment._id}
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