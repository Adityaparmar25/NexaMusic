// ═══════════════════════════════════════════
//  app/api/search/route.ts
//  GET /api/search?q=  — full-text search
// ═══════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { TrackModel } from "@/models/Track";

export async function GET(req: NextRequest) {
  const q = new URL(req.url).searchParams.get("q")?.trim() ?? "";
  if (!q) return NextResponse.json({ data: [] });
  try {
    await connectDB();
    const tracks = await TrackModel.find(
      { isActive: true, $text: { $search: q } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(20)
      .lean();
    return NextResponse.json({ data: tracks.map((t) => ({ ...t, id: String(t._id) })) });
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}