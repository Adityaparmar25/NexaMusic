export const COLORS = {
  primary:       "#7C3AED",
  secondary:     "#06B6D4",
  accent:        "#EC4899",
  bgDeep:        "#0F0A1E",
  bgSurface:     "#1E1B2E",
  bgGlass:       "rgba(255,255,255,0.05)",
  textPrimary:   "#F9FAFB",
  textMuted:     "#9CA3AF",
  borderGlow:    "rgba(124,58,237,0.4)",
  success:       "#10B981",
  danger:        "#EF4444",
  warning:       "#F59E0B",
} as const;

export type ColorKey = keyof typeof COLORS;