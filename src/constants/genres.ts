import { COLORS } from "./colors";


export const GENRES = [
  "All",
  "Lo-Fi",
  "Chill",
  "Hype",
  "Acoustic",
  "Electronic",
  "Jazz",
  "Ambient",
] as const;

export type Genre = (typeof GENRES)[number];

/** Maps each genre to its accent colour */
export const GENRE_COLORS: Record<string, string> = {
  "Lo-Fi":      COLORS.primary,
  "Chill":      COLORS.secondary,
  "Hype":       COLORS.accent,
  "Acoustic":   COLORS.success,
  "Electronic": COLORS.warning,
  "Jazz":       "#8B5CF6",
  "Ambient":    "#3B82F6",
};