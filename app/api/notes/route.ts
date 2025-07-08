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

export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { id, ...data } = await req.json();
    const updatedNote = await Notes.findByIdAndUpdate(id, data, { new: true });
    if (!updatedNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json(updatedNote);
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    const deletedNote = await Notes.findByIdAndDelete(id);
    if (!deletedNote) {
      return NextResponse.json({ message: 'Note not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Note deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ message: error.message || 'Failed to delete note' }, { status: 500 });
  }
}
