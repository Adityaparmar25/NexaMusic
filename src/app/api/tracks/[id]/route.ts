// src/app/api/tracks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Types }            from "mongoose";
import { connectDB }        from "@/lib/mongodb";
import { TrackModel }       from "@/models/Track";
import { verifyAdminToken } from "@/lib/jwt";

type Params = { params: Promise<{ id: string }> };

const driveUrl = (id: string) =>
  `https://drive.google.com/uc?export=download&id=${id}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toTrack = (doc: any) => ({
  ...doc,
  id:    String(doc._id),
  src:   doc.driveFileId ? driveUrl(doc.driveFileId) : (doc.src ?? ""),
  cover: doc.coverArtUrl || doc.cover || "",
});

const isValidObjectId = (id: string) =>
  Types.ObjectId.isValid(id) && String(new Types.ObjectId(id)) === id;

export async function GET(_: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isValidObjectId(id))
    return NextResponse.json({ error: "Invalid track ID" }, { status: 400 });

  try {
    await connectDB();
    const doc = await TrackModel.findById(id).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: toTrack(doc) });
  } catch {
    return NextResponse.json({ error: "Failed to fetch track" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isValidObjectId(id))
    return NextResponse.json({ error: "Invalid track ID" }, { status: 400 });

  const token = req.cookies.get("nexamusic_admin")?.value;
  if (!token || !(await verifyAdminToken(token)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const body = await req.json();
    const doc  = await TrackModel.findByIdAndUpdate(
      id, body, { new: true, runValidators: true }
    ).lean();
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ data: toTrack(doc) });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!isValidObjectId(id))
    return NextResponse.json(
      { error: "Cannot delete a demo track — add real tracks via Admin first." },
      { status: 400 }
    );

  const token = req.cookies.get("nexamusic_admin")?.value;
  if (!token || !(await verifyAdminToken(token)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await connectDB();
    const doc = await TrackModel.findById(id);
    if (!doc) return NextResponse.json({ error: "Track not found" }, { status: 404 });
    await TrackModel.findByIdAndUpdate(id, { isActive: false });
    return NextResponse.json({ message: "Track deactivated" });
  } catch {
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}