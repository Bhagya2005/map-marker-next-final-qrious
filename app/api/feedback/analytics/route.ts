import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Feedback from '@/lib/models/Feedback';
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

    const totalFeedback = await Feedback.countDocuments();
    const averageRating = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: '$rating' },
        },
      },
    ]);

    const byCategory = await Feedback.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    const byStatus = await Feedback.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json({
      totalFeedback,
      averageRating: averageRating[0]?.avgRating || 0,
      byCategory,
      byStatus,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message || 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
