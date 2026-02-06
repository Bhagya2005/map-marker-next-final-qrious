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

    const { username, email, password, role } = await req.json();

    if (!username || !email || !password) {
      return withCORS(
        NextResponse.json(
          { message: "All fields required" },
          { status: 400 }
        ),
        req as NextRequest
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return withCORS(
        NextResponse.json(
          { message: "User already exists" },
          { status: 400 }
        ),
        req as NextRequest
      );
    }

    const user = await User.create({username,email,password, role: role || "regular"});

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return withCORS(
      NextResponse.json(
        {
          message: "User registered successfully",
          token,
          user: {
            id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
          },
        },
        { status: 201 }
      ),
      req as NextRequest
    );
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return withCORS(
      NextResponse.json(
        { message: "Server error" },
        { status: 500 }
      ),
      req as NextRequest
    );
  }
}
