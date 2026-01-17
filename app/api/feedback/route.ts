import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/lib/models/Feedback';
import { authenticateRequest } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const feedback = await Feedback.find().populate('userId', 'username email');
    return NextResponse.json(feedback);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch feedback' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = authenticateRequest(req);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { message: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { title, message, rating, category } = await req.json();

    const feedback = new Feedback({
      userId: (auth.user as any).id,
      title,
      message,
      rating,
      category,
    });

    await feedback.save();
    await feedback.populate('userId', 'username email');

    return NextResponse.json(feedback, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to create feedback' },
      { status: 500 }
    );
  }
}
