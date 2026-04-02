// ─────────────────────────────────────────────
//  Global keyboard shortcuts — Space, ←→, M, N, Esc
// ─────────────────────────────────────────────
"use client";

import { useEffect } from "react";
import { usePlayerStore } from "@/store/usePlayerStore";

const IGNORED_TAGS = new Set(["INPUT", "TEXTAREA", "SELECT"]);

export function useKeyboard() {
  const {
    togglePlay,
    next,
    prev,
    toggleMute,
    seekTo,
    currentTime,
    currentTrack,
    closeNowPlaying,
  } = usePlayerStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't intercept when user is typing
      if (IGNORED_TAGS.has((e.target as HTMLElement).tagName)) return;
      // Don't intercept modified keys (Ctrl+S, Cmd+R, etc.)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      switch (e.code) {
        case "Space":
          e.preventDefault();
          togglePlay();
          break;

        case "ArrowRight":
          if (currentTrack) {
            e.preventDefault();
            seekTo(Math.min(currentTime + 10, currentTrack.duration));
          }
          break;

        case "ArrowLeft":
          if (currentTrack) {
            e.preventDefault();
            seekTo(Math.max(currentTime - 10, 0));
          }
          break;

        case "KeyM":
          toggleMute();
          break;

        case "KeyN":
          next();
          break;

        case "KeyP":
          prev();
          break;

        case "Escape":
          closeNowPlaying();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [togglePlay, next, prev, toggleMute, seekTo, currentTime, currentTrack, closeNowPlaying]);
}

