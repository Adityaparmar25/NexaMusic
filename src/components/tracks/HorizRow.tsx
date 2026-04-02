
// ─────────────────────────────────────────────
//  components/tracks/HorizRow.tsx
//  Horizontal scrollable card row (trending / featured)
// ─────────────────────────────────────────────
"use client";

import { Play } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { EqBars } from "@/components/ui/EqBars";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Track } from "@/types";

interface HorizRowProps {
  title: string;
  emoji: string;
  tracks: Track[];
}

export function HorizRow({ title, emoji, tracks }: HorizRowProps) {
  const { currentTrack, isPlaying, play } = usePlayerStore();

  if (!tracks.length) return null;

  return (
    <section aria-label={title} style={{ marginBottom: 52 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 18,
        }}
      >
        <span style={{ fontSize: 20 }}>{emoji}</span>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.textPrimary }}>
          {title}
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          paddingBottom: 8,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {tracks.map((t) => {
          const isCur = currentTrack?.id === t.id;
          return (
            <div key={t.id} style={{ minWidth: 174, maxWidth: 174, flexShrink: 0 }}>
              <div
                onClick={() => play(t, tracks)}
                aria-label={`Play ${t.title}`}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && play(t, tracks)}
                style={{
                  background: COLORS.bgSurface,
                  borderRadius: 14,
                  overflow: "hidden",
                  border: `1px solid ${isCur ? COLORS.primary : "rgba(255,255,255,0.06)"}`,
                  boxShadow: isCur ? `0 0 18px ${COLORS.borderGlow}` : "none",
                  cursor: "pointer",
                  transition: "transform 0.22s ease, box-shadow 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(-5px)";
                  el.style.boxShadow = "0 14px 38px rgba(124,58,237,.36)";
                  const ov = el.querySelector<HTMLDivElement>(".ply-ov");
                  if (ov) ov.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = isCur ? `0 0 18px ${COLORS.borderGlow}` : "none";
                  const ov = el.querySelector<HTMLDivElement>(".ply-ov");
                  if (ov) ov.style.opacity = "0";
                }}
              >
                <div style={{ position: "relative", paddingBottom: "100%" }}>
                  <img
                    src={t.cover}
                    alt={`${t.title} cover`}
                    loading="lazy"
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.background = COLORS.bgSurface;
                    }}
                  />
                  <div
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to top,rgba(15,10,30,.9) 0%,transparent 55%)",
                    }}
                  />
                  <div
                    className="ply-ov"
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(0,0,0,.45)",
                      opacity: 0,
                      transition: "opacity 0.2s",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: COLORS.primary,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {isCur && isPlaying ? (
                        <EqBars active color="#fff" barWidth={2.5} height={22} />
                      ) : (
                        <Play size={16} fill="#fff" color="#fff" />
                      )}
                    </div>
                  </div>
                  {isCur && isPlaying && (
                    <div style={{ position: "absolute", bottom: 8, right: 8 }}>
                      <EqBars active color={COLORS.secondary} barWidth={2.5} height={22} />
                    </div>
                  )}
                </div>
                <div style={{ padding: "10px 12px 12px" }}>
                  <div
                    style={{
                      fontWeight: 700,
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      color: COLORS.textPrimary,
                      marginBottom: 2,
                    }}
                  >
                    {t.title}
                  </div>
                  <div style={{ color: COLORS.textMuted, fontSize: 11 }}>
                    {t.artist}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}