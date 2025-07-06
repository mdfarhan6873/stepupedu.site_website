"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { CurrencyRupeeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function AddTeacherPayment() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/teacher-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create teacher payment");
      }
      toast.success("Teacher payment added!");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to create teacher payment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="max-w-3xl mx-auto">
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
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <CurrencyRupeeIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Add Teacher Payment</h2>
            <p className="text-gray-300">Record a new teacher salary payment</p>
          </div>

          {/* Form Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 border border-white border-opacity-20 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Amount</label>
                  <input 
                    name="amount" 
                    type="number" 
                    required 
                    min="0"
                    step="0.01"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Salary amount (₹)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Paid To</label>
                  <input 
                    name="paidTo" 
                    required 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Teacher name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Mobile No</label>
                  <input 
                    name="mobileNo" 
                    required 
                    type="tel"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Teacher mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Month</label>
                  <input 
                    name="month" 
                    required 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g. January 2024"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Payment Date</label>
                  <input 
                    name="paymentDate" 
                    type="date" 
                    required 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Payment Mode</label>
                  <select 
                    name="mode" 
                    required 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  >
                    <option value="online" className="bg-slate-800">Online</option>
                    <option value="offline" className="bg-slate-800">Offline</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-white mb-2">UTR No (if online)</label>
                  <input 
                    name="utrNo" 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                    placeholder="Transaction reference number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Remark</label>
                <input 
                  name="remark" 
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300"
                  placeholder="Additional notes (optional)"
                />
              </div>
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </div>
                ) : (
                  "Add Payment"
                )}
              </button>
            </form>
          </div>
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