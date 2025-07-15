"use client";
import { useEffect, useState } from "react";
import { CheckCircleIcon, MagnifyingGlassIcon, ClipboardDocumentIcon, PhoneIcon, CalendarDaysIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface Student {
  _id: string;
  name: string;
  class: string;
  section: string;
  rollNo: string;
  mobileNo: string;
  parentName: string;
  parentMobileNo: string;
  address: string;
}

interface AttendanceRecord {
  date: string;
  subjects: {
    subject: string;
    students: {
      studentId: string;
      status: 'Present' | 'Absent';
    }[];
  }[];
}

export default function StudentAttendance() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [attendanceLoading, setAttendanceLoading] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  
  // Filter states
  const [filterType, setFilterType] = useState<'mobile' | 'details'>('mobile');
  const [mobileFilter, setMobileFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [rollNoFilter, setRollNoFilter] = useState('');

  // Fetch all students
  useEffect(() => {
    fetch("/api/users/student")
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setFilteredStudents(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Filter students based on search criteria
  useEffect(() => {
    if (filterType === 'mobile') {
      if (mobileFilter.trim() === '') {
        setFilteredStudents([]);
      } else {
        const filtered = students.filter(student =>
          student.mobileNo.includes(mobileFilter)
        );
        setFilteredStudents(filtered);
      }
    } else {
      if (classFilter.trim() === '' && sectionFilter.trim() === '' && rollNoFilter.trim() === '') {
        setFilteredStudents([]);
      } else {
        const filtered = students.filter(student =>
          (classFilter === '' || student.class.toLowerCase().includes(classFilter.toLowerCase())) &&
          (sectionFilter === '' || student.section.toLowerCase().includes(sectionFilter.toLowerCase())) &&
          (rollNoFilter === '' || student.rollNo.toLowerCase().includes(rollNoFilter.toLowerCase()))
        );
        setFilteredStudents(filtered);
      }
    }
  }, [filterType, mobileFilter, classFilter, sectionFilter, rollNoFilter, students]);

  // Fetch attendance for selected student and month
  const fetchAttendance = async (student: Student) => {
    setAttendanceLoading(true);
    try {
      const response = await fetch(`/api/attendance/student?class=${student.class}&section=${student.section}&studentId=${student._id}`);
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setAttendanceData([]);
    } finally {
      setAttendanceLoading(false);
    }
  };

  const handleSelectStudent = (student: Student) => {
    setSelectedStudent(student);
    fetchAttendance(student);
  };

  // Generate attendance table for selected month
  const generateAttendanceTable = () => {
    if (!selectedStudent || !attendanceData.length) return [];

    const monthStr = selectedMonth.toString().padStart(2, '0');
    const yearStr = selectedYear.toString();
    
    // Filter attendance data for selected month and year
    const monthData = attendanceData.filter(record => {
      if (!record.date) return false;
      const recordYear = record.date.slice(0, 4);
      const recordMonth = record.date.slice(5, 7);
      return recordYear === yearStr && recordMonth === monthStr;
    });

    // Process attendance records
    const attendanceMap: { [date: string]: { present: number; absent: number; subjects: string[] } } = {};

    monthData.forEach(record => {
      const date = record.date;
      if (!attendanceMap[date]) {
        attendanceMap[date] = { present: 0, absent: 0, subjects: [] };
      }

      record.subjects?.forEach(subject => {
        subject.students?.forEach(studentRecord => {
          if (studentRecord.studentId === selectedStudent._id) {
            attendanceMap[date].subjects.push(subject.subject);
            if (studentRecord.status === 'Present') {
              attendanceMap[date].present++;
            } else {
              attendanceMap[date].absent++;
            }
          }
        });
      });
    });

    // Convert to array and sort by date
    return Object.entries(attendanceMap)
      .map(([date, data]) => ({
        date,
        present: data.present,
        absent: data.absent,
        subjects: data.subjects,
        status: data.present > 0 ? 'Present' : 'Absent'
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const attendanceTable = generateAttendanceTable();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-cyan-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 min-h-screen px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-white bg-opacity-20 backdrop-blur-lg rounded-2xl flex items-center justify-center mb-4 shadow-xl">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                <CheckCircleIcon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Student Attendance</h2>
            <p className="text-gray-300">View individual student attendance records</p>
          </div>

          {/* Filter Section */}
          <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white border-opacity-20 shadow-xl">
            <div className="flex items-center gap-2 mb-4">
              <MagnifyingGlassIcon className="w-5 h-5 text-white" />
              <h3 className="text-lg font-semibold text-white">Search Student</h3>
            </div>
            
            {/* Filter Type Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setFilterType('mobile')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filterType === 'mobile'
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
                }`}
              >
                Search by Mobile
              </button>
              <button
                onClick={() => setFilterType('details')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  filterType === 'details'
                    ? 'bg-cyan-500 text-white shadow-lg'
                    : 'bg-white bg-opacity-10 text-gray-300 hover:bg-opacity-20'
                }`}
              >
                Search by Class Details
              </button>
            </div>

            {/* Filter Inputs */}
            {filterType === 'mobile' ? (
              <div className="grid grid-cols-1 gap-4">
                <input 
                  className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300" 
                  placeholder="Enter mobile number..." 
                  value={mobileFilter}
                  onChange={e => setMobileFilter(e.target.value)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300" 
                  placeholder="Class..." 
                  value={classFilter}
                  onChange={e => setClassFilter(e.target.value)}
                />
                <input 
                  className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300" 
                  placeholder="Section..." 
                  value={sectionFilter}
                  onChange={e => setSectionFilter(e.target.value)}
                />
                <input 
                  className="px-4 py-3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-300" 
                  placeholder="Roll Number..." 
                  value={rollNoFilter}
                  onChange={e => setRollNoFilter(e.target.value)}
                />
              </div>
            )}
          </div>

          {/* Student Results */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20">
                <div className="flex items-center gap-3 text-white">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Loading students...
                </div>
              </div>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-8 border border-white border-opacity-20 text-center">
                <CheckCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <div className="text-gray-300">
                  {(filterType === 'mobile' && mobileFilter) || (filterType === 'details' && (classFilter || sectionFilter || rollNoFilter))
                    ? "No students found matching your search criteria."
                    : "Enter search criteria to find students."}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {filteredStudents.map((student) => (
                <div 
                  key={student._id} 
                  onClick={() => handleSelectStudent(student)}
                  className={`bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl hover:bg-opacity-15 transition-all duration-300 transform hover:scale-[1.02] cursor-pointer ${
                    selectedStudent?._id === student._id ? 'ring-2 ring-cyan-500 bg-opacity-20' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white pr-2">{student.name}</h3>
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <CheckCircleIcon className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">Roll No:</span>
                      <span className="text-sm text-white font-medium">{student.rollNo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-300">Class:</span>
                      <span className="text-sm text-white font-medium">{student.class} - {student.section}</span>
                    </div>
                    
                    <div className="bg-white bg-opacity-5 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-300">Mobile:</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-white font-mono">{student.mobileNo}</span>
                          <button
                            className="p-1 bg-white bg-opacity-10 rounded hover:bg-opacity-20 transition-all duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(student.mobileNo);
                            }}
                            title="Copy Mobile No"
                          >
                            <ClipboardDocumentIcon className="w-3 h-3 text-gray-300" />
                          </button>
                          <a
                            href={`tel:${student.mobileNo}`}
                            onClick={(e) => e.stopPropagation()}
                            className="p-1 bg-green-500 bg-opacity-20 rounded hover:bg-opacity-30 transition-all duration-300"
                            title="Call Student"
                          >
                            <PhoneIcon className="w-3 h-3 text-green-300" />
                          </a>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-300">
                      <span className="font-medium">Parent:</span> {student.parentName}
                    </div>
                  </div>
                  
                  {selectedStudent?._id === student._id && (
                    <div className="mt-4 pt-4 border-t border-white border-opacity-20">
                      <div className="flex items-center gap-2 text-cyan-300 text-sm">
                        <CheckCircleIcon className="w-4 h-4" />
                        Selected for attendance view
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Attendance Section */}
          {selectedStudent && (
            <div className="bg-white bg-opacity-10 backdrop-blur-xl rounded-2xl p-6 border border-white border-opacity-20 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Attendance for {selectedStudent.name}</h3>
                  <p className="text-gray-300">Class {selectedStudent.class} - Section {selectedStudent.section}</p>
                </div>
                <div className="flex gap-3">
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    className="px-3 py-2 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {months.map((month, index) => (
                      <option key={index} value={index + 1} className="bg-gray-800 text-white">
                        {month}
                      </option>
                    ))}
                  </select>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    className="px-3 py-2 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  >
                    {years.map((year) => (
                      <option key={year} value={year} className="bg-gray-800 text-white">
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {attendanceLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-3 text-white">
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading attendance data...
                  </div>
                </div>
              ) : attendanceTable.length === 0 ? (
                <div className="text-center py-12">
                  <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <div className="text-gray-300">
                    No attendance records found for {months[selectedMonth - 1]} {selectedYear}
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-white">
                    <thead>
                      <tr className="border-b border-white border-opacity-20">
                        <th className="text-left py-3 px-4 font-semibold">Date</th>
                        <th className="text-left py-3 px-4 font-semibold">Day</th>
                        <th className="text-center py-3 px-4 font-semibold">Status</th>
                        <th className="text-center py-3 px-4 font-semibold">Present Periods</th>
                        <th className="text-center py-3 px-4 font-semibold">Absent Periods</th>
                        <th className="text-left py-3 px-4 font-semibold">Subjects</th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendanceTable.map((record, index) => (
                        <tr key={index} className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors duration-200">
                          <td className="py-3 px-4">{new Date(record.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">{new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' })}</td>
                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center">
                              {record.status === 'Present' ? (
                                <div className="flex items-center gap-1 text-green-400">
                                  <CheckCircleIcon className="w-4 h-4" />
                                  <span className="text-sm font-medium">Present</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1 text-red-400">
                                  <XCircleIcon className="w-4 h-4" />
                                  <span className="text-sm font-medium">Absent</span>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="bg-green-500 bg-opacity-20 text-green-300 px-2 py-1 rounded-full text-sm">
                              {record.present}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className="bg-red-500 bg-opacity-20 text-red-300 px-2 py-1 rounded-full text-sm">
                              {record.absent}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex flex-wrap gap-1">
                              {record.subjects.map((subject, idx) => (
                                <span key={idx} className="bg-cyan-500 bg-opacity-20 text-cyan-300 px-2 py-1 rounded text-xs">
                                  {subject}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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