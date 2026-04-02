
// ─────────────────────────────────────────────
//  components/tracks/RecentRow.tsx
//  LocalStorage-backed recently played row
// ─────────────────────────────────────────────
"use client";

import { COLORS } from "@/constants/colors";
import { EqBars } from "@/components/ui/EqBars";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Track } from "@/types";

interface RecentRowProps {
  tracks: Track[];
}

export function RecentRow({ tracks }: RecentRowProps) {
  const { currentTrack, isPlaying, play } = usePlayerStore();

  if (!tracks.length) return null;

  return (
    <section aria-label="Recently played" style={{ marginBottom: 52 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 18,
        }}
      >
        <span style={{ fontSize: 20 }}>🕒</span>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.textPrimary }}>
          Recently Played
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          gap: 14,
          overflowX: "auto",
          paddingBottom: 6,
          scrollbarWidth: "none",
        }}
      >
        {tracks.slice(0, 8).map((t) => {
          const isCur = currentTrack?.id === t.id;
          return (
            <button
              key={t.id}
              onClick={() => play(t, tracks)}
              aria-label={`Replay ${t.title}`}
              style={{
                minWidth: 80,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 8,
                padding: "10px 8px",
                borderRadius: 12,
                background: isCur ? `${COLORS.primary}22` : COLORS.bgSurface,
                border: `1px solid ${isCur ? COLORS.primary : "rgba(255,255,255,0.06)"}`,
                flexShrink: 0,
                cursor: "pointer",
                transition: "all 0.2s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  src={t.cover}
                  alt={t.title}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 9,
                    objectFit: "cover",
                    display: "block",
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.background = COLORS.bgSurface;
                  }}
                />
                {isCur && isPlaying && (
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: 9,
                      background: "rgba(0,0,0,.45)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <EqBars active color="#fff" barWidth={2} height={18} />
                  </div>
                )}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: COLORS.textMuted,
                  textAlign: "center",
                  width: 72,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {t.title}
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}
