"use client";

import { useState, useMemo, useCallback, useEffect } from "react";

import { Navbar }       from "@/components/layout/Navbar";
import { Hero }         from "@/components/hero/Hero";
import { HorizRow }     from "@/components/tracks/HorizRow";
import { RecentRow }    from "@/components/tracks/RecentRow";
import { LikedRow }     from "@/components/tracks/LikedRow";
import { TrackGrid }    from "@/components/tracks/TrackGrid";
import { Player }       from "@/components/player/Player";
import { NowPlaying }   from "@/components/player/NowPlaying";
import { AdminLogin }   from "@/components/admin/AdminLogin";
import { AdminPanel }   from "@/components/admin/AdminPanel";
import { Notification } from "@/components/ui/Notification";
import { KeyboardHUD }  from "@/components/ui/KeyboardHUD";

import { useAudio }        from "@/hooks/useAudio";
import { useKeyboard }     from "@/hooks/useKeyboard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { usePlayerStore }  from "@/store/usePlayerStore";

import { SAMPLE_TRACKS }   from "@/constants/sampleTracks";
import type { Track, TrackFormData, Notification as TNotif } from "@/types";

const uid = () =>
  Math.random().toString(36).substring(2, 9) + Date.now().toString(36);

const normalise = (t: Track & { _id?: string; driveFileId?: string; coverArtUrl?: string }): Track => ({
  ...t,
  id:    t.id ?? String(t._id) ?? uid(),
  src:   (t.src && t.src !== "undefined")
           ? t.src
           : t.driveFileId
             ? `https://drive.google.com/uc?export=download&id=${t.driveFileId}`
             : "",
  // Map coverArtUrl (MongoDB schema) → cover (frontend type)
  cover: t.cover || t.coverArtUrl || "",
});

export default function HomePage() {
  const { seekDirect } = useAudio();
  useKeyboard();

  // ── Core state ──────────────────────────────────────────────────
  const [tracks,  setTracks]  = useState<Track[]>(SAMPLE_TRACKS);
  const [loading, setLoading] = useState(true);

  const [liked,  setLiked]  = useLocalStorage<string[]>("nexamusic_liked",  []);
  const [recent, setRecent] = useLocalStorage<Track[]> ("nexamusic_recent", []);

  const [searchQ,   setSearchQ]   = useState("");
  const [genre,     setGenre]     = useState("All");
  const [showAdmin, setShowAdmin] = useState(false);
  const [adminAuth, setAdminAuth] = useState(false);     // restored from cookie below
  const [showHUD,   setShowHUD]   = useState(false);
  const [notifs,    setNotifs]    = useState<TNotif[]>([]);

  const { currentTrack, isNowPlayingOpen, play } = usePlayerStore();

  // ── On mount: fetch tracks + restore admin session ──────────────
  useEffect(() => {
    // 1. Load tracks from MongoDB
    const loadTracks = async () => {
      try {
        const res  = await fetch("/api/tracks?limit=100");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (Array.isArray(json.data) && json.data.length > 0) {
          setTracks(json.data.map(normalise));
        }
      } catch (err) {
        console.warn("[NexaMusic] Using demo tracks:", err);
      } finally {
        setLoading(false);
      }
    };

    // 2. Check if admin cookie is still valid → restore session silently
    //    FIX 2: was missing entirely — adminAuth reset to false on every refresh
    const restoreSession = async () => {
      try {
        const res = await fetch("/api/admin/verify");
        if (res.ok) {
          setAdminAuth(true);   // cookie is valid → skip login screen
        }
        // 401 = not logged in or expired — stays false, no action needed
      } catch {
        // Network error — ignore, user will login manually
      }
    };

    loadTracks();
    restoreSession();
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────
  const notify = useCallback((message: string, type: TNotif["type"] = "success") => {
    const id = uid();
    setNotifs((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissNotif = useCallback((id: string) => {
    setNotifs((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // ── Derived lists ───────────────────────────────────────────────
  const activeQ = useMemo(() => tracks.filter((t) => t.isActive), [tracks]);

  const visible = useMemo(() => {
    let list = activeQ;
    if (genre !== "All")
      list = list.filter((t) => t.genre.includes(genre));
    if (searchQ.trim())
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(searchQ.toLowerCase()) ||
          t.artist.toLowerCase().includes(searchQ.toLowerCase()) ||
          (t.album ?? "").toLowerCase().includes(searchQ.toLowerCase())
      );
    return list;
  }, [activeQ, genre, searchQ]);

  const featured = useMemo(
    () => tracks.filter((t) => t.featured && t.isActive),
    [tracks]
  );

  const trending = useMemo(
    () => [...activeQ].sort((a, b) => b.playCount - a.playCount).slice(0, 10),
    [activeQ]
  );

  // ── Play ────────────────────────────────────────────────────────
  const handlePlay = useCallback(
    (track: Track, queue: Track[] = activeQ) => {
      play(track, queue);
      setRecent((prev) =>
        [track, ...prev.filter((t) => t.id !== track.id)].slice(0, 10)
      );
      setTracks((prev) =>
        prev.map((t) => (t.id === track.id ? { ...t, playCount: t.playCount + 1 } : t))
      );
      fetch(`/api/tracks/${track.id}/play`, { method: "POST" }).catch(() => {});
    },
    [play, activeQ, setRecent]
  );

  // ── Like ────────────────────────────────────────────────────────
  const handleLike = useCallback(
    (id: string) => {
      setLiked((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    },
    [setLiked]
  );

  // ── Share ───────────────────────────────────────────────────────
  const handleShare = useCallback(() => {
    if (!currentTrack) return;
    const text = `${currentTrack.title} by ${currentTrack.artist}`;
    if (typeof navigator !== "undefined" && navigator.share) {
      navigator.share({ title: currentTrack.title, text, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(text).then(() => notify("Copied to clipboard!"));
    }
  }, [currentTrack, notify]);

  // ── Admin: Add ──────────────────────────────────────────────────
  const handleAdminAdd = useCallback(
    async (data: TrackFormData) => {
      const src = data.driveFileId
        ? `https://drive.google.com/uc?export=download&id=${data.driveFileId}`
        : "";
      try {
        const res  = await fetch("/api/tracks", {
          method:  "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title:       data.title.trim(),
            artist:      data.artist.trim(),
            album:       data.album.trim() || undefined,
            genre:       [data.genre],
            duration:    Number(data.duration) || 180,
            driveFileId: data.driveFileId || undefined,
            coverArtUrl: data.coverArtUrl || undefined,
            featured:    data.featured,
            order:       tracks.length + 1,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Failed to create track");

        setTracks((prev) => [
          ...prev,
          normalise({
            ...json.data,
            src,
            cover:     data.coverArtUrl || `https://picsum.photos/seed/${uid()}/400/400`,
            playCount: 0,
            isActive:  true,
          }),
        ]);
        notify("Track published!");
      } catch (err: unknown) {
        notify(err instanceof Error ? err.message : "Failed to add track", "error");
      }
    },
    [tracks.length, notify]
  );

  // ── Admin: Update ───────────────────────────────────────────────
  const handleAdminUpdate = useCallback(
    async (id: string, data: TrackFormData) => {
      try {
        const res  = await fetch(`/api/tracks/${id}`, {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title:       data.title.trim(),
            artist:      data.artist.trim(),
            album:       data.album.trim() || undefined,
            genre:       [data.genre],
            duration:    Number(data.duration),
            coverArtUrl: data.coverArtUrl || undefined,
            driveFileId: data.driveFileId || undefined,
            featured:    data.featured,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error ?? "Update failed");

        setTracks((prev) =>
          prev.map((t) =>
            t.id === id
              ? {
                  ...t,
                  title:       data.title.trim(),
                  artist:      data.artist.trim(),
                  album:       data.album.trim() || undefined,
                  genre:       [data.genre],
                  duration:    Number(data.duration) || t.duration,
                  cover:       data.coverArtUrl || t.cover,
                  driveFileId: data.driveFileId || t.driveFileId,
                  featured:    data.featured,
                }
              : t
          )
        );
        notify("Track updated!");
      } catch (err: unknown) {
        notify(err instanceof Error ? err.message : "Update failed", "error");
      }
    },
    [notify]
  );

  // ── Admin: Delete ───────────────────────────────────────────────
  // FIX 1: was .catch(() => {}) — silently swallowed 401s.
  //         Local state updated even when DB rejected the request.
  //         On refresh tracks reappeared from DB.
  const handleAdminDelete = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/tracks/${id}`, { method: "DELETE" });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.error ?? `Server returned ${res.status}`);
        }
        // Only update local state after confirmed DB success
        setTracks((p) => p.map((t) => (t.id === id ? { ...t, isActive: false } : t)));
        notify("Track deactivated");
      } catch (err: unknown) {
        notify(
          err instanceof Error ? err.message : "Could not deactivate track",
          "error"
        );
      }
    },
    [notify]
  );

  // ── Admin: Restore ──────────────────────────────────────────────
  const handleAdminRestore = useCallback(
    async (id: string) => {
      try {
        const res = await fetch(`/api/tracks/${id}`, {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ isActive: true }),
        });
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json.error ?? `Server returned ${res.status}`);
        }
        setTracks((p) => p.map((t) => (t.id === id ? { ...t, isActive: true } : t)));
        notify("Track restored");
      } catch (err: unknown) {
        notify(err instanceof Error ? err.message : "Could not restore track", "error");
      }
    },
    [notify]
  );

  // ── Admin: Toggle featured ──────────────────────────────────────
  const handleToggleFeatured = useCallback(
    async (id: string) => {
      const track = tracks.find((t) => t.id === id);
      if (!track) return;
      const next = !track.featured;
      try {
        const res = await fetch(`/api/tracks/${id}`, {
          method:  "PUT",
          headers: { "Content-Type": "application/json" },
          body:    JSON.stringify({ featured: next }),
        });
        if (!res.ok) throw new Error();
        setTracks((p) => p.map((t) => (t.id === id ? { ...t, featured: next } : t)));
      } catch {
        notify("Could not update featured status", "error");
      }
    },
    [tracks, notify]
  );

  // ── Admin: Logout ───────────────────────────────────────────────
  // FIX 3: was only setting adminAuth(false) — cookie stayed alive in browser.
  //         A hard refresh would restore the session even after "logout".
  const handleLogout = useCallback(async () => {
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    setAdminAuth(false);
    setShowAdmin(false);
  }, []);

  // ── Keyboard HUD ────────────────────────────────────────────────
  const handleKeyGlobal = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.code === "Slash" && (e.target as HTMLElement).tagName !== "INPUT") {
        setShowHUD((v) => !v);
      }
    },
    []
  );

  return (
    <div onKeyDown={handleKeyGlobal} tabIndex={-1} style={{ outline: "none" }}>

      {/* Toasts */}
      <div
        aria-live="polite"
        aria-atomic="false"
        style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          display: "flex", flexDirection: "column", gap: 10,
          pointerEvents: "none",
        }}
      >
        {notifs.map((n) => (
          <div key={n.id} style={{ pointerEvents: "auto" }}>
            <Notification notification={n} onDismiss={dismissNotif} />
          </div>
        ))}
      </div>

      <KeyboardHUD visible={showHUD} />

      {/* Admin */}
      {showAdmin && !adminAuth && (
        <AdminLogin
          onSuccess={() => setAdminAuth(true)}
          onClose={() => setShowAdmin(false)}
        />
      )}
      {showAdmin && adminAuth && (
        <AdminPanel
          tracks={tracks}
          onClose={() => setShowAdmin(false)}
          onLogout={handleLogout}           
          onAdd={handleAdminAdd}
          onUpdate={handleAdminUpdate}
          onDelete={handleAdminDelete}
          onRestore={handleAdminRestore}
          onToggleFeatured={handleToggleFeatured}
        />
      )}

      {/* Now Playing */}
      {isNowPlayingOpen && (
        <NowPlaying
          likedIds={liked}
          onLike={handleLike}
          onSeekDirect={seekDirect}
          onShare={handleShare}
        />
      )}

      <Navbar
        searchQuery={searchQ}
        onSearchChange={setSearchQ}
        onAdminClick={() => setShowAdmin(true)}
        onHudToggle={() => setShowHUD((v) => !v)}
      />

      <Hero featuredTracks={featured} />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 160px" }}>
        <HorizRow title="Trending Now"    emoji="🔥" tracks={trending} />
        <HorizRow title="Featured Tracks" emoji="⭐" tracks={featured} />
        <RecentRow tracks={recent} />
        <LikedRow  allTracks={tracks} likedIds={liked} />
        <TrackGrid
          tracks={visible}
          allTracks={activeQ}
          selectedGenre={genre}
          onGenreChange={setGenre}
          liked={liked}
          onLike={handleLike}
          isLoading={loading}
          onClearFilters={() => { setSearchQ(""); setGenre("All"); }}
        />
      </main>

      <Player
        likedIds={liked}
        onLike={handleLike}
        onSeekDirect={seekDirect}
      />
    </div>
  );
}