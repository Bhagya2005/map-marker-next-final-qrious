import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/lib/models/Feedback';
import { authenticateRequest } from '@/lib/middleware/auth';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await dbConnect();
    const feedback = await Feedback.findById(params.id).populate('userId', 'username email');
    
    if (!feedback) {
      return NextResponse.json(
        { message: 'Feedback not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(feedback);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch feedback' },
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

    const feedback = await Feedback.findById(params.id);
    if (!feedback) {
      return NextResponse.json(
        { message: 'Feedback not found' },
        { status: 404 }
      );
    }

    Object.assign(feedback, updateData);
    await feedback.save();

    return NextResponse.json(feedback);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to update feedback' },
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
    const feedback = await Feedback.findByIdAndDelete(params.id);

    if (!feedback) {
      return NextResponse.json(
        { message: 'Feedback not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Feedback deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to delete feedback' },
      { status: 500 }
    );
  }
}
