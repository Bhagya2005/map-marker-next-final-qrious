export const runtime = "nodejs";

import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import { withCORS, handleCORSPreflight } from "@/lib/cors";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function OPTIONS(req: NextRequest) {
  return handleCORSPreflight();
}

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return withCORS(
        NextResponse.json(
          { message: "Email and password required" },
          { status: 400 }
        ),
        req as NextRequest
      );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return withCORS(
        NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        ),
        req as NextRequest
      );
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return withCORS(
        NextResponse.json(
          { message: "Invalid credentials" },
          { status: 401 }
        ),
        req as NextRequest
      );
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return withCORS(
      NextResponse.json({
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      }),
      req as NextRequest
    );
  } catch (err: any) {
    console.error("LOGIN ERROR:", err);
    return withCORS(
      NextResponse.json(
        { message: "Server error" },
        { status: 500 }
      ),
      req as NextRequest
    );
  }
}


