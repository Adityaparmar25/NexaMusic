
// ─────────────────────────────────────────────
//  components/admin/Analytics.tsx
// ─────────────────────────────────────────────
"use client";

import { COLORS } from "@/constants/colors";
import { GENRES, GENRE_COLORS } from "@/constants/genres";
import type { Track } from "@/types";

interface AnalyticsProps { tracks: Track[]; }

export function Analytics({ tracks }: AnalyticsProps) {
  const active     = tracks.filter((t) => t.isActive);
  const total      = tracks.reduce((s, t) => s + t.playCount, 0);
  const top5       = [...active].sort((a, b) => b.playCount - a.playCount).slice(0, 5);
  const maxP       = top5[0]?.playCount || 1;
  const BAR_COLORS = [COLORS.primary, COLORS.secondary, COLORS.accent, COLORS.success, COLORS.warning];
  const totalSec   = active.reduce((s, t) => s + t.duration, 0);

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 6 }}>Analytics</h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 28, fontSize: 14 }}>Track performance overview</p>

      {/* Top tracks bar chart */}
      <div style={{ background: COLORS.bgSurface, borderRadius: 16, padding: 28, marginBottom: 22 }}>
        <h3 style={{ fontSize: 17, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 24 }}>
          Top Tracks by Plays
        </h3>
        {top5.map((t, i) => (
          <div key={t.id} style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 7 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ color: COLORS.textMuted, fontSize: 13, fontWeight: 700, width: 24, flexShrink: 0 }}>#{i + 1}</span>
                <img src={t.cover} alt="" style={{ width: 32, height: 32, borderRadius: 7, objectFit: "cover" }} onError={(e) => ((e.target as HTMLImageElement).style.background = COLORS.bgSurface)} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.textPrimary }}>{t.title}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{t.artist}</div>
                </div>
              </div>
              <span style={{ color: BAR_COLORS[i], fontWeight: 700, fontSize: 14 }}>{t.playCount.toLocaleString()}</span>
            </div>
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 4, height: 7, overflow: "hidden" }}>
              <div style={{ height: "100%", borderRadius: 4, width: `${(t.playCount / maxP) * 100}%`, background: `linear-gradient(to right,${BAR_COLORS[i]},${BAR_COLORS[(i + 1) % 5]})`, transition: "width 0.8s ease" }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Genre breakdown */}
        <div style={{ background: COLORS.bgSurface, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 16 }}>Genre Breakdown</h3>
          {GENRES.filter((g) => g !== "All").map((g) => {
            const cnt = active.filter((t) => t.genre.includes(g)).length;
            return cnt > 0 ? (
              <div key={g} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <span style={{ fontSize: 12, color: COLORS.textMuted, width: 80, flexShrink: 0 }}>{g}</span>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.06)", borderRadius: 3, height: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", background: GENRE_COLORS[g] || COLORS.primary, width: `${(cnt / Math.max(active.length, 1)) * 100}%` }} />
                </div>
                <span style={{ fontSize: 12, color: COLORS.textMuted, width: 18, textAlign: "right" }}>{cnt}</span>
              </div>
            ) : null;
          })}
        </div>

        {/* Quick stats */}
        <div style={{ background: COLORS.bgSurface, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: COLORS.textPrimary, marginBottom: 16 }}>Quick Stats</h3>
          {[
            { l: "Avg plays / track",   v: Math.round(total / Math.max(active.length, 1)).toLocaleString() },
            { l: "Total catalog",       v: `${tracks.length} tracks` },
            { l: "Featured",            v: tracks.filter((t) => t.featured && t.isActive).length },
            { l: "Inactive",            v: tracks.filter((t) => !t.isActive).length },
            { l: "Total play time",     v: `${Math.round(totalSec / 3600)} h` },
            { l: "Most popular",        v: top5[0]?.title ?? "—" },
          ].map((s) => (
            <div key={s.l} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ color: COLORS.textMuted, fontSize: 13 }}>{s.l}</span>
              <span style={{ color: COLORS.textPrimary, fontWeight: 600, fontSize: 13 }}>{String(s.v)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}