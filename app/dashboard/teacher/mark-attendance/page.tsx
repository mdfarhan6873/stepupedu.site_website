
'use client'
import React, { useEffect, useState } from 'react';
import { ClipboardDocumentCheckIcon, CalendarIcon, ArrowLeftIcon, UserGroupIcon, ExclamationTriangleIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { usePatchSubjectAttendance } from '@/lib/hooks/usePatchSubjectAttendance';

const MarkAttendance = () => {
  const [date, setDate] = useState("");
  const [className, setClassName] = useState("");
  const [section, setSection] = useState("");
  const [subject, setSubject] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<Record<string, 'Present' | 'Absent'>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const router = useRouter();
  const { patchAttendance, loading: patching } = usePatchSubjectAttendance();

  // Set current date on mount
  useEffect(() => {
    setDate(new Date().toISOString().slice(0, 10));
  }, []);

  // Fetch students for selected class/section
  useEffect(() => {
    if (className && section) {
      setLoading(true);
      fetch(`/api/users/student?class=${className}&section=${section}`)
        .then(res => res.json())
        .then(data => {
          setStudents(data);
          setAttendance(
            Object.fromEntries(
              data.map((s: any) => [s._id, 'Present'])
            )
          );
        })
        .catch(() => setError("Failed to fetch students"))
        .finally(() => setLoading(false));
    } else {
      setStudents([]);
      setAttendance({});
    }
  }, [className, section]);

  const handleStatusToggle = (id: string) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: prev[id] === 'Present' ? 'Absent' : 'Present',
    }));
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setLoading(true);
    setSuccess("");
    setError("");
    setShowConfirmation(false);
    
    try {
      await patchAttendance({
        className,
        section,
        date,
        subject,
        students: students.map((s: any) => ({
          studentId: s._id,
          status: attendance[s._id],
        })),
      });
      setSuccess("Attendance saved successfully!");
    } catch (err: any) {
      setError(err.message || "Failed to save attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmation(false);
  };

  // Calculate attendance statistics
  const presentCount = Object.values(attendance).filter(status => status === 'Present').length;
  const absentCount = Object.values(attendance).filter(status => status === 'Absent').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-emerald-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-0 py-3">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-5">
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
                <ClipboardDocumentCheckIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Mark Attendance</h2>
            <p className="text-gray-300">Record subject-wise attendance for your class</p>
          </div>

          {/* Form Card */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl p-8 border border-white border-opacity-20 shadow-xl mb-8">
            <form onSubmit={handleSaveClick} className="space-y-6">
              {/* Date Display */}
              <div className="bg-white bg-opacity-5 rounded-2xl p-1">
                <div className="flex items-center gap-1 mb-3">
                  <CalendarIcon className="w-5 h-5 text-blue-400" />
                  <span className="text-sm font-medium text-white">Date</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="bg-white bg-opacity-10 rounded-lg px-3 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 border-none"
                    required
                  />
                </div>
              </div>

              {/* Class Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Class</label>
                  <input 
                    type="text" 
                    placeholder="e.g. 10" 
                    value={className} 
                    onChange={e => setClassName(e.target.value)} 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Section</label>
                  <input 
                    type="text" 
                    placeholder="e.g. A" 
                    value={section} 
                    onChange={e => setSection(e.target.value)} 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Subject</label>
                  <input 
                    type="text" 
                    placeholder="Subject name" 
                    value={subject} 
                    onChange={e => setSubject(e.target.value)} 
                    className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300" 
                    required 
                  />
                </div>
              </div>

              {/* Students List */}
              {students.length > 0 && (
                <div className="bg-white bg-opacity-5 rounded-2xl p-1">
                  <div className="flex items-center gap-2 mb-4">
                    <UserGroupIcon className="w-5 h-5 text-blue-400" />
                    <span className="text-lg font-medium text-white">Students ({students.length})</span>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="bg-white bg-opacity-10 rounded-xl overflow-hidden">
                      <table className="min-w-full">
                        <thead className="bg-white bg-opacity-10">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-white">Roll No</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-white">Name</th>
                            <th className="px-4 py-3 text-center text-sm font-medium text-white">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white divide-opacity-10">
                          {students
                            .sort((a, b) => (a.rollNo || 0) - (b.rollNo || 0))
                            .map((s: any) => (
                              <tr key={s._id} className="hover:bg-white hover:bg-opacity-5 transition-all duration-300">
                                <td className="px-4 py-3 text-center text-white font-semibold">{s.rollNo}</td>
                                <td className="px-4 py-3 text-white">{s.name}</td>
                                <td className="px-4 py-3 text-center">
                                  <button
                                    type="button"
                                    onClick={() => handleStatusToggle(s._id)}
                                    className="p-2 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all duration-300"
                                    title="Click to toggle status"
                                  >
                                    {attendance[s._id] === 'Present' && (
                                      <span className="text-green-400 text-2xl">✓</span>
                                    )}
                                    {attendance[s._id] === 'Absent' && (
                                      <span className="text-red-400 text-2xl">✗</span>
                                    )}
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                  {/* Legend */}
                  <div className="mt-4 flex flex-wrap gap-4 justify-center">
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 text-xl">✓</span>
                      <span className="text-sm text-gray-300">Present</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-red-400 text-xl">✗</span>
                      <span className="text-sm text-gray-300">Absent</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              {error && (
                <div className="bg-red-500 bg-opacity-20 border border-red-500 border-opacity-30 rounded-xl p-4">
                  <div className="text-red-300 text-center">{error}</div>
                </div>
              )}
              {success && (
                <div className="bg-green-500 bg-opacity-20 border border-green-500 border-opacity-30 rounded-xl p-4">
                  <div className="text-green-300 text-center">{success}</div>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                disabled={patching || loading || students.length === 0} 
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {patching || loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </div>
                ) : (
                  "Save Attendance"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 w-full max-w-md border border-white border-opacity-20">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 bg-opacity-20 rounded-xl flex items-center justify-center">
                  <ExclamationTriangleIcon className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Confirm Submission</h3>
              </div>
              <button 
                onClick={handleCancelSubmit}
                className="text-gray-300 hover:text-white transition-colors duration-300 p-1"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-4 mb-6">
              <p className="text-gray-300 text-center">
                Please review your attendance before submitting:
              </p>
              
              {/* Summary */}
              <div className="bg-white bg-opacity-5 rounded-xl p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-300">Date:</span>
                  <span className="text-white font-medium">{new Date(date).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Class:</span>
                  <span className="text-white font-medium">{className} - {section}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Subject:</span>
                  <span className="text-white font-medium">{subject}</span>
                </div>
                <div className="border-t border-white border-opacity-20 pt-3">
                  <div className="flex justify-between">
                    <span className="text-green-300 flex items-center gap-1">
                      <CheckCircleIcon className="w-4 h-4" />
                      Present:
                    </span>
                    <span className="text-green-300 font-bold">{presentCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-red-300 flex items-center gap-1">
                      <XMarkIcon className="w-4 h-4" />
                      Absent:
                    </span>
                    <span className="text-red-300 font-bold">{absentCount}</span>
                  </div>
                  <div className="flex justify-between border-t border-white border-opacity-20 pt-2 mt-2">
                    <span className="text-white font-medium">Total:</span>
                    <span className="text-white font-bold">{students.length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-orange-500 bg-opacity-10 border border-orange-500 border-opacity-30 rounded-xl p-3">
                <p className="text-orange-300 text-sm text-center">
                  ⚠️ Once submitted, this attendance cannot be easily modified. Please double-check all entries.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button 
                onClick={handleCancelSubmit}
                className="flex-1 bg-gray-500 bg-opacity-20 text-gray-300 py-3 rounded-xl font-medium hover:bg-opacity-30 transition-all duration-300"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmSubmit}
                disabled={patching}
                className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {patching ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  "Yes, Submit"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

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

export default MarkAttendance;
