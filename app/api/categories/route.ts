import { NextResponse, NextRequest } from "next/server";
import Category from "@/lib/models/Category";
import dbConnect from "@/lib/mongodb";
import { withCORS, handleCORSPreflight } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleCORSPreflight();
}

export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const cat = await Category.create(body);
    return withCORS(NextResponse.json(cat, { status: 201 }), req as NextRequest);
  } catch (error: any) {
    return withCORS(
      NextResponse.json({ error: error?.message || "Failed to create category" }, { status: 500 }),
      req as NextRequest
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    const query: any = {};
    if (userId) query.userId = userId;

    const cats = await Category.find(query);
    return withCORS(NextResponse.json(cats), req as NextRequest);
  } catch (error: any) {
    return withCORS(
      NextResponse.json({ error: error?.message || "Failed to fetch categories" }, { status: 500 }),
      req as NextRequest
    );
  }
}
