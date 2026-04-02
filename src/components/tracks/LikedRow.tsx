
// ─────────────────────────────────────────────
//  components/tracks/LikedRow.tsx
// ─────────────────────────────────────────────
"use client";

import { Play, Heart } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Track } from "@/types";

interface LikedRowProps {
  allTracks: Track[];
  likedIds: string[];
}

export function LikedRow({ allTracks, likedIds }: LikedRowProps) {
  const { currentTrack, isPlaying, play } = usePlayerStore();
  const liked = allTracks.filter((t) => likedIds.includes(t.id));

  if (!liked.length) return null;

  return (
    <section aria-label="Liked tracks" style={{ marginBottom: 52 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
        <Heart size={18} fill={COLORS.accent} color={COLORS.accent} />
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.textPrimary }}>
          Liked Tracks
        </h2>
        <span style={{ color: COLORS.textMuted, fontSize: 13 }}>{liked.length}</span>
      </div>

      <div
        style={{
          display: "flex",
          gap: 16,
          overflowX: "auto",
          paddingBottom: 6,
          scrollbarWidth: "none",
        }}
      >
        {liked.map((t) => {
          const isCur = currentTrack?.id === t.id;
          return (
            <div key={t.id} style={{ minWidth: 148, maxWidth: 148, flexShrink: 0 }}>
              <div
                onClick={() => play(t, liked)}
                role="button"
                tabIndex={0}
                aria-label={`Play ${t.title}`}
                onKeyDown={(e) => e.key === "Enter" && play(t, liked)}
                style={{
                  background: COLORS.bgSurface,
                  borderRadius: 12,
                  overflow: "hidden",
                  border: `1px solid ${isCur ? COLORS.accent : "rgba(255,255,255,0.06)"}`,
                  cursor: "pointer",
                  transition: "transform 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  const ov = e.currentTarget.querySelector<HTMLDivElement>(".ply-ov");
                  if (ov) ov.style.opacity = "1";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  const ov = e.currentTarget.querySelector<HTMLDivElement>(".ply-ov");
                  if (ov) ov.style.opacity = "0";
                }}
              >
                <div style={{ position: "relative", paddingBottom: "100%" }}>
                  <img
                    src={t.cover}
                    alt={t.title}
                    style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                    onError={(e) => { (e.target as HTMLImageElement).style.background = COLORS.bgSurface; }}
                  />
                  <div aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top,rgba(15,10,30,.9) 0%,transparent 55%)" }} />
                  <div className="ply-ov" aria-hidden style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,.45)", opacity: 0, transition: "opacity 0.2s" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: COLORS.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Play size={14} fill="#fff" color="#fff" />
                    </div>
                  </div>
                  <div style={{ position: "absolute", top: 8, right: 8 }}>
                    <Heart size={12} fill={COLORS.accent} color={COLORS.accent} />
                  </div>
                </div>
                <div style={{ padding: "8px 10px 10px" }}>
                  <div style={{ fontWeight: 700, fontSize: 11, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: COLORS.textPrimary, marginBottom: 2 }}>{t.title}</div>
                  <div style={{ color: COLORS.textMuted, fontSize: 10 }}>{t.artist}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}