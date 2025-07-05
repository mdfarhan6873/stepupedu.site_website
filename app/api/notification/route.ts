import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Notification from '@/lib/models/Notification';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const notification = await Notification.create(data);
    return NextResponse.json(notification);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create notification' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const notifications = await Notification.find();
    return NextResponse.json(notifications);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch notifications' }, { status: 500 });
  }
}
