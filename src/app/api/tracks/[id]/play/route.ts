import { NextRequest, NextResponse } from "next/server";
import { connectDB }   from "@/lib/mongodb";
import { TrackModel }  from "@/models/Track";

type Params = { params: Promise<{ id: string }> };

export async function POST(_: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await connectDB();
    await TrackModel.findByIdAndUpdate(id, { $inc: { playCount: 1 } });
    return NextResponse.json({ message: "ok" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}