
// ─────────────────────────────────────────────
//  components/tracks/TrackGrid.tsx
//  Discovery grid with search + genre filters
// ─────────────────────────────────────────────
"use client";

import { Music } from "lucide-react";
import { GENRES } from "@/constants/genres";
import { COLORS } from "@/constants/colors";
import { TrackCard } from "./TrackCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { usePlayerStore } from "@/store/usePlayerStore";
import type { Track } from "@/types";

interface TrackGridProps {
  tracks: Track[];
  allTracks: Track[];
  selectedGenre: string;
  onGenreChange: (g: string) => void;
  liked: string[];
  onLike: (id: string) => void;
  isLoading?: boolean;
  onClearFilters: () => void;
}

export function TrackGrid({
  tracks,
  allTracks,
  selectedGenre,
  onGenreChange,
  liked,
  onLike,
  isLoading = false,
  onClearFilters,
}: TrackGridProps) {
  const { currentTrack, isPlaying, play } = usePlayerStore();

  const handlePlay = (t: Track) => play(t, allTracks);

  return (
    <section id="discover" aria-label="Music discovery">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 22,
        }}
      >
        <span style={{ fontSize: 20, color: COLORS.primary }}>◈</span>
        <h2
          style={{ fontSize: 20, fontWeight: 700, color: COLORS.textPrimary }}
        >
          Discover Music
        </h2>
        <span style={{ marginLeft: "auto", color: COLORS.textMuted, fontSize: 13 }}>
          {tracks.length} tracks
        </span>
      </div>

      {/* Genre pills */}
      <div
        role="tablist"
        aria-label="Filter by genre"
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          paddingBottom: 4,
          marginBottom: 26,
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {GENRES.map((g) => (
          <button
            key={g}
            role="tab"
            aria-selected={selectedGenre === g}
            onClick={() => onGenreChange(g)}
            style={{
              padding: "7px 18px",
              borderRadius: 20,
              fontSize: 13,
              fontWeight: 600,
              border: "none",
              background:
                selectedGenre === g
                  ? COLORS.primary
                  : "rgba(255,255,255,0.06)",
              color: selectedGenre === g ? "#fff" : COLORS.textMuted,
              boxShadow:
                selectedGenre === g
                  ? `0 4px 16px ${COLORS.borderGlow}`
                  : "none",
              flexShrink: 0,
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(196px,1fr))",
            gap: 20,
          }}
        >
          {Array(8)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} />
            ))}
        </div>
      ) : tracks.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            textAlign: "center",
            padding: "72px 0",
            color: COLORS.textMuted,
          }}
        >
          <Music size={54} style={{ opacity: 0.2, marginBottom: 16 }} />
          <div
            style={{
              fontSize: 19,
              fontWeight: 700,
              marginBottom: 8,
              color: COLORS.textPrimary,
            }}
          >
            No tracks found
          </div>
          <div style={{ fontSize: 14, marginBottom: 20 }}>
            Try a different search term or genre
          </div>
          <button
            onClick={onClearFilters}
            style={{
              padding: "10px 24px",
              borderRadius: 24,
              fontSize: 13,
              background: `linear-gradient(135deg,${COLORS.primary},${COLORS.secondary})`,
              border: "none",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(196px,1fr))",
            gap: 20,
          }}
        >
          {tracks.map((t, i) => (
            <TrackCard
              key={t.id}
              track={t}
              isCurrent={currentTrack?.id === t.id}
              isPlaying={isPlaying}
              isLiked={liked.includes(t.id)}
              animDelay={i}
              onPlay={handlePlay}
              onLike={onLike}
            />
          ))}
        </div>
      )}
    </section>
  );
}