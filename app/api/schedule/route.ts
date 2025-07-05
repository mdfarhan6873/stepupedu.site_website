import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Schedule from '@/lib/models/Schedule';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const schedule = await Schedule.create(data);
    return NextResponse.json(schedule);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create schedule' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const schedules = await Schedule.find();
    return NextResponse.json(schedules);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch schedules' }, { status: 500 });
  }
}
