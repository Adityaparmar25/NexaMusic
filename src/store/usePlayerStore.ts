// ─────────────────────────────────────────────
//  store/usePlayerStore.ts
//  Zustand global store — player state & actions
//  Install: npm i zustand
// ─────────────────────────────────────────────
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Track, PlayerState, PlayerActions, RepeatMode } from "@/types";

type Store = PlayerState & PlayerActions;

const initialState: PlayerState = {
  currentTrack:    null,
  queue:           [],
  isPlaying:       false,
  currentTime:     0,
  volume:          0.8,
  isMuted:         false,
  isShuffle:       false,
  repeatMode:      "off",
  isPlayerVisible: false,
  isNowPlayingOpen:false,
};

/** Pick a random index that is NOT the current one */
const randomIdx = (len: number, current: number): number => {
  if (len <= 1) return 0;
  let next = Math.floor(Math.random() * len);
  while (next === current) next = Math.floor(Math.random() * len);
  return next;
};

export const usePlayerStore = create<Store>()(
  devtools(
    (set, get) => ({
      ...initialState,

      /* ── Play a track (optionally replace queue) ── */
      play(track: Track, queue?: Track[]) {
        set({
          currentTrack:    track,
          queue:           queue ?? get().queue,
          isPlaying:       true,
          currentTime:     0,
          isPlayerVisible: true,
        });
      },

      /* ── Pause / Resume / Toggle ── */
      pause()  { set({ isPlaying: false }); },
      resume() { set({ isPlaying: true  }); },
      togglePlay() {
        const { isPlaying, currentTrack } = get();
        if (!currentTrack) return;
        set({ isPlaying: !isPlaying });
      },

      /* ── Next track ── */
      next() {
        const { queue, currentTrack, isShuffle, repeatMode } = get();
        if (!queue.length) return;
        const idx = queue.findIndex((t) => t.id === currentTrack?.id);

        if (repeatMode === "one") {
          // restart same track — audio hook will react to currentTime reset
          set({ currentTime: 0, isPlaying: true });
          return;
        }

        let nextIdx: number;
        if (isShuffle) {
          nextIdx = randomIdx(queue.length, idx);
        } else {
          nextIdx = idx + 1;
          if (nextIdx >= queue.length) {
            if (repeatMode === "all") {
              nextIdx = 0;
            } else {
              // End of queue
              set({ isPlaying: false });
              return;
            }
          }
        }
        set({ currentTrack: queue[nextIdx], currentTime: 0, isPlaying: true });
      },

      /* ── Previous track ── */
      prev() {
        const { queue, currentTrack, currentTime, isShuffle } = get();
        // If more than 3 s in, restart current
        if (currentTime > 3) {
          set({ currentTime: 0 });
          return;
        }
        if (!queue.length) return;
        const idx = queue.findIndex((t) => t.id === currentTrack?.id);
        const prevIdx = isShuffle
          ? randomIdx(queue.length, idx)
          : (idx - 1 + queue.length) % queue.length;
        set({ currentTrack: queue[prevIdx], currentTime: 0, isPlaying: true });
      },

      /* ── Seek ── */
      seekTo(seconds: number) {
        set({ currentTime: Math.max(0, seconds) });
      },

      /* ── Volume ── */
      setVolume(v: number) {
        const clamped = Math.min(1, Math.max(0, v));
        set({ volume: clamped, isMuted: clamped === 0 });
      },

      /* ── Mute toggle ── */
      toggleMute() {
        set((s) => ({ isMuted: !s.isMuted }));
      },

      /* ── Shuffle ── */
      toggleShuffle() {
        set((s) => ({ isShuffle: !s.isShuffle }));
      },

      /* ── Repeat cycle: off → all → one → off ── */
      cycleRepeat() {
        const order: RepeatMode[] = ["off", "all", "one"];
        const { repeatMode } = get();
        const next = order[(order.indexOf(repeatMode) + 1) % order.length];
        set({ repeatMode: next });
      },

      /* ── Now Playing overlay ── */
      openNowPlaying()  { set({ isNowPlayingOpen: true  }); },
      closeNowPlaying() { set({ isNowPlayingOpen: false }); },

      /* ── Internal time sync (called by useAudio) ── */
      setCurrentTime(t: number) {
        set({ currentTime: t });
      },
    }),
    { name: "NexaMusic/Player" }
  )
);