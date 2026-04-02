
// ═══════════════════════════════════════════
//  app/api/admin/login/route.ts
// ═══════════════════════════════════════════
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB }       from "@/lib/mongodb";
import { AdminModel }      from "@/models/Admin";
import { signAdminToken }  from "@/lib/jwt";

// Simple in-memory rate limiter (use upstash/ratelimit in production)
const attempts = new Map<string, { count: number; reset: number }>();

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  const now = Date.now();

  const entry = attempts.get(ip) ?? { count: 0, reset: now + 60_000 };
  if (now > entry.reset) { entry.count = 0; entry.reset = now + 60_000; }
  entry.count++;
  attempts.set(ip, entry);
  if (entry.count > 5) {
    return NextResponse.json({ error: "Too many attempts. Try again in 1 minute." }, { status: 429 });
  }

  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required." }, { status: 400 });
    }

    await connectDB();
    const admin = await AdminModel.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    await AdminModel.findByIdAndUpdate(admin._id, { lastLoginAt: new Date() });

    const token = await signAdminToken(admin.email);
    const res   = NextResponse.json({ message: "ok", name: admin.name });
    res.cookies.set("nexamusic_admin", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   60 * 60 * 8, // 8 hours
      path:     "/",
    });
    return res;
  } catch (err) {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}