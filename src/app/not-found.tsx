
// ═══════════════════════════════════════════
//  app/not-found.tsx
// ═══════════════════════════════════════════
import Link from "next/link";

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        color: "#F9FAFB",
        fontFamily: "Inter, sans-serif",
        textAlign: "center",
        padding: 24,
      }}
    >
      <div style={{ fontSize: 64, fontWeight: 800, color: "#7C3AED", lineHeight: 1 }}>
        404
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700 }}>Page not found</h1>
      <p style={{ color: "#9CA3AF", fontSize: 14 }}>
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        style={{
          marginTop: 8,
          padding: "11px 28px",
          borderRadius: 24,
          background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          textDecoration: "none",
          display: "inline-block",
        }}
      >
        Go Home
      </Link>
    </div>
  );
}