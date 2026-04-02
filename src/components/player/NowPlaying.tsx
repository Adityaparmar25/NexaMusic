
// ─────────────────────────────────────────────
//  components/player/NowPlaying.tsx
//  Full-screen now playing overlay
// ─────────────────────────────────────────────
"use client";

import {
  Play, Pause, SkipBack, SkipForward,
  Volume2, VolumeX, Shuffle, Repeat, Repeat1,
  Heart, Share2, ArrowLeft,
} from "lucide-react";
import { COLORS } from "@/constants/colors";
import { Waveform } from "@/components/ui/Waveform";
import { GenreBadge } from "@/components/ui/GenreBadge";
import { PlayerProgress } from "./PlayerProgress";
import { usePlayerStore } from "@/store/usePlayerStore";

interface NowPlayingProps {
  likedIds: string[];
  onLike: (id: string) => void;
  onSeekDirect: (s: number) => void;
  onShare: () => void;
}

export function NowPlaying({
  likedIds,
  onLike,
  onSeekDirect,
  onShare,
}: NowPlayingProps) {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    isShuffle,
    repeatMode,
    isNowPlayingOpen,
    togglePlay,
    next,
    prev,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeat,
    closeNowPlaying,
  } = usePlayerStore();

  if (!isNowPlayingOpen || !currentTrack) return null;

  const isLiked = likedIds.includes(currentTrack.id);
  const RepeatIcon = repeatMode === "one" ? Repeat1 : Repeat;
  const repeatActive = repeatMode !== "off";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Now Playing"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflowY: "auto",
        animation: "fadeIn 0.38s ease",
      }}
    >
      {/* Blurred background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${currentTrack.cover})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(60px)",
          opacity: 0.22,
          transform: "scale(1.1)",
        }}
      />
      <div
        aria-hidden
        style={{ position: "absolute", inset: 0, background: "rgba(8,5,20,0.82)" }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 470,
          padding: "22px 24px 52px",
          textAlign: "center",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <button
            onClick={closeNowPlaying}
            aria-label="Close now playing"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "none",
              borderRadius: 10,
              padding: 10,
              cursor: "pointer",
              color: COLORS.textMuted,
              display: "flex",
              alignItems: "center",
              transition: "all 0.18s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.textMuted,
                fontWeight: 700,
                letterSpacing: 1.2,
              }}
            >
              NOW PLAYING
            </div>
            {currentTrack.album && (
              <div style={{ fontSize: 11, color: COLORS.textMuted, opacity: 0.6, marginTop: 2 }}>
                {currentTrack.album}
              </div>
            )}
          </div>

          <button
            onClick={onShare}
            aria-label="Share track"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "none",
              borderRadius: 10,
              padding: 10,
              cursor: "pointer",
              color: COLORS.textMuted,
              display: "flex",
              alignItems: "center",
              transition: "all 0.18s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          >
            <Share2 size={18} />
          </button>
        </div>

        {/* Spinning album art */}
        <div style={{ position: "relative", display: "inline-block", marginBottom: 30 }}>
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: -20,
              borderRadius: "50%",
              background: `conic-gradient(${COLORS.primary},${COLORS.secondary},${COLORS.accent},${COLORS.primary})`,
              animation: "conicSpin 8s linear infinite",
              opacity: 0.4,
            }}
          />
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: -10,
              borderRadius: "50%",
              background: COLORS.bgDeep,
            }}
          />
          <img
            src={currentTrack.cover}
            alt={`${currentTrack.title} album art`}
            style={{
              width: 220,
              height: 220,
              borderRadius: "50%",
              objectFit: "cover",
              border: `4px solid ${COLORS.primary}`,
              position: "relative",
              display: "block",
              animation: isPlaying ? "spin 26s linear infinite" : undefined,
              boxShadow: `0 0 52px ${COLORS.borderGlow}`,
            }}
            onError={(e) => {
              (e.target as HTMLImageElement).style.background = COLORS.bgSurface;
            }}
          />
        </div>

        {/* Info */}
        <div style={{ marginBottom: 18 }}>
          <div
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: COLORS.textPrimary,
              marginBottom: 5,
            }}
          >
            {currentTrack.title}
          </div>
          <div style={{ fontSize: 14, color: COLORS.textMuted, marginBottom: 10 }}>
            {currentTrack.artist}
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 6,
              flexWrap: "wrap",
            }}
          >
            {currentTrack.genre.map((g) => (
              <GenreBadge key={g} genre={g} />
            ))}
          </div>
        </div>

        {/* Waveform */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <Waveform active={isPlaying} color={COLORS.primary} bars={28} height={44} />
        </div>

        {/* Progress */}
        <div style={{ marginBottom: 24 }}>
          <PlayerProgress
            currentTime={currentTime}
            duration={currentTrack.duration}
            onSeek={onSeekDirect}
            compact={false}
          />
        </div>

        {/* Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 24,
            marginBottom: 28,
          }}
        >
          <button onClick={toggleShuffle} aria-label="Shuffle" aria-pressed={isShuffle}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: isShuffle ? COLORS.secondary : COLORS.textMuted, display: "flex", alignItems: "center", transition: "all 0.18s" }}>
            <Shuffle size={20} />
          </button>
          <button onClick={prev} aria-label="Previous"
            style={{ background: "transparent", border: "none", cursor: "pointer", color: COLORS.textPrimary, display: "flex", alignItems: "center", transition: "opacity 0.18s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            <SkipBack size={28} />
          </button>
          <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}
            style={{ width: 64, height: 64, borderRadius: "50%", background: `linear-gradient(135deg,${COLORS.primary},${COLORS.secondary})`, border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: `0 8px 38px ${COLORS.borderGlow}`, transition: "transform 0.18s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
            {isPlaying ? <Pause size={26} fill="#fff" color="#fff" /> : <Play size={26} fill="#fff" color="#fff" />}
          </button>
          <button onClick={next} aria-label="Next"
            style={{ background: "transparent", border: "none", cursor: "pointer", color: COLORS.textPrimary, display: "flex", alignItems: "center", transition: "opacity 0.18s" }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}>
            <SkipForward size={28} />
          </button>
          <button onClick={cycleRepeat} aria-label={`Repeat: ${repeatMode}`} aria-pressed={repeatActive}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: repeatActive ? COLORS.accent : COLORS.textMuted, display: "flex", alignItems: "center", transition: "all 0.18s" }}>
            <RepeatIcon size={20} />
          </button>
        </div>

        {/* Volume + like */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, justifyContent: "center" }}>
          <button onClick={() => onLike(currentTrack.id)} aria-label={isLiked ? "Unlike" : "Like"}
            style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", transition: "transform 0.18s" }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.2)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}>
            <Heart size={20} fill={isLiked ? COLORS.accent : "transparent"} color={isLiked ? COLORS.accent : COLORS.textMuted} />
          </button>
          <button onClick={toggleMute} aria-label={isMuted ? "Unmute" : "Mute"}
            style={{ background: "transparent", border: "none", cursor: "pointer", color: COLORS.textMuted, display: "flex", alignItems: "center" }}>
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input type="range" min={0} max={1} step={0.02} value={isMuted ? 0 : volume}
            aria-label="Volume" onChange={(e) => setVolume(Number(e.target.value))}
            style={{ width: 120, cursor: "pointer", WebkitAppearance: "none", appearance: "none", height: 3, borderRadius: 2, background: `linear-gradient(to right,${COLORS.secondary} ${isMuted ? 0 : volume * 100}%,rgba(255,255,255,0.18) ${isMuted ? 0 : volume * 100}%)`, outline: "none", border: "none" }} />
        </div>

        {/* Play count */}
        <div style={{ marginTop: 24, color: COLORS.textMuted, fontSize: 12 }}>
          {currentTrack.playCount.toLocaleString()} plays
        </div>
      </div>
    </div>
  );
}