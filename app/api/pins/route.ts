import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Pin from "@/lib/models/pins";
import Category from "@/lib/models/Category";
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
  const userId = searchParams.get("userId") || "";

  const query: any = {};
  if (search) query.name = { $regex: search, $options: "i" };
  if (category) query.category = category;
  if (userId) query.userId = userId;

  try {
    const skip = (page - 1) * limit;
    const pins = await Pin.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Pin.countDocuments(query);

    return withCORS(
      NextResponse.json({
        pins,
        totalPages: Math.ceil(total / limit),
        totalItems: total
      }),
      req as NextRequest
    );
  } catch (error) {
    return withCORS(
      NextResponse.json({ error: "Failed to fetch" }, { status: 500 }),
      req as NextRequest
    );
  }
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();

    delete body._id;
    delete body.id;

    if (body.lat == null || body.lng == null || !body.name) {
      return withCORS(
        NextResponse.json({ error: "Missing required fields (name, lat, lng)" }, { status: 400 }),
        req as NextRequest
      );
    }

    body.lat = Number(body.lat);
    body.lng = Number(body.lng);

    if (body.images && !Array.isArray(body.images)) {
      body.images = [String(body.images)];
    }

    // privacy default
    if (!body.privacy) body.privacy = 'public';

    if (body.category) {
      const catQuery: any = { name: body.category };
      if (body.userId) catQuery.userId = body.userId;
      const cat = await Category.findOne(catQuery);
      if (cat) body.color = cat.color;
    }

    const pin = await Pin.create(body);
    return withCORS(
      NextResponse.json(pin, { status: 201 }),
      req as NextRequest
    );
  } catch (error: any) {
    console.error("/api/pins POST error:", error?.message || error);
    return withCORS(
      NextResponse.json({ error: error?.message || "Failed to create pin" }, { status: 500 }),
      req as NextRequest
    );
  }
}