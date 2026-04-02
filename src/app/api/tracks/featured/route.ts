
// ═══════════════════════════════════════════
//  app/api/tracks/featured/route.ts
// ═══════════════════════════════════════════
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { TrackModel } from "@/models/Track";

export async function GET() {
  try {
    await connectDB();
    const tracks = await TrackModel.find({ isActive: true, featured: true })
      .sort({ order: 1 })
      .limit(10)
      .lean();
    return NextResponse.json({ data: tracks.map((t) => ({ ...t, id: String(t._id) })) });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}