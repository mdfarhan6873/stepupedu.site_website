"use client";
import { ClipboardIcon, ArrowLeftIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

const Assignments = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-orange-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="max-w-2xl mx-auto">
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
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                <ClipboardIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Assignments</h2>
            <p className="text-gray-300">View and manage your assignments</p>
          </div>

          {/* Coming Soon Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 border border-white border-opacity-20 shadow-xl text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-yellow-500 bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4">
                <ExclamationTriangleIcon className="w-8 h-8 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Feature Coming Soon</h3>
              <p className="text-gray-300 mb-6">
                The assignments feature is currently being developed and will be available soon.
              </p>
            </div>

            {/* Feature Preview */}
            <div className="bg-white bg-opacity-5 rounded-2xl p-6 mb-6">
              <h4 className="text-lg font-semibold text-white mb-4">Coming Features:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  View pending assignments
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Submit assignments online
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Track submission status
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Receive feedback
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Due date reminders
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  Grade notifications
                </div>
              </div>
            </div>

            <div className="bg-yellow-500 bg-opacity-20 border border-yellow-500 border-opacity-30 rounded-xl p-4">
              <div className="text-yellow-300 text-sm">
                <strong>Stay tuned!</strong> This feature will enhance your learning experience with better assignment management.
              </div>
            </div>
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
};

export default Assignments;