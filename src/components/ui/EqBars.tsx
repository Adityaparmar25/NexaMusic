"use client";

interface EqBarsProps {
  active: boolean;
  color?: string;
  barWidth?: number;
  height?: number;
}

export function EqBars({
  active,
  color = "#7C3AED",
  barWidth = 3.5,
  height = 28,
}: EqBarsProps) {
  const anims = ["eq1", "eq2", "eq3"];
  const durations = [0.44, 0.61, 0.78];

  return (
    <div
      role="img"
      aria-label={active ? "Playing" : "Paused"}
      style={{ display: "flex", gap: 2.5, alignItems: "flex-end", height }}
    >
      {anims.map((anim, i) => (
        <div
          key={i}
          style={{
            width: barWidth,
            borderRadius: 2,
            background: color,
            minHeight: 4,
            height: active ? undefined : 4,
            animation: active
              ? `${anim} ${durations[i]}s ease-in-out infinite`
              : "none",
            transition: "height 0.2s",
          }}
        />
      ))}
    </div>
  );
}