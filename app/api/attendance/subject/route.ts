import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import connectDB from '@/lib/db/connection';
import Attendance from '@/lib/models/Attendance';

// PATCH /api/attendance/subject
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { className, section, date, subject, students } = await req.json();
    if (!className || !section || !date || !subject || !Array.isArray(students)) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Find the attendance doc for this class/section/date
    let attendanceDoc = await Attendance.findOne({ class: className, section, date });

    if (!attendanceDoc) {
      // Create new doc if not exists
      attendanceDoc = await Attendance.create({
        class: className,
        section,
        date,
        subjects: [{ subject, students }],
      });
    } else {
      // Check if subject exists
      const subjectIdx = attendanceDoc.subjects.findIndex((s: any) => s.subject === subject);
      if (subjectIdx > -1) {
        // Update students for this subject
        attendanceDoc.subjects[subjectIdx].students = students;
      } else {
        // Add new subject
        attendanceDoc.subjects.push({ subject, students });
      }
      await attendanceDoc.save();
    }
    return NextResponse.json(attendanceDoc);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update attendance' }, { status: 500 });
  }
}
