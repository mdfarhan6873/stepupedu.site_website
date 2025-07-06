import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import StudentPayment from '@/lib/models/StudentPayment';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const payment = await StudentPayment.create(data);
    return NextResponse.json(payment);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create student payment' }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const mobileNo = searchParams.get('mobileNo');
    let query: any = {};
    if (mobileNo) query.mobileNo = mobileNo;
    const payments = await StudentPayment.find(query);
    return NextResponse.json(payments);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch student payments' }, { status: 500 });
  }
}
