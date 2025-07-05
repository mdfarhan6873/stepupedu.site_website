import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Student from '@/lib/models/Student';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();

    const student = await Student.create({
      ...data,
      role: 'student'
    });

    return NextResponse.json(student);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to create student' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const className = searchParams.get('class');
    const section = searchParams.get('section');
    let filter: any = {};
    if (className) filter.class = className;
    if (section) filter.section = section;
    const students = await Student.find(filter);
    return NextResponse.json(students);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch students' }, { status: 500 });
  }
}
