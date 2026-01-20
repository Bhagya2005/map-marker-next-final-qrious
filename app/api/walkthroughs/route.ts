import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Walkthrough from "@/lib/models/Walkthrough";

export async function GET(req: Request) {
  await dbConnect();

  try {
    const walkthroughs = await Walkthrough.find({ isActive: true })
      .sort({ createdAt: 1 });

    return NextResponse.json({
      walkthroughs,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch walkthroughs" },
      { status: 500 }
    );
  }
}
