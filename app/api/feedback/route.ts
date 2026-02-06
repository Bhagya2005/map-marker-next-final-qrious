import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Feedback from "@/lib/models/Feedback";
import { withCORS, handleCORSPreflight } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleCORSPreflight();
}

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";

  const query: any = {};
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } }
    ];
  }
  if (category) query.category = category;
  if (status) query.status = status;

  try {
    const skip = (page - 1) * limit;
    const feedbacks = await Feedback.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments(query);

    const stats = await Feedback.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } }
    ]);

    return withCORS(
      NextResponse.json({
        feedbacks,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        stats
      }),
      req as NextRequest
    );
  } catch (err) {
    return withCORS(
      NextResponse.json({ error: "Fetch failed" }, { status: 500 }),
      req as NextRequest
    );
  }
}