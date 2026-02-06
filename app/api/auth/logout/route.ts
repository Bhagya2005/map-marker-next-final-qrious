import { NextResponse, NextRequest } from "next/server";
import { withCORS, handleCORSPreflight } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleCORSPreflight();
}

export async function POST(req: Request) {
  const res = withCORS(NextResponse.json({ success: true }), req as NextRequest);

  res.cookies.set("token", "", { expires: new Date(0), path: "/" });

  return res;
}
