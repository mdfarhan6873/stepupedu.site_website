"use client";
import { useEffect, useState } from "react";
import { CalendarDaysIcon, MagnifyingGlassIcon, ClipboardDocumentIcon, PhoneIcon, CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface Student {
  studentId: string;
  name: string;
  rollNo: string;
  mobileNo: string;
  parentName: string;
  parentMobileNo: string;
  status: 'Present' | 'Absent';
}

interface AttendanceData {
  date: string;
  class: string;
  section: string;
  subject?: string;
  subjects?: {
    subject: string;
    students: Student[];
  }[];
  students?: Student[];
}

export default function ClassAttendance() {
  const [attendanceData, setAttendanceData] = useState<AttendanceData | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [availableSubjects, setAvailableSubjects] = useState<string[]>([]);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Fetch attendance data when date, class, and section are selected
  const fetchAttendanceData = async () => {
    if (!selectedDate || !selectedClass || !selectedSection) return;

    setLoading(true);
    try {
      const url = new URL('/api/attendance/class', window.location.origin);
      url.searchParams.append('date', selectedDate);
      url.searchParams.append('class', selectedClass);
      url.searchParams.append('section', selectedSection);
      if (selectedSubject) {
        url.searchParams.append('subject', selectedSubject);
      }

      const response = await fetch(url.toString());
      if (response.ok) {
        const data = await response.json();
        setAttendanceData(data);
        
        // Set available subjects if not filtering by specific subject
        if (!selectedSubject && data.subjects) {
          setAvailableSubjects(data.subjects.map((s: any) => s.subject));
        }
      } else {
        setAttendanceData(null);
        setAvailableSubjects([]);
      }
    } catch (error) {
      console.error('Error fetching attendance data:', error);
      setAttendanceData(null);
      setAvailableSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedDate && selectedClass && selectedSection) {
      fetchAttendanceData();
    }
  }, [selectedDate, selectedClass, selectedSection, selectedSubject]);

  // Reset subject when class or section changes
  useEffect(() => {
    setSelectedSubject('');
    setAvailableSubjects([]);
  }, [selectedClass, selectedSection]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getStudentData = (): Student[] => {
    if (!attendanceData) return [];
    
    if (attendanceData.students) {
      return attendanceData.students;
    }
    
    if (attendanceData.subjects && selectedSubject) {
      const subjectData = attendanceData.subjects.find(s => s.subject === selectedSubject);
      return subjectData ? subjectData.students : [];
    }
    
    return [];
  };

  const studentData = getStudentData();
  const presentCount = studentData.filter(s => s.status === 'Present').length;
  const absentCount = studentData.filter(s => s.status === 'Absent').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-2 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <CalendarDaysIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Class Attendance</h2>
            <p className="text-gray-300">View attendance by date, class, section, and subject</p>
          </div>

          {/* Filter Section */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white border-opacity-20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Filter Attendance</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Date</label>
                <input 
                  type="date"
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300" 
                  value={selectedDate}
                  onChange={e => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Class</label>
                <input 
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300" 
                  placeholder="Enter class..." 
                  value={selectedClass}
                  onChange={e => setSelectedClass(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Section</label>
                <input 
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300" 
                  placeholder="Enter section..." 
                  value={selectedSection}
                  onChange={e => setSelectedSection(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subject (Optional)</label>
                <select 
                  className="w-full px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                  value={selectedSubject}
                  onChange={e => setSelectedSubject(e.target.value)}
                  disabled={!availableSubjects.length}
                >
                  <option value="" className="bg-gray-800 text-white">All Subjects</option>
                  {availableSubjects.map((subject) => (
                    <option key={subject} value={subject} className="bg-gray-800 text-white">
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {availableSubjects.length > 0 && !selectedSubject && (
              <div className="mt-4">
                <p className="text-sm text-gray-300 mb-2">Available subjects for {selectedDate}:</p>
                <div className="flex flex-wrap gap-2">
                  {availableSubjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => setSelectedSubject(subject)}
                      className="px-3 py-1 bg-indigo-500 bg-opacity-20 text-indigo-300 rounded-lg hover:bg-opacity-30 transition-all duration-300 text-sm"
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading attendance data...
                </div>
              </div>
            </div>
          ) : !attendanceData ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 text-center">
                <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-300">
                  {selectedDate && selectedClass && selectedSection
                    ? "No attendance record found for the selected criteria."
                    : "Please select date, class, and section to view attendance."}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl">
              {/* Header with Stats */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">
                    Attendance for {attendanceData.class} - {attendanceData.section}
                  </h3>
                  <p className="text-gray-300">
                    Date: {new Date(attendanceData.date).toLocaleDateString()}
                    {selectedSubject && ` | Subject: ${selectedSubject}`}
                  </p>
                </div>
                <div className="flex gap-4">
                  <div className="text-center">
                    <div className="text-green-400 text-2xl font-bold">{presentCount}</div>
                    <div className="text-green-300 text-sm">Present</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 text-2xl font-bold">{absentCount}</div>
                    <div className="text-red-300 text-sm">Absent</div>
                  </div>
                  <div className="text-center">
                    <div className="text-white text-2xl font-bold">{studentData.length}</div>
                    <div className="text-gray-300 text-sm">Total</div>
                  </div>
                </div>
              </div>

              {/* Student Table */}
              {studentData.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white border-opacity-20">
                        <th className="text-left py-3 px-4 font-semibold">Roll No</th>
                        <th className="text-left py-3 px-4 font-semibold">Name</th>
                        <th className="text-left py-3 px-4 font-semibold">Mobile</th>
                        <th className="text-center py-3 px-4 font-semibold">Actions</th>
                        <th className="text-center py-3 px-4 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentData
                        .sort((a, b) => parseInt(a.rollNo) - parseInt(b.rollNo))
                        .map((student, index) => (
                        <tr key={student.studentId} className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors duration-200">
                          <td className="py-3 px-4 font-medium">{student.rollNo}</td>
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-medium">{student.name}</div>
                              <div className="text-sm text-gray-300">Parent: {student.parentName}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm">{student.mobileNo}</span>
                                <button
                                  onClick={() => copyToClipboard(student.mobileNo)}
                                  className="p-1 bg-white bg-opacity-10 rounded hover:bg-opacity-20 transition-all duration-300"
                                  title="Copy Student Mobile"
                                >
                                  <ClipboardDocumentIcon className="w-3 h-3 text-gray-300" />
                                </button>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-sm text-gray-400">{student.parentMobileNo}</span>
                                <button
                                  onClick={() => copyToClipboard(student.parentMobileNo)}
                                  className="p-1 bg-white bg-opacity-10 rounded hover:bg-opacity-20 transition-all duration-300"
                                  title="Copy Parent Mobile"
                                >
                                  <ClipboardDocumentIcon className="w-3 h-3 text-gray-300" />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <a
                                href={`tel:${student.mobileNo}`}
                                className="p-2 bg-green-500 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-300"
                                title="Call Student"
                              >
                                <PhoneIcon className="w-4 h-4 text-green-300" />
                              </a>
                              <a
                                href={`tel:${student.parentMobileNo}`}
                                className="p-2 bg-blue-500 bg-opacity-20 rounded-lg hover:bg-opacity-30 transition-all duration-300"
                                title="Call Parent"
                              >
                                <PhoneIcon className="w-4 h-4 text-blue-300" />
                              </a>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center">
                              {student.status === 'Present' ? (
                                <div className="flex items-center gap-2 text-green-400">
                                  <CheckCircleIcon className="w-5 h-5" />
                                  <span className="font-medium">Present</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-red-400">
                                  <XCircleIcon className="w-5 h-5" />
                                  <span className="font-medium">Absent</span>
                                </div>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-300">No students found for the selected criteria.</div>
                </div>
              )}
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