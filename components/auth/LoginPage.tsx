'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { EyeIcon, EyeSlashIcon, DevicePhoneMobileIcon, LockClosedIcon, UserIcon, AcademicCapIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

type Role = 'admin' | 'teacher' | 'student';

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<Role>('teacher');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobileNo, password, role: activeTab }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      // Redirect based on role
      router.push(`/dashboard/${activeTab}`);
      toast.success('Login successful!');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { 
      id: 'teacher' as Role, 
      label: 'Teacher', 
      icon: AcademicCapIcon,
      gradient: 'from-emerald-500 to-teal-600',
      bgGradient: 'from-emerald-50 to-teal-50',
      textColor: 'text-emerald-700',
      borderColor: 'border-emerald-200'
    },
    { 
      id: 'student' as Role, 
      label: 'Student', 
      icon: UserIcon,
      gradient: 'from-blue-500 to-indigo-600',
      bgGradient: 'from-blue-50 to-indigo-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200'
    },
    { 
      id: 'admin' as Role, 
      label: 'Admin', 
      icon: ShieldCheckIcon,
      gradient: 'from-purple-500 to-pink-600',
      bgGradient: 'from-purple-50 to-pink-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200'
    },
  ];

  const currentRole = roles.find(role => role.id === activeTab)!;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 pt-8 pb-3 px-6">
        <div className="text-center">
          <div className="mx-auto w-20 h-20 bg-white bg-opacity-20 backdrop-blur-lg rounded-3xl flex items-center justify-center mb-6 shadow-2xl">
            <div className={`w-12 h-12 bg-gradient-to-r ${currentRole.gradient} rounded-2xl flex items-center justify-center`}>
              <currentRole.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome Back!</h1>
          <p className="text-gray-300 text-lg">Sign in to continue your journey</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 px-6">
        <div className="max-w-md mx-auto">
          {/* Role Selection */}
          <div className="mb-3">
            <p className="text-gray-300 text-sm font-medium mb-4 text-center">Select your role</p>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  onClick={() => setActiveTab(role.id)}
                  className={`relative p-4 rounded-2xl transition-all duration-300 transform ${
                    activeTab === role.id
                      ? `bg-gradient-to-r ${role.gradient} shadow-xl scale-105`
                      : 'bg-white bg-opacity-10 backdrop-blur-lg hover:bg-opacity-20 hover:scale-105'
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <role.icon className={`w-6 h-6 ${activeTab === role.id ? 'text-white' : 'text-gray-300'}`} />
                    <span className={`text-sm font-semibold ${activeTab === role.id ? 'text-white' : 'text-gray-300'}`}>
                      {role.label}
                    </span>
                  </div>
                  {activeTab === role.id && (
                    <div className="absolute inset-0 rounded-2xl ring-2 ring-white ring-opacity-50"></div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Login Form */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white border-opacity-20">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mobile Number Input */}
              <div className="space-y-2">
                <label className="text-white text-sm font-semibold flex items-center gap-2">
                  <DevicePhoneMobileIcon className="w-4 h-4" />
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DevicePhoneMobileIcon className="h-5 w-5 text-gray-300" />
                  </div>
                  <input
                    id="mobileNo"
                    name="mobileNo"
                    type="tel"
                    required
                    value={mobileNo}
                    onChange={(e) => setMobileNo(e.target.value)}
                    placeholder="Enter your mobile number"
                    className="w-full pl-14 pr-4 py-4 bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:bg-opacity-30 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-white text-sm font-semibold flex items-center gap-2">
                  <LockClosedIcon className="w-4 h-4" />
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-300" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full pl-14 pr-14 py-4 bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-30 rounded-2xl text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 focus:bg-opacity-30 transition-all duration-300"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-300 hover:text-white transition-colors duration-300" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-300 hover:text-white transition-colors duration-300" />
                    )}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 px-6 rounded-2xl font-bold text-white text-lg transition-all duration-300 transform ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed opacity-50'
                    : `bg-gradient-to-r ${currentRole.gradient} hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl`
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-3">
                    <span>Sign In</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <a
              href="/contact-us"
              className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors duration-300 bg-white bg-opacity-10 backdrop-blur-lg px-6 py-3 rounded-2xl hover:bg-opacity-20"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm font-medium">Forgot password? Contact Us</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Safe Area */}
      <div className="h-8"></div>

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