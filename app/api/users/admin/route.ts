import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Admin from '@/lib/models/Admin';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();

    const admin = await Admin.create({
      ...data,
      role: 'admin'
    });

    return NextResponse.json(admin);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to create admin' },
      { status: 500 }
    );
  }
}
