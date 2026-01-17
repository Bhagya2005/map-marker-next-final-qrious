import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { authenticateRequest } from '@/lib/middleware/auth';

export async function GET(req: NextRequest) {
  try {
    const auth = authenticateRequest(req);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { message: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const users = await User.find().select('-password');
    return NextResponse.json(users);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
