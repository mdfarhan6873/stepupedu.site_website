import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import ResultTogether from '@/lib/models/ResultTogether';

export async function POST(req: NextRequest) {
  const { title, message, link } = await req.json();
  if (!title || !message) {
    return NextResponse.json({ error: 'Title and message are required.' }, { status: 400 });
  }
  await connectDB();
  const result = await ResultTogether.create({ title, message, link });
  return NextResponse.json({ success: true, id: result._id });
}

export async function GET() {
  await connectDB();
  const results = await ResultTogether.find({}).sort({ createdAt: -1 });
  return NextResponse.json(results);
}

export async function PATCH(req: NextRequest) {
  const { id, title, message, link } = await req.json();
  if (!id || !title || !message) {
    return NextResponse.json({ error: 'ID, title, and message are required.' }, { status: 400 });
  }
  await connectDB();
  const updated = await ResultTogether.findByIdAndUpdate(id, { title, message, link }, { new: true });
  if (!updated) {
    return NextResponse.json({ error: 'Result not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const { id } = await req.json();
  if (!id) {
    return NextResponse.json({ error: 'ID is required.' }, { status: 400 });
  }
  await connectDB();
  const deleted = await ResultTogether.findByIdAndDelete(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Result not found.' }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
