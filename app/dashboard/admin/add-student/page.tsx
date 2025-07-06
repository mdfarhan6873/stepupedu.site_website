"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { UserPlusIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function AddStudent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    try {
      const res = await fetch("/api/users/student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create student");
      }
      toast.success("Student created successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      toast.error(error.message || "Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
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
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <UserPlusIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Add Student</h2>
            <p className="text-gray-300">Register a new student to the system</p>
          </div>

          {/* Form Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 border border-white border-opacity-20 shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Name</label>
                  <input 
                    name="name" 
                    required 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Student full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Class</label>
                  <input 
                    name="class" 
                    required 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g. 10"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Section</label>
                  <input 
                    name="section" 
                    required 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="e.g. A"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Roll No</label>
                  <input 
                    name="rollNo" 
                    required 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Roll number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Mobile No</label>
                  <input 
                    name="mobileNo" 
                    required 
                    type="tel"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="10-digit mobile number"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Password</label>
                  <input 
                    name="password" 
                    type="password" 
                    required 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Login password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Parent Name</label>
                  <input 
                    name="parentName" 
                    required 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Parent full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Parent Mobile No</label>
                  <input 
                    name="parentMobileNo" 
                    required 
                    type="tel"
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    placeholder="Parent mobile number"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white mb-2">Address</label>
                <input 
                  name="address" 
                  required 
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                  placeholder="Complete address"
                />
              </div>

              <input type="hidden" name="role" value="student" />
              
              <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </div>
                ) : (
                  "Add Student"
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