import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Attendance from '@/lib/models/Attendance';
import mongoose from 'mongoose';

// GET /api/attendance/class?date=...&class=...&section=...&subject=...
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const date = searchParams.get('date');
    const className = searchParams.get('class');
    const section = searchParams.get('section');
    const subject = searchParams.get('subject');

    if (!date || !className || !section) {
      return NextResponse.json({ message: 'Missing required params: date, class, section' }, { status: 400 });
    }

    // Find attendance document for the specific date, class, and section
    const attendanceDoc = await Attendance.findOne({ 
      date,
      class: className,
      section 
    }).populate({
      path: 'subjects.students.studentId',
      model: 'Student',
      select: 'name rollNo mobileNo parentName parentMobileNo'
    });

    if (!attendanceDoc) {
      return NextResponse.json({ message: 'No attendance record found for this date, class, and section' }, { status: 404 });
    }

    // If subject is specified, filter for that subject only
    if (subject) {
      const subjectData = attendanceDoc.subjects.find((s: any) => s.subject === subject);
      if (!subjectData) {
        return NextResponse.json({ message: 'Subject not found in attendance record' }, { status: 404 });
      }

      return NextResponse.json({
        date: attendanceDoc.date,
        class: attendanceDoc.class,
        section: attendanceDoc.section,
        subject: subjectData.subject,
        students: subjectData.students.map((student: any) => ({
          studentId: student.studentId._id,
          name: student.studentId.name,
          rollNo: student.studentId.rollNo,
          mobileNo: student.studentId.mobileNo,
          parentName: student.studentId.parentName,
          parentMobileNo: student.studentId.parentMobileNo,
          status: student.status
        }))
      });
    }

    // Return all subjects and their attendance
    const result = {
      date: attendanceDoc.date,
      class: attendanceDoc.class,
      section: attendanceDoc.section,
      subjects: attendanceDoc.subjects.map((subj: any) => ({
        subject: subj.subject,
        students: subj.students.map((student: any) => ({
          studentId: student.studentId._id,
          name: student.studentId.name,
          rollNo: student.studentId.rollNo,
          mobileNo: student.studentId.mobileNo,
          parentName: student.studentId.parentName,
          parentMobileNo: student.studentId.parentMobileNo,
          status: student.status
        }))
      }))
    };

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Error fetching class attendance:', error);
    return NextResponse.json({ message: error.message || 'Failed to fetch class attendance' }, { status: 500 });
  }
}