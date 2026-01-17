export const runtime = "nodejs";

import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export async function POST(req: Request) {
  try {
    await dbConnect();

    const { username, email, password, role } = await req.json();

    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "All fields required" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const user = await User.create({username,email,password, role: role || "regular"});

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return NextResponse.json(
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
    );
  } catch (err: any) {
    console.error("REGISTER ERROR:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
