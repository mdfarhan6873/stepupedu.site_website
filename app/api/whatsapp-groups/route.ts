import { NextRequest, NextResponse } from 'next/server';
import WhatsAppGroup from '@/lib/models/WhatsAppGroup';
import connectDB from '@/lib/db/connection';

// GET - Fetch all WhatsApp groups
export async function GET() {
  try {
    await connectDB();
    const groups = await WhatsAppGroup.find({}).sort({ class: 1, section: 1 });
    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching WhatsApp groups:', error);
    return NextResponse.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

// POST - Create new WhatsApp group
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { class: className, section, groupLink, groupName, description } = body;

    // Validate required fields
    if (!className || !section || !groupLink || !groupName) {
      return NextResponse.json(
        { error: 'Class, section, group link, and group name are required' },
        { status: 400 }
      );
    }

    // Check if group already exists for this class-section
    const existingGroup = await WhatsAppGroup.findOne({ class: className, section });
    if (existingGroup) {
      return NextResponse.json(
        { error: 'WhatsApp group already exists for this class and section' },
        { status: 409 }
      );
    }

    const newGroup = new WhatsAppGroup({
      class: className,
      section,
      groupLink,
      groupName,
      description: description || '',
      isActive: true
    });

    await newGroup.save();
    return NextResponse.json(newGroup, { status: 201 });
  } catch (error) {
    console.error('Error creating WhatsApp group:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: 'WhatsApp group already exists for this class and section' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Failed to create group' }, { status: 500 });
  }
}

// PATCH - Update WhatsApp group
export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, class: className, section, groupLink, groupName, description, isActive } = body;

    if (!id) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (className !== undefined) updateData.class = className;
    if (section !== undefined) updateData.section = section;
    if (groupLink !== undefined) updateData.groupLink = groupLink;
    if (groupName !== undefined) updateData.groupName = groupName;
    if (description !== undefined) updateData.description = description;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedGroup = await WhatsAppGroup.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedGroup) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json(updatedGroup);
  } catch (error) {
    console.error('Error updating WhatsApp group:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 11000) {
      return NextResponse.json(
        { error: 'WhatsApp group already exists for this class and section' },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: 'Failed to update group' }, { status: 500 });
  }
}

// DELETE - Delete WhatsApp group
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Group ID is required' }, { status: 400 });
    }

    const deletedGroup = await WhatsAppGroup.findByIdAndDelete(id);

    if (!deletedGroup) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Error deleting WhatsApp group:', error);
    return NextResponse.json({ error: 'Failed to delete group' }, { status: 500 });
  }
}