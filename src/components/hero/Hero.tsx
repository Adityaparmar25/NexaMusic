// ─────────────────────────────────────────────
//  components/hero/Hero.tsx
//  Full-screen animated hero section
// ─────────────────────────────────────────────
"use client";

import { useCallback } from "react";
import { Music, ChevronDown } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { Waveform } from "@/components/ui/Waveform";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Track } from "@/types";

interface HeroProps {
  featuredTracks: Track[];
}

const NOTES = ["♪", "♫", "♩", "♬", "♭", "♮"];
const NOTE_COLORS = [
  COLORS.primary, COLORS.secondary, COLORS.accent,
  COLORS.primary, COLORS.secondary, COLORS.accent,
];
const FLOAT_ANIMS = ["heroFloat1", "heroFloat2", "heroFloat3"];

export function Hero({ featuredTracks }: HeroProps) {
  const { currentTrack, isPlaying, play, queue } = usePlayerStore();

  const hero = featuredTracks[0] ?? null;
  const isHeroPlaying = currentTrack?.id === hero?.id && isPlaying;

  const handlePlay = useCallback(() => {
    if (!hero) return;
    play(hero, featuredTracks.length > 0 ? featuredTracks : queue);
  }, [hero, featuredTracks, play, queue]);

  return (
    <section
      aria-label="Hero"
      style={{
        position: "relative",
        minHeight: "88vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
        padding: "48px 24px 120px",
      }}
    >
      {/* Radial glow background */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at 22% 30%,rgba(124,58,237,.3) 0%,transparent 55%)," +
            "radial-gradient(ellipse at 78% 70%,rgba(6,182,212,.18) 0%,transparent 55%)," +
            COLORS.bgDeep,
        }}
      />
      {/* Dot grid */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "radial-gradient(circle,rgba(124,58,237,.1) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
          pointerEvents: "none",
        }}
      />

      {/* Floating music notes */}
      {NOTES.map((note, i) => (
        <div
          aria-hidden
          key={i}
          style={{
            position: "absolute",
            left: `${7 + i * 15}%`,
            top: `${10 + i * 12}%`,
            fontSize: 20 + i * 5,
            color: NOTE_COLORS[i],
            opacity: 0.15 + i * 0.025,
            animation: `${FLOAT_ANIMS[i % 3]} ${3.2 + i * 0.9}s ease-in-out ${i * 0.5}s infinite`,
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {note}
        </div>
      ))}

      {/* Main content */}
      <div
        style={{
          position: "relative",
          textAlign: "center",
          maxWidth: 860,
          zIndex: 2,
          width: "100%",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            background: "rgba(124,58,237,.13)",
            border: "1px solid rgba(124,58,237,.28)",
            borderRadius: 20,
            padding: "6px 18px",
            marginBottom: 26,
            fontSize: 12,
            color: COLORS.secondary,
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          <Music size={13} />
          NEXT-GEN MUSIC STREAMING
        </div>

        {/* Headline */}
        <h1
          style={{
            fontSize: "clamp(2rem,6vw,4.2rem)",
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: 18,
            animation: "textIn 0.75s ease both",
            background: `linear-gradient(135deg,${COLORS.textPrimary} 0%,${COLORS.secondary} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          Stream the Music.
          <br />
          Feel the Vibe.
        </h1>

        <p
          style={{
            fontSize: "clamp(0.9rem,2.2vw,1.1rem)",
            color: COLORS.textMuted,
            marginBottom: 36,
            animation: "textIn 0.9s 0.18s ease both",
            lineHeight: 1.7,
          }}
        >
          Cinematic, immersive music discovery — zero sign-up required.
        </p>

        {/* CTAs */}
        <div
          style={{
            display: "flex",
            gap: 14,
            justifyContent: "center",
            flexWrap: "wrap",
            animation: "fadeUp 0.8s 0.3s ease both",
            marginBottom: hero ? 52 : 0,
          }}
        >
          <button
            onClick={handlePlay}
            disabled={!hero}
            aria-label={hero ? `Play ${hero.title}` : "No featured track"}
            style={{
              padding: "14px 34px",
              borderRadius: 50,
              fontSize: 15,
              letterSpacing: 0.5,
              background: `linear-gradient(135deg,${COLORS.primary},${COLORS.secondary})`,
              border: "none",
              color: "#fff",
              fontWeight: 700,
              cursor: hero ? "pointer" : "not-allowed",
              opacity: hero ? 1 : 0.5,
              transition: "all 0.22s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => {
              if (hero) e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            ▶&nbsp;&nbsp;{hero ? "Play Featured" : "No Tracks Yet"}
          </button>

          <a
            href="#discover"
            style={{
              padding: "14px 30px",
              borderRadius: 50,
              fontSize: 15,
              background: "transparent",
              border: "1.5px solid rgba(255,255,255,0.16)",
              color: COLORS.textPrimary,
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              letterSpacing: 0.4,
              transition: "all 0.22s",
              fontWeight: 600,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = COLORS.primary;
              el.style.color = COLORS.primary;
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "rgba(255,255,255,0.16)";
              el.style.color = COLORS.textPrimary;
            }}
          >
            Browse All <ChevronDown size={15} />
          </a>
        </div>

        {/* Featured track showcase */}
        {hero && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 28,
              flexWrap: "wrap",
              animation: "fadeUp 0.85s 0.52s ease both",
            }}
          >
            {/* Spinning album art with pulse rings */}
            <div style={{ position: "relative", flexShrink: 0 }}>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: -10,
                  borderRadius: "50%",
                  border: `2px solid ${COLORS.primary}`,
                  animation: "pRing 2.3s ease-out infinite",
                }}
              />
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  inset: -10,
                  borderRadius: "50%",
                  border: `2px solid ${COLORS.secondary}`,
                  animation: "pRing 2.3s 0.8s ease-out infinite",
                }}
              />
              <img
                src={hero.cover}
                alt={`${hero.title} album art`}
                width={90}
                height={90}
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: `3px solid ${COLORS.primary}`,
                  display: "block",
                  animation: isHeroPlaying ? "spin 22s linear infinite" : undefined,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.background = COLORS.bgSurface;
                }}
              />
            </div>

            {/* Track info */}
            <div style={{ textAlign: "left" }}>
              <div
                style={{
                  fontSize: 11,
                  color: COLORS.secondary,
                  fontWeight: 700,
                  letterSpacing: 1.2,
                  marginBottom: 5,
                }}
              >
                NOW FEATURED
              </div>
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: COLORS.textPrimary,
                }}
              >
                {hero.title}
              </div>
              <div
                style={{ fontSize: 13, color: COLORS.textMuted, marginBottom: 10 }}
              >
                {hero.artist}
                {hero.album ? ` · ${hero.album}` : ""}
              </div>
              <Waveform active={isHeroPlaying} color={COLORS.primary} bars={18} height={36} />
            </div>
          </div>
        )}
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 30,
          left: "50%",
          transform: "translateX(-50%)",
          animation: "heroBounce 1.7s ease-in-out infinite",
          textAlign: "center",
          fontSize: 11,
          color: COLORS.textMuted,
          pointerEvents: "none",
          letterSpacing: 1,
        }}
      >
        <div style={{ fontSize: 20 }}>↓</div>
        <div>EXPLORE</div>
      </div>
    </section>
  );
}