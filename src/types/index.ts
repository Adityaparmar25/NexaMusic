/* ── Track ─────────────────────────────────── */
export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  genre: string[];
  duration: number;         // seconds
  src: string;              // stream URL (Drive or direct)
  cover: string;            // cover art URL
  driveFileId?: string;     // raw Google Drive file ID
  featured: boolean;
  playCount: number;
  order: number;
  isActive: boolean;
  uploadedAt?: string;      // ISO date string
}

/* ── Admin User ─────────────────────────────── */
export interface AdminUser {
  id: string;
  email: string;
  name?: string;
  role: "admin" | "superadmin";
  lastLoginAt?: string;
}

/* ── Player State ───────────────────────────── */
export type RepeatMode = "off" | "one" | "all";

export interface PlayerState {
  currentTrack: Track | null;
  queue: Track[];
  isPlaying: boolean;
  currentTime: number;      // seconds elapsed
  volume: number;           // 0–1
  isMuted: boolean;
  isShuffle: boolean;
  repeatMode: RepeatMode;
  isPlayerVisible: boolean;
  isNowPlayingOpen: boolean;
}

export interface PlayerActions {
  play: (track: Track, queue?: Track[]) => void;
  pause: () => void;
  resume: () => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seekTo: (seconds: number) => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleShuffle: () => void;
  cycleRepeat: () => void;
  openNowPlaying: () => void;
  closeNowPlaying: () => void;
  setCurrentTime: (t: number) => void;
}

/* ── Admin Form ──────────────────────────────── */
export interface TrackFormData {
  title: string;
  artist: string;
  album: string;
  genre: string;
  duration: string;
  driveFileId: string;
  coverArtUrl: string;
  featured: boolean;
}

export const BLANK_FORM: TrackFormData = {
  title: "",
  artist: "",
  album: "",
  genre: "Lo-Fi",
  duration: "",
  driveFileId: "",
  coverArtUrl: "",
  featured: false,
};

/* ── API Responses ──────────────────────────── */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

/* ── Notification ───────────────────────────── */
export type NotifType = "success" | "error" | "info";

export interface Notification {
  id: string;
  message: string;
  type: NotifType;
}

/* ── Admin Panel View ───────────────────────── */
export type AdminView = "dashboard" | "add" | "edit" | "analytics";

/* ── Mongoose Documents (for API layer) ─────── */
export interface TrackDocument extends Omit<Track, "id"> {
  _id: string;
  __v?: number;
}

export interface AdminDocument extends Omit<AdminUser, "id"> {
  _id: string;
  passwordHash: string;
  createdAt: string;
}