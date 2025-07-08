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

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { id, ...data } = await req.json();
    const updatedNotification = await Notification.findByIdAndUpdate(id, data, { new: true });
    if (!updatedNotification) {
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json(updatedNotification);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update notification' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      return NextResponse.json({ message: 'Notification not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Notification deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to delete notification' }, { status: 500 });
  }
}
