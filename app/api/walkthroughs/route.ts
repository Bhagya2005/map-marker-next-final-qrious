import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Walkthrough from "@/lib/models/Walkthrough";
import { withCORS, handleCORSPreflight } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleCORSPreflight();
}

export async function GET(req: Request) {
  await dbConnect();

  try {
    const walkthroughs = await Walkthrough.find({ isActive: true })
      .sort({ createdAt: 1 });

    return withCORS(
      NextResponse.json({
        walkthroughs,
      }),
      req as NextRequest
    );
  } catch (error) {
    return withCORS(
      NextResponse.json(
        { error: "Failed to fetch walkthroughs" },
        { status: 500 }
      ),
      req as NextRequest
    );
  }
}
