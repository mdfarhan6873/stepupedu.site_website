import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Attendance from '@/lib/models/Attendance';

// GET /api/attendance/student?class=...&section=...&studentId=...
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const className = searchParams.get('class');
    const section = searchParams.get('section');
    const studentId = searchParams.get('studentId');
    if (!className || !section || !studentId) {
      return NextResponse.json({ message: 'Missing required params' }, { status: 400 });
    }
    // Find all attendance docs for this class/section
    const docs = await Attendance.find({ class: className, section });
    // Filter only subjects where this student is present
    const filtered = docs.map(doc => {
      const subjects = doc.subjects?.map((subj: any) => ({
        subject: subj.subject,
        students: subj.students.filter((stu: any) => String(stu.studentId) === String(studentId)),
      }));
      return {
        date: doc.date,
        subjects,
      };
    });
    return NextResponse.json(filtered);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch student attendance' }, { status: 500 });
  }
}
