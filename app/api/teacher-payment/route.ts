import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import TeacherPayment from '@/lib/models/TeacherPayment';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const payment = await TeacherPayment.create(data);
    return NextResponse.json(payment);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create teacher payment' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const payments = await TeacherPayment.find();
    return NextResponse.json(payments);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch teacher payments' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { id, ...data } = await req.json();
    const updatedPayment = await TeacherPayment.findByIdAndUpdate(id, data, { new: true });
    if (!updatedPayment) {
      return NextResponse.json({ message: 'Teacher payment not found' }, { status: 404 });
    }
    return NextResponse.json(updatedPayment);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update teacher payment' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    const deletedPayment = await TeacherPayment.findByIdAndDelete(id);
    if (!deletedPayment) {
      return NextResponse.json({ message: 'Teacher payment not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Teacher payment deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to delete teacher payment' }, { status: 500 });
  }
}
