
// ═══════════════════════════════════════════
//  app/loading.tsx
//  Root-level loading skeleton (Suspense boundary)
// ═══════════════════════════════════════════
export default function Loading() {
  const BG_DEEP    = "#0F0A1E";
  const BG_SURFACE = "#1E1B2E";
  const PRIMARY    = "#7C3AED";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: BG_DEEP,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 20,
      }}
    >
      {/* Spinning logo */}
      <div
        style={{
          width: 60,
          height: 60,
          borderRadius: 16,
          background: `linear-gradient(135deg,${PRIMARY},#06B6D4)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "spin 1.4s linear infinite",
          fontSize: 28,
        }}
      >
        ♪
      </div>

      {/* Shimmer bars */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10, width: 220 }}>
        {[100, 70, 85].map((w, i) => (
          <div
            key={i}
            style={{
              height: 12,
              borderRadius: 6,
              width: `${w}%`,
              background: BG_SURFACE,
              backgroundImage:
                "linear-gradient(90deg,rgba(255,255,255,0.03) 0%,rgba(255,255,255,0.07) 50%,rgba(255,255,255,0.03) 100%)",
              backgroundSize: "800px 100%",
              animation: `shimmer 1.6s ease-in-out ${i * 0.12}s infinite`,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes shimmer {
          0%   { background-position: -800px 0 }
          100% { background-position:  800px 0 }
        }
      `}</style>
    </div>
  );
}