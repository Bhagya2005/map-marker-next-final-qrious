import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Walkthrough from '@/lib/models/Walkthrough';
import { authenticateRequest } from '@/lib/middleware/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const walkthrough = await Walkthrough.findById(params.id).populate('createdBy', 'username email');
    
    if (!walkthrough) {
      return NextResponse.json(
        { message: 'Walkthrough not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(walkthrough);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch walkthrough' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = authenticateRequest(req);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { message: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const updateData = await req.json();

    const walkthrough = await Walkthrough.findById(params.id);
    if (!walkthrough) {
      return NextResponse.json(
        { message: 'Walkthrough not found' },
        { status: 404 }
      );
    }

    Object.assign(walkthrough, updateData);
    await walkthrough.save();
    await walkthrough.populate('createdBy', 'username email');

    return NextResponse.json(walkthrough);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to update walkthrough' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = authenticateRequest(req);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { message: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const walkthrough = await Walkthrough.findByIdAndDelete(params.id);

    if (!walkthrough) {
      return NextResponse.json(
        { message: 'Walkthrough not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Walkthrough deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to delete walkthrough' },
      { status: 500 }
    );
  }
}
