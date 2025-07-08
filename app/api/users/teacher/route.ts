import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Teacher from '@/lib/models/Teacher';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();

    // Validate required fields
    const required = ['name', 'mobileNo', 'password', 'address', 'subjects'];
    for (const field of required) {
      if (!data[field]) {
        return NextResponse.json(
          { message: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Parse subjects string into the required format
    let subjects;
    try {
      // Split on subjects using regex to match 'Subject[classes]' pattern
      const subjectArr = data.subjects.match(/[^,]+\[[^\]]+\]/g);
      if (!subjectArr) throw new Error('Invalid subjects format');
      subjects = subjectArr.map((subject: string) => {
        const [subjectName, classesStr] = subject.trim().split('[');
        if (!classesStr) throw new Error('Invalid subjects format');
        const classes = classesStr.replace(']', '').split(',').map((c: string) => c.trim());
        return { subjectName: subjectName.trim(), classes };
      });
    } catch (err) {
      return NextResponse.json(
        { message: 'Invalid subjects format. Use: Math[6,7,8], Science[6,7]' },
        { status: 400 }
      );
    }

    const teacher = await Teacher.create({
      ...data,
      subjects,
      role: 'teacher'
    });

    return NextResponse.json(teacher);
  } catch (error: any) {
    console.error(error); // <--- This will show the real error in your terminal
    return NextResponse.json(
      { message: error.message || 'Failed to create teacher' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    await connectDB();
    const teachers = await Teacher.find();
    return NextResponse.json(teachers);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch teachers' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { id, ...data } = await req.json();
    const updatedTeacher = await Teacher.findByIdAndUpdate(id, data, { new: true });
    if (!updatedTeacher) {
      return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
    }
    return NextResponse.json(updatedTeacher);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update teacher' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    const deletedTeacher = await Teacher.findByIdAndDelete(id);
    if (!deletedTeacher) {
      return NextResponse.json({ message: 'Teacher not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Teacher deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to delete teacher' }, { status: 500 });
  }
}
