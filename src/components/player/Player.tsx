
// ─────────────────────────────────────────────
//  components/player/Player.tsx
//  Sticky bottom player bar
// ─────────────────────────────────────────────
"use client";

import { useRef, useEffect } from "react";
import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Shuffle, Repeat, Repeat1, Heart, Maximize2,
} from "lucide-react";
import { COLORS } from "@/constants/colors";
import { EqBars } from "@/components/ui/EqBars";
import { PlayerProgress } from "./PlayerProgress";
import { usePlayerStore } from "@/store/usePlayerStore";

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

interface PlayerProps {
  likedIds: string[];
  onLike: (id: string) => void;
  onSeekDirect: (s: number) => void;
}

export function Player({ likedIds, onLike, onSeekDirect }: PlayerProps) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    togglePlay,
    next,
    prev,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    openNowPlaying,
  } = usePlayerStore();

  const volRef = useRef<HTMLInputElement>(null);

  const isLiked = currentTrack ? likedIds.includes(currentTrack.id) : false;
  const pct = currentTrack ? (currentTime / (currentTrack.duration || 1)) * 100 : 0;

  // Sync volume slider fill
  useEffect(() => {
    if (volRef.current) {
      const v = isMuted ? 0 : volume * 100;
      volRef.current.style.background = `linear-gradient(to right,${COLORS.secondary} ${v}%,rgba(255,255,255,0.18) ${v}%)`;
    }
  }, [volume, isMuted]);

  if (!currentTrack) return null;

  const RepeatIcon =
    repeatMode === "one" ? Repeat1 : Repeat;
  const repeatActive = repeatMode !== "off";

  return (
    <aside
      aria-label="Music player"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "rgba(15,10,30,0.96)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        animation: "slideUp 0.38s ease",
        paddingTop: 2,
      }}
    >
      {/* Progress sits above everything else */}
      <div style={{ padding: "0 20px" }}>
        <PlayerProgress
          currentTime={currentTime}
          duration={currentTrack.duration}
          onSeek={onSeekDirect}
          compact
        />
      </div>

      <div
        style={{
          padding: "0 20px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        {/* ── Left: track info ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
            flex: "0 1 22%",
          }}
        >
          <div style={{ position: "relative", flexShrink: 0 }}>
            <img
              src={currentTrack.cover}
              alt={`${currentTrack.title} album art`}
              style={{
                width: 44,
                height: 44,
                borderRadius: 9,
                objectFit: "cover",
                display: "block",
                animation: isPlaying ? "spin 22s linear infinite" : undefined,
              }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.background = COLORS.bgSurface;
              }}
            />
            {isPlaying && (
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: 9,
                  boxShadow: `0 0 14px ${COLORS.borderGlow}`,
                  pointerEvents: "none",
                }}
              />
            )}
          </div>

          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                color: COLORS.textPrimary,
              }}
            >
              {currentTrack.title}
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.textMuted,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {currentTrack.artist}
            </div>
          </div>

          <button
            onClick={() => onLike(currentTrack.id)}
            aria-label={isLiked ? "Unlike" : "Like"}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              padding: 4,
              transition: "transform 0.18s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.18)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Heart
              size={14}
              fill={isLiked ? COLORS.accent : "transparent"}
              color={isLiked ? COLORS.accent : COLORS.textMuted}
            />
          </button>
        </div>

        {/* ── Center: controls ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            minWidth: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={toggleShuffle}
              aria-label="Shuffle"
              aria-pressed={isShuffle}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: isShuffle ? COLORS.secondary : COLORS.textMuted,
                display: "flex", alignItems: "center",
                transition: "all 0.18s",
              }}
            >
              <Shuffle size={16} />
            </button>

            <button
              onClick={prev}
              aria-label="Previous track"
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: COLORS.textPrimary, display: "flex", alignItems: "center",
                transition: "opacity 0.18s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <SkipBack size={22} />
            </button>

            <button
              onClick={togglePlay}
              aria-label={isPlaying ? "Pause" : "Play"}
              style={{
                width: 46,
                height: 46,
                borderRadius: "50%",
                background: `linear-gradient(135deg,${COLORS.primary},${COLORS.secondary})`,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 4px 22px ${COLORS.borderGlow}`,
                transition: "transform 0.18s",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              {isPlaying ? (
                <Pause size={18} fill="#fff" color="#fff" />
              ) : (
                <Play size={18} fill="#fff" color="#fff" />
              )}
            </button>

            <button
              onClick={next}
              aria-label="Next track"
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: COLORS.textPrimary, display: "flex", alignItems: "center",
                transition: "opacity 0.18s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <SkipForward size={22} />
            </button>

            <button
              onClick={cycleRepeat}
              aria-label={`Repeat: ${repeatMode}`}
              aria-pressed={repeatActive}
              style={{
                background: "transparent", border: "none", cursor: "pointer",
                color: repeatActive ? COLORS.accent : COLORS.textMuted,
                display: "flex", alignItems: "center",
                transition: "all 0.18s",
              }}
            >
              <RepeatIcon size={16} />
            </button>
          </div>

          {/* time display */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 11,
              color: COLORS.textMuted,
            }}
          >
            <span>{fmt(currentTime)}</span>
            <span style={{ opacity: 0.4 }}>·</span>
            <span>{fmt(currentTrack.duration)}</span>
          </div>
        </div>

        {/* ── Right: volume + expand ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flex: "0 1 22%",
            justifyContent: "flex-end",
          }}
        >
          {isPlaying && (
            <EqBars active color={COLORS.secondary} barWidth={3} height={22} />
          )}

          <button
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: COLORS.textMuted, display: "flex", alignItems: "center",
            }}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>

          <input
            ref={volRef}
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={isMuted ? 0 : volume}
            aria-label="Volume"
            onChange={(e) => setVolume(Number(e.target.value))}
            style={{
              width: 80,
              cursor: "pointer",
              WebkitAppearance: "none",
              appearance: "none",
              height: 3,
              borderRadius: 2,
              outline: "none",
              border: "none",
            }}
          />

          <button
            onClick={openNowPlaying}
            aria-label="Open now playing"
            style={{
              background: "transparent", border: "none", cursor: "pointer",
              color: COLORS.textMuted, display: "flex", alignItems: "center",
              transition: "color 0.18s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.primary)}
            onMouseLeave={(e) => (e.currentTarget.style.color = COLORS.textMuted)}
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
}