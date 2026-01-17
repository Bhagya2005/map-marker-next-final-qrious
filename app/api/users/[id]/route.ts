import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/lib/models/User';
import { authenticateRequest } from '@/lib/middleware/auth';

export async function GET(
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
    const user = await User.findById(params.id).select('-password');
    
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch user' },
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
    const { username, role, isActive } = await req.json();

    const user = await User.findById(params.id);
    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    if (username) user.username = username;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;

    await user.save();

    return NextResponse.json({
      message: 'User updated successfully',
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to update user' },
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
    const user = await User.findByIdAndDelete(params.id);

    if (!user) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'User deleted successfully' });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to delete user' },
      { status: 500 }
    );
  }
}
