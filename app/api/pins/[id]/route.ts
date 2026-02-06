import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/mongodb";
import Pin from "@/lib/models/pins";
import { withCORS, handleCORSPreflight } from "@/lib/cors";

export async function OPTIONS(req: NextRequest) {
  return handleCORSPreflight();
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const pin = await Pin.findById(params.id);
    if (!pin) return withCORS(NextResponse.json({ error: "Not found" }, { status: 404 }), req as NextRequest);
    return withCORS(NextResponse.json(pin), req as NextRequest);
  } catch (error) {
    return withCORS(NextResponse.json({ error: "Failed" }, { status: 500 }), req as NextRequest);
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await req.json();
    delete body._id;
    delete body.id;

    if (body.lat != null) body.lat = Number(body.lat);
    if (body.lng != null) body.lng = Number(body.lng);

    if (body.images && !Array.isArray(body.images)) {
      body.images = [String(body.images)];
    }

    if (body.category) {
      const Category = (await import('@/lib/models/Category')).default;
      const catQuery: any = { name: body.category };
      if (body.userId) catQuery.userId = body.userId;
      const cat = await Category.findOne(catQuery);
      if (cat) body.color = cat.color;
    }

    const updated = await Pin.findByIdAndUpdate(params.id, body, { new: true });
    if (!updated) return withCORS(NextResponse.json({ error: "Not found" }, { status: 404 }), req as NextRequest);
    return withCORS(NextResponse.json(updated), req as NextRequest);
  } catch (error) {
    return withCORS(NextResponse.json({ error: "Failed to update" }, { status: 500 }), req as NextRequest);
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    await Pin.findByIdAndDelete(params.id);
    return withCORS(NextResponse.json({ ok: true }), req as NextRequest);
  } catch (error) {
    return withCORS(NextResponse.json({ error: "Failed to delete" }, { status: 500 }), req as NextRequest);
  }
}
