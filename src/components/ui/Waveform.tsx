// ─────────────────────────────────────────────
//  components/ui/Waveform.tsx
//  Multi-bar animated waveform
// ─────────────────────────────────────────────
"use client";

interface WaveformProps {
  active: boolean;
  color?: string;
  bars?: number;
  height?: number;
}

export function Waveform({
  active,
  color = "#7C3AED",
  bars = 22,
  height = 44,
}: WaveformProps) {
  const anims = ["wv1", "wv2", "wv3", "wv4", "wv5"];
  const speeds = [0.38, 0.44, 0.51, 0.58, 0.66, 0.72, 0.81];

  return (
    <div style={{ display: "flex", gap: 2, alignItems: "center", height }}>
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          style={{
            width: 3,
            borderRadius: 3,
            background: color,
            minHeight: 3,
            height: active ? undefined : 4,
            animation: active
              ? `${anims[i % 5]} ${speeds[i % 7]}s ease-in-out infinite`
              : "none",
            opacity: active ? 0.85 : 0.3,
            transition: "opacity 0.3s",
          }}
        />
      ))}
    </div>
  );
}