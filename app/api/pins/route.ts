import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Pin from "@/lib/models/pins";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  

  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";

  const query: any = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;

  try {
    const skip = (page - 1) * limit;
    const pins = await Pin.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Pin.countDocuments(query);

    return NextResponse.json({
      pins,
      totalPages: Math.ceil(total / limit),
      totalItems: total
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const pin = await Pin.create(body);
  return NextResponse.json(pin, { status: 201 });
}