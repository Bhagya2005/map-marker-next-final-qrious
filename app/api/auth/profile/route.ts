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
    const user = await User.findById((auth.user as any).id).select('-password');

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = authenticateRequest(req);

    if (!auth.authenticated || !auth.user) {
      return NextResponse.json(
        { message: auth.error || 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();
    const { username, password } = await req.json();
    const user = await User.findById((auth.user as any).id);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (username) user.username = username;
    if (password) user.password = password;

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
