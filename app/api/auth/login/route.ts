import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Admin from '@/lib/models/Admin';
import Teacher from '@/lib/models/Teacher';
import Student from '@/lib/models/Student';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { mobileNo, password, role } = await req.json();

    let user;
    switch (role) {
      case 'admin':
        user = await Admin.findOne({ mobileNo });
        break;
      case 'teacher':
        user = await Teacher.findOne({ mobileNo });
        break;
      case 'student':
        user = await Student.findOne({ mobileNo });
        break;
      default:
        throw new Error('Invalid role');
    }

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (user.password !== password) {
      return NextResponse.json(
        { message: 'Invalid password' },
        { status: 401 }
      );
    }

    if (user.role !== role) {
      return NextResponse.json(
        { message: 'Invalid role for this user' },
        { status: 403 }
      );
    }

    // Create session data
    type SessionUser = {
      id: any;
      name: any;
      role: any;
      mobileNo: any;
      class?: any;
      section?: any;
      rollNo?: any;
    };

    let sessionUser: SessionUser = {
      id: user._id,
      name: user.name,
      role: user.role,
      mobileNo: user.mobileNo
    };
    // Add extra fields for student
    if (user.role === 'student') {
      sessionUser = {
        ...sessionUser,
        class: user.class,
        section: user.section,
        rollNo: user.rollNo
      };
    }
    const session = { user: sessionUser };

    // Set session cookie (expires in 7 days)
    const response = NextResponse.json(session);
    response.cookies.set('session', JSON.stringify(session), {
      httpOnly: false, // For demo; set to true for production and use server-side session
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
