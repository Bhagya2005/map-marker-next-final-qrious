import { NextResponse } from "next/server";
import Category from "@/lib/models/Category";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const cat = await Category.create(body);
  return NextResponse.json(cat);
}

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const cats = await Category.find({ userId });
  return NextResponse.json(cats);
}
