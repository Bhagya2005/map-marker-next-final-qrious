import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { authenticateRequest } from '@/lib/middleware/auth';
import { withCORS, handleCORSPreflight } from '@/lib/cors';

export async function OPTIONS(req: NextRequest) {
  return handleCORSPreflight();
}

export async function GET(req: NextRequest) {
  try {
    const auth = authenticateRequest(req);

    if (!auth.authenticated || !auth.user) {
      return withCORS(
        NextResponse.json(
          { message: auth.error || 'Unauthorized' },
          { status: 401 }
        ),
        req
      );
    }

    await dbConnect();
    const user = await User.findById((auth.user as any).id).select('-password');

    if (!user) {
      return withCORS(
        NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        ),
        req
      );
    }

    return withCORS(NextResponse.json(user), req);
  } catch (error: any) {
    return withCORS(
      NextResponse.json(
        { message: error.message || 'Failed to fetch profile' },
        { status: 500 }
      ),
      req
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const auth = authenticateRequest(req);

    if (!auth.authenticated || !auth.user) {
      return withCORS(
        NextResponse.json(
          { message: auth.error || 'Unauthorized' },
          { status: 401 }
        ),
        req
      );
    }

    await dbConnect();
    const { username, password } = await req.json();
    const user = await User.findById((auth.user as any).id);

    if (!user) {
      return withCORS(
        NextResponse.json(
          { message: 'User not found' },
          { status: 404 }
        ),
        req
      );
    }

    if (username) user.username = username;
    if (password) user.password = password;

    await user.save();

    return withCORS(
      NextResponse.json({
        message: 'Profile updated successfully',
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      }),
      req
    );
  } catch (error: any) {
    return withCORS(
      NextResponse.json(
        { message: error.message || 'Failed to update profile' },
        { status: 500 }
      ),
      req
    );
  }
}
