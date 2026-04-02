// src/app/api/admin/logout/route.ts
// Clears the httpOnly cookie on logout.
// httpOnly cookies can't be deleted from JS — only the server can do it.

import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ message: "Logged out" });
  res.cookies.set("nexamusic_admin", "", {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   0,      // ← expires immediately = deleted
    path:     "/",
  });
  return res;
}