import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Walkthrough from '@/lib/models/Walkthrough';
import { authenticateRequest } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const walkthroughs = await Walkthrough.find().populate('createdBy', 'username email');
    return NextResponse.json(walkthroughs);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch walkthroughs' },
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
    const { title, description, points, videoUrl, duration } = await req.json();

    const walkthrough = new Walkthrough({title,description,points,videoUrl,duration,createdBy: (auth.user as any).id});

    await walkthrough.save();
    await walkthrough.populate('createdBy', 'username email');

    return NextResponse.json(walkthrough, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to create walkthrough' },
      { status: 500 }
    );
  }
}
