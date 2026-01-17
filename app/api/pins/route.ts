import { NextResponse } from "next/server";
import Pin from "@/lib/models/pins";
import dbConnect from "@/lib/mongodb";

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const pin = await Pin.create(body);
  return NextResponse.json(pin);
}

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const pins = await Pin.find({ userId });
  return NextResponse.json(pins);
}
