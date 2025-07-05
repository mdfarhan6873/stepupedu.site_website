import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Attendance from '@/lib/models/Attendance';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    // Upsert: find by year, month, and push entry
    let attendance = await Attendance.findOne({ year: data.year, month: data.month });
    if (!attendance) {
      attendance = await Attendance.create({ year: data.year, month: data.month, entries: [data.entry] });
    } else {
      attendance.entries.push(data.entry);
      await attendance.save();
    }
    return NextResponse.json(attendance);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to save attendance' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const year = searchParams.get('year');
    const month = searchParams.get('month');
    const studentName = searchParams.get('studentName');
    let query: any = {};
    if (year) query.year = year;
    if (month) query.month = month;
    const attendances = await Attendance.find(query);
    // If studentName is provided, filter entries for that student
    if (studentName) {
      const filtered = attendances.map(a => ({
        ...a.toObject(),
        entries: a.entries.map((e: any) => ({
          ...e,
          students: e.students.filter((s: any) => s.studentName === studentName)
        }))
      }));
      return NextResponse.json(filtered);
    }
    return NextResponse.json(attendances);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch attendance' }, { status: 500 });
  }
}
