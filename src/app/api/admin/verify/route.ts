// src/app/api/admin/verify/route.ts
//
// Called on page load to check if the admin JWT cookie is still valid.
// Returns 200 if logged in, 401 if not — no body needed beyond that.
// This is what allows the session to survive a page refresh.

import { NextRequest, NextResponse } from "next/server";
import { verifyAdminToken } from "@/lib/jwt";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("nexamusic_admin")?.value;

  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const payload = await verifyAdminToken(token);

  if (!payload) {
    // Token expired or tampered — clear the stale cookie
    const res = NextResponse.json({ error: "Session expired" }, { status: 401 });
    res.cookies.delete("nexamusic_admin");
    return res;
  }

  return NextResponse.json({ email: payload.email, role: payload.role });
}


// ── Also add a logout route so the cookie is properly cleared ────
// src/app/api/admin/logout/route.ts  (add this as a separate file)
//
// export async function POST() {
//   const res = NextResponse.json({ message: "Logged out" });
//   res.cookies.delete("nexamusic_admin");
//   return res;
// }