import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db/connection';
import Notes from '@/lib/models/Notes';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const data = await req.json();
    const note = await Notes.create(data);
    return NextResponse.json(note);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to create note' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const notes = await Notes.find();
    return NextResponse.json(notes);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to fetch notes' }, { status: 500 });
  }
}
