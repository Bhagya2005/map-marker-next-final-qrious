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

    const totalUsers = await User.countDocuments();
    const adminCount = await User.countDocuments({ role: 'admin' });
    const regularCount = await User.countDocuments({ role: 'regular' });
    const activeCount = await User.countDocuments({ isActive: true });

    return NextResponse.json({
      totalUsers,
      adminCount,
      regularCount,
      activeCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}
