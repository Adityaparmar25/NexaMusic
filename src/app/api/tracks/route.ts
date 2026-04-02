// src/app/api/tracks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB }        from "@/lib/mongodb";
import { TrackModel }       from "@/models/Track";
import { verifyAdminToken } from "@/lib/jwt";

/** Build a streamable Drive URL from a file ID */
const driveUrl = (id: string) =>
  `https://drive.google.com/uc?export=download&id=${id}`;

/** Shape a raw Mongoose doc into a frontend-ready Track object */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toTrack = (doc: any) => ({
  ...doc,
  id:    String(doc._id),
  // Compute src from driveFileId — never store raw Drive URLs in the DB
  // because Google rotates download URLs; the file ID is stable.
  src:   doc.driveFileId ? driveUrl(doc.driveFileId) : (doc.src ?? ""),
  // Map coverArtUrl (schema field) → cover (frontend type field)
  cover: doc.coverArtUrl || doc.cover || "",
});

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const genre = searchParams.get("genre");
    const page  = Math.max(1, Number(searchParams.get("page")  ?? 1));
    const limit = Math.min(100, Math.max(1, Number(searchParams.get("limit") ?? 20)));

    const filter: Record<string, unknown> = { isActive: true };
    if (genre && genre !== "All") filter.genre = genre;

    const [docs, total] = await Promise.all([
      TrackModel.find(filter)
        .sort({ order: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      TrackModel.countDocuments(filter),
    ]);

    return NextResponse.json({
      data:    docs.map(toTrack),
      total,
      page,
      limit,
      hasMore: page * limit < total,
    });
  } catch (err) {
    console.error("[NexaMusic] GET /api/tracks error:", err);
    return NextResponse.json({ error: "Failed to fetch tracks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("nexamusic_admin")?.value;
  if (!token || !(await verifyAdminToken(token))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const body  = await req.json();
    const track = await TrackModel.create(body);
    return NextResponse.json(
      { data: toTrack(track.toObject()) },
      { status: 201 }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to create track";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}