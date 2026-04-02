
// ─────────────────────────────────────────────
//  components/player/PlayerProgress.tsx
//  Progress scrubber + time labels sub-component
// ─────────────────────────────────────────────
"use client";

import { useRef, useEffect } from "react";
import { COLORS } from "@/constants/colors";

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

interface PlayerProgressProps {
  currentTime: number;
  duration: number;
  onSeek: (s: number) => void;
  compact?: boolean;      // true = used in bottom bar, false = now playing
}

export function PlayerProgress({
  currentTime,
  duration,
  onSeek,
  compact = true,
}: PlayerProgressProps) {
  const rangeRef = useRef<HTMLInputElement>(null);
  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Keep track fill synced without re-rendering
  useEffect(() => {
    if (rangeRef.current) {
      rangeRef.current.style.background = `linear-gradient(to right,${COLORS.primary} ${pct}%,rgba(255,255,255,0.14) ${pct}%)`;
    }
  }, [pct]);

  return (
    <div>
      <input
        ref={rangeRef}
        type="range"
        min={0}
        max={duration || 100}
        value={currentTime}
        step={1}
        aria-label="Seek track position"
        aria-valuemin={0}
        aria-valuemax={duration}
        aria-valuenow={currentTime}
        aria-valuetext={`${fmt(currentTime)} of ${fmt(duration)}`}
        onChange={(e) => onSeek(Number(e.target.value))}
        style={{
          width: "100%",
          display: "block",
          marginBottom: compact ? 10 : 7,
          cursor: "pointer",
          WebkitAppearance: "none",
          appearance: "none",
          background: `linear-gradient(to right,${COLORS.primary} ${pct}%,rgba(255,255,255,0.14) ${pct}%)`,
          height: compact ? 4 : 5,
          borderRadius: 2,
          outline: "none",
          border: "none",
        }}
      />
      {!compact && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 12,
            color: COLORS.textMuted,
          }}
        >
          <span>{fmt(currentTime)}</span>
          <span>{fmt(duration)}</span>
        </div>
      )}
    </div>
  );
}
