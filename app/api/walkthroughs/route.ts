import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Walkthrough from "@/lib/models/Walkthrough";

export async function GET(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 5;

  const query = search 
    ? { $or: [{ title: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }] }
    : {};

  try {
    const skip = (page - 1) * limit;
    // Hum 'order' field se sort karenge taaki drag-drop order barkarar rahe
    const walkthroughs = await Walkthrough.find(query).sort({ order: 1 }).skip(skip).limit(limit);
    const total = await Walkthrough.countDocuments(query);

    return NextResponse.json({ walkthroughs, totalPages: Math.ceil(total / limit) });
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// Bulk update for Drag and Drop order
export async function PUT(req: Request) {
  await dbConnect();
  const { orderedIds } = await req.json(); // Array of IDs in new order
  
  try {
    const updates = orderedIds.map((id: string, index: number) => 
      Walkthrough.findByIdAndUpdate(id, { order: index })
    );
    await Promise.all(updates);
    return NextResponse.json({ message: "Order updated" });
  } catch (err) {
    return NextResponse.json({ error: "Reorder failed" }, { status: 500 });
  }
}