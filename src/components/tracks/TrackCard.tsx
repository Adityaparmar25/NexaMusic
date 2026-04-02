// ─────────────────────────────────────────────
//  components/tracks/TrackCard.tsx
// ─────────────────────────────────────────────
"use client";

import { useCallback } from "react";
import { Play, Heart } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { GenreBadge } from "@/components/ui/GenreBadge";
import { EqBars } from "@/components/ui/EqBars";
import type { Track } from "@/types";

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

interface TrackCardProps {
  track: Track;
  isCurrent: boolean;
  isPlaying: boolean;
  isLiked: boolean;
  animDelay?: number;
  onPlay: (t: Track) => void;
  onLike: (id: string) => void;
}

export function TrackCard({
  track,
  isCurrent,
  isPlaying,
  isLiked,
  animDelay = 0,
  onPlay,
  onLike,
}: TrackCardProps) {
  const handlePlay = useCallback(() => onPlay(track), [onPlay, track]);
  const handleLike = useCallback(
    (e: React.MouseEvent) => { e.stopPropagation(); onLike(track.id); },
    [onLike, track.id]
  );

  return (
    <article
      onClick={handlePlay}
      aria-label={`Play ${track.title} by ${track.artist}`}
      style={{
        background: COLORS.bgSurface,
        borderRadius: 16,
        overflow: "hidden",
        border: `1px solid ${isCurrent ? COLORS.primary : "rgba(255,255,255,0.06)"}`,
        boxShadow: isCurrent ? `0 0 28px ${COLORS.borderGlow}` : "none",
        cursor: "pointer",
        transition: "transform 0.28s ease, box-shadow 0.28s ease",
        animation: `fadeUp 0.42s ${Math.min(animDelay * 0.05, 0.55)}s ease both`,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-7px)";
        el.style.boxShadow = "0 22px 55px rgba(124,58,237,.4)";
        const ov = el.querySelector<HTMLDivElement>(".ply-ov");
        if (ov) ov.style.opacity = "1";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0)";
        el.style.boxShadow = isCurrent ? `0 0 28px ${COLORS.borderGlow}` : "none";
        const ov = el.querySelector<HTMLDivElement>(".ply-ov");
        if (ov) ov.style.opacity = "0";
      }}
    >
      {/* Cover */}
      <div style={{ position: "relative", paddingBottom: "100%", background: "#080515" }}>
        <img
          src={track.cover}
          alt={`${track.title} cover`}
          loading="lazy"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.style.background = COLORS.bgSurface;
            img.style.display = "none";
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top,rgba(15,10,30,.95) 0%,transparent 55%)",
          }}
        />
        {/* Hover overlay */}
        <div
          className="ply-ov"
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,.5)",
            opacity: 0,
            transition: "opacity 0.22s",
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background: COLORS.primary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 0 28px ${COLORS.primary}`,
            }}
          >
            {isCurrent && isPlaying ? (
              <EqBars active color="#fff" />
            ) : (
              <Play size={22} fill="#fff" color="#fff" />
            )}
          </div>
        </div>

        {/* Like button */}
        <button
          onClick={handleLike}
          aria-label={isLiked ? "Unlike track" : "Like track"}
          style={{
            position: "absolute",
            top: 10,
            right: 10,
            background: "rgba(0,0,0,.6)",
            border: "none",
            borderRadius: "50%",
            width: 32,
            height: 32,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            transition: "transform 0.18s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.15)")}
          onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          <Heart
            size={13}
            fill={isLiked ? COLORS.accent : "transparent"}
            color={isLiked ? COLORS.accent : COLORS.textMuted}
          />
        </button>

        {/* Featured badge */}
        {track.featured && (
          <div
            style={{
              position: "absolute",
              top: 10,
              left: 10,
              background: COLORS.primary,
              padding: "2px 10px",
              borderRadius: 12,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: 0.6,
              color: "#fff",
            }}
          >
            ★ FEATURED
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "12px 14px 14px" }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 2,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            color: COLORS.textPrimary,
          }}
        >
          {track.title}
        </div>
        <div style={{ color: COLORS.textMuted, fontSize: 12, marginBottom: 9 }}>
          {track.artist}
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 6,
          }}
        >
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {track.genre.slice(0, 2).map((g) => (
              <GenreBadge key={g} genre={g} small />
            ))}
          </div>
          <span style={{ color: COLORS.textMuted, fontSize: 11, flexShrink: 0 }}>
            {fmt(track.duration)}
          </span>
        </div>
        <div
          style={{
            marginTop: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: COLORS.textMuted, fontSize: 11 }}>
            {track.playCount.toLocaleString()} plays
          </span>
          {isCurrent && isPlaying && (
            <EqBars active color={COLORS.secondary} barWidth={2.5} height={22} />
          )}
        </div>
      </div>
    </article>
  );
}