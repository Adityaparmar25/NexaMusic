
// ═══════════════════════════════════════════
//  app/error.tsx
//  Global error boundary
// ═══════════════════════════════════════════
"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[NexaMusic] Unhandled error:", error);
  }, [error]);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0F0A1E",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: 24,
        textAlign: "center",
        color: "#F9FAFB",
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ fontSize: 52, marginBottom: 8 }}>🎵</div>
      <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 4 }}>
        Something went wrong
      </h1>
      <p style={{ color: "#9CA3AF", fontSize: 14, maxWidth: 360, lineHeight: 1.7 }}>
        {error.message ?? "An unexpected error occurred. Please try again."}
      </p>
      <button
        onClick={reset}
        style={{
          marginTop: 12,
          padding: "11px 28px",
          borderRadius: 24,
          background: "linear-gradient(135deg,#7C3AED,#06B6D4)",
          border: "none",
          color: "#fff",
          fontWeight: 700,
          fontSize: 14,
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Try again
      </button>
    </div>
  );
}