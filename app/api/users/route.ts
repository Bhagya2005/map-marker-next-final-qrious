import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
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
  const role = searchParams.get("role") || "";

  const query: any = {};
  if (search) {
    query.$or = [
      { email: { $regex: search, $options: "i" } },
      { username: { $regex: search, $options: "i" } }
    ];
  }
  if (role) query.role = role;

  try {
    const skip = (page - 1) * limit;
    const users = await User.find(query)
      .select("+password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return withCORS(
      NextResponse.json({
        users,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }),
      req as NextRequest
    );
  } catch (error) {
    return withCORS(
      NextResponse.json({ error: "Fetch failed" }, { status: 500 }),
      req as NextRequest
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const user = await User.create(body);
    return withCORS(
      NextResponse.json(user, { status: 201 }),
      req as NextRequest
    );
  } catch (err: any) {
    return withCORS(
      NextResponse.json({ error: err.message }, { status: 400 }),
      req as NextRequest
    );
  }
}