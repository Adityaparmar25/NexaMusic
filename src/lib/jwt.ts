
// ═══════════════════════════════════════════
//  lib/jwt.ts  — Admin JWT helpers
// ═══════════════════════════════════════════
import { SignJWT, jwtVerify } from "jose";

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET ?? "fallback_dev_secret");
const ALG    = "HS256";

export async function signAdminToken(email: string): Promise<string> {
  return new SignJWT({ email, role: "admin" })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(SECRET);
}

export async function verifyAdminToken(
  token: string
): Promise<{ email: string; role: string } | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as { email: string; role: string };
  } catch {
    return null;
  }
}