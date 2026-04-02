
// ─────────────────────────────────────────────
//  components/ui/GenreBadge.tsx
//  Colour-coded genre pill
// ─────────────────────────────────────────────
import { GENRE_COLORS } from "@/constants/genres";
import { COLORS } from "@/constants/colors";

interface GenreBadgeProps {
  genre: string;
  small?: boolean;
}

export function GenreBadge({ genre, small = false }: GenreBadgeProps) {
  const color = GENRE_COLORS[genre] ?? COLORS.primary;
  return (
    <span
      style={{
        background: `${color}1e`,
        color,
        border: `1px solid ${color}44`,
        padding: small ? "2px 8px" : "3px 11px",
        borderRadius: 20,
        fontSize: small ? 10 : 11,
        fontWeight: 600,
        letterSpacing: 0.4,
        whiteSpace: "nowrap",
        display: "inline-block",
      }}
    >
      {genre}
    </span>
  );
}