// ─────────────────────────────────────────────
//  hooks/useAudio.ts
//  Core audio engine — bridges Zustand store ↔ HTML5 Audio element
//
//  ROOT CAUSE OF SILENT AUDIO (previous build):
//  ┌─────────────────────────────────────────────────────────────────┐
//  │  <audio crossOrigin="anonymous" />                              │
//  │                                                                 │
//  │  crossOrigin="anonymous" tells the browser to send a CORS      │
//  │  preflight. SoundHelix, Google Drive direct-download URLs, and  │
//  │  most external MP3 hosts do NOT return CORS headers.            │
//  │  Browser policy: if the server doesn't allow it → block.       │
//  │  Result: audio element loads 0 bytes → plays nothing.          │
//  │                                                                 │
//  │  FIX: Remove crossOrigin entirely for non-CORS sources.        │
//  │  Only add crossOrigin="use-credentials" for YOUR own server    │
//  │  or for Web Audio API visualisation (which needs the decoded   │
//  │  buffer — not required here).                                   │
//  └─────────────────────────────────────────────────────────────────┘
//
//  Additional fixes applied here:
//  • play() returns a Promise — we must await/catch it, never ignore
//  • `preload="metadata"` so duration is known before full download
//  • Sync real audio currentTime → Zustand every 250 ms (not 1 s)
//  • Single audio element created once, never re-created
//  • Proper cleanup of all event listeners on unmount
// ─────────────────────────────────────────────
"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const syncRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  const {
    currentTrack,
    isPlaying,
    currentTime,
    volume,
    isMuted,
    next,
    setCurrentTime,
  } = usePlayerStore();

  /* ── Create audio element once ── */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const audio = new Audio();

    // ⚠️  DO NOT set crossOrigin here — see header comment
    audio.preload       = "metadata"; // fetch duration without full download
    audio.volume        = usePlayerStore.getState().volume;
    audio.muted         = usePlayerStore.getState().isMuted;

    audioRef.current = audio;

    /* ── Event: track ended ── */
    const onEnded = () => {
      const { repeatMode } = usePlayerStore.getState();
      if (repeatMode === "one") {
        audio.currentTime = 0;
        audio.play().catch(console.warn);
      } else {
        next();
      }
    };

    /* ── Event: actual playback error ── */
    const onError = (e: Event) => {
      const err = (e.target as HTMLAudioElement).error;
      console.error("[NexaMusic] Audio error:", err?.message ?? err);
    };

    audio.addEventListener("ended",  onEnded);
    audio.addEventListener("error",  onError);

    return () => {
      audio.removeEventListener("ended",  onEnded);
      audio.removeEventListener("error",  onError);
      audio.pause();
      audio.src = "";
      audioRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ── React to track change ── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    // Load new source only when it actually changes
    if (audio.src !== currentTrack.src) {
      audio.src = currentTrack.src;
      audio.load();          // required after src change
    }

    if (isPlaying) {
      const promise = audio.play();
      if (promise !== undefined) {
        promise.catch((err) => {
          // NotAllowedError = browser blocked autoplay; other errors = log
          console.warn("[NexaMusic] play() blocked:", err.name, err.message);
        });
      }
    } else {
      audio.pause();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack?.id]);   // only re-run when TRACK changes, not every render

  /* ── React to isPlaying toggle (same track) ── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.play().catch(console.warn);
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  /* ── React to volume change ── */
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
    audio.muted  = isMuted;
  }, [volume, isMuted]);

  /* ── React to seekTo (store currentTime changed externally) ── */
  const lastSeekedTime = useRef<number>(-1);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    // Only seek if difference > 1 s to avoid fighting with sync loop
    if (Math.abs(audio.currentTime - currentTime) > 1) {
      audio.currentTime       = currentTime;
      lastSeekedTime.current  = currentTime;
    }
  }, [currentTime]);

  /* ── Sync real audio time → store every 250 ms ── */
  useEffect(() => {
    if (syncRef.current) clearInterval(syncRef.current);

    if (isPlaying) {
      syncRef.current = setInterval(() => {
        const audio = audioRef.current;
        if (!audio || audio.paused) return;
        const t = Math.floor(audio.currentTime);
        // Only update store if value changed (avoids useless re-renders)
        if (t !== usePlayerStore.getState().currentTime) {
          setCurrentTime(t);
        }
      }, 250);
    }

    return () => {
      if (syncRef.current) clearInterval(syncRef.current);
    };
  }, [isPlaying, setCurrentTime]);

  /* ── Expose a seekTo helper (direct, bypasses store round-trip) ── */
  const seekDirect = useCallback((seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = seconds;
    setCurrentTime(seconds);
  }, [setCurrentTime]);

  return { audioRef, seekDirect };
}