// ─────────────────────────────────────────────
//  components/ui/Skeleton.tsx
//  Shimmer loading card
// ─────────────────────────────────────────────
import { COLORS } from "@/constants/colors";

export function Skeleton() {
  return (
    <div
      style={{
        background: COLORS.bgSurface,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        style={{
          paddingBottom: "100%",
          position: "relative",
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 100%)",
          backgroundSize: "800px 100%",
          animation: "shimmer 1.6s ease-in-out infinite",
        }}
      />
      <div style={{ padding: "12px 14px" }}>
        {[70, 48, 60].map((w, i) => (
          <div
            key={i}
            style={{
              height: 11,
              borderRadius: 6,
              background: "rgba(255,255,255,0.06)",
              marginBottom: 8,
              width: `${w}%`,
            }}
          />
        ))}
      </div>
    </div>
  );
}