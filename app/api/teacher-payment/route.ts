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
