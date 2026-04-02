"use client";

import { Plus, Edit3, Trash2, RotateCcw, AlertTriangle } from "lucide-react";
import { COLORS }      from "@/constants/colors";
import { GenreBadge }  from "@/components/ui/GenreBadge";
import { isDemoTrack } from "@/constants/sampleTracks";
import type { Track }  from "@/types";

const fmt = (s: number) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

interface DashboardProps {
  tracks: Track[];
  onAdd: () => void;
  onEdit: (t: Track) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

export function Dashboard({
  tracks,
  onAdd,
  onEdit,
  onDelete,
  onRestore,
  onToggleFeatured,
}: DashboardProps) {
  const active     = tracks.filter((t) => t.isActive);
  const totalPlay  = tracks.reduce((s, t) => s + t.playCount, 0);
  const allDemo    = active.length > 0 && active.every((t) => isDemoTrack(t.id));

  const STATS = [
    { label: "Active Tracks", value: active.length,                                          color: COLORS.primary   },
    { label: "Total Plays",   value: totalPlay.toLocaleString(),                              color: COLORS.secondary },
    { label: "Featured",      value: tracks.filter((t) => t.featured && t.isActive).length,  color: COLORS.accent    },
    { label: "Inactive",      value: tracks.filter((t) => !t.isActive).length,               color: COLORS.danger    },
  ];

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 800, color: COLORS.textPrimary, marginBottom: 6 }}>
        Dashboard
      </h1>
      <p style={{ color: COLORS.textMuted, marginBottom: 20, fontSize: 14 }}>
        Manage your music catalog
      </p>

      {/* ── Demo tracks banner ── */}
      {allDemo && (
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 12,
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.35)",
            borderRadius: 12,
            padding: "14px 18px",
            marginBottom: 24,
          }}
        >
          <AlertTriangle size={18} color={COLORS.warning} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.warning, marginBottom: 4 }}>
              You are seeing demo tracks
            </div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, lineHeight: 1.6 }}>
              Your MongoDB catalog is empty. These tracks are client-side placeholders and
              cannot be edited or deleted. Click <strong style={{ color: COLORS.textPrimary }}>Add Track</strong> to
              publish your first real track, or run <code style={{ background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: 4 }}>npm run seed:tracks</code> to
              populate sample data into MongoDB.
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(148px,1fr))",
          gap: 16,
          marginBottom: 30,
        }}
      >
        {STATS.map((s) => (
          <div
            key={s.label}
            style={{
              background: COLORS.bgSurface,
              borderRadius: 14,
              padding: "18px 20px",
              border: `1px solid ${s.color}20`,
            }}
          >
            <div style={{ fontSize: 30, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Track table */}
      <div style={{ background: COLORS.bgSurface, borderRadius: 16, overflow: "hidden" }}>
        <div
          style={{
            padding: "16px 22px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <span style={{ fontWeight: 700, fontSize: 16, color: COLORS.textPrimary }}>
            Track Catalog
          </span>
          <button
            onClick={onAdd}
            style={{
              padding: "8px 18px",
              borderRadius: 10,
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
              background: `linear-gradient(135deg,${COLORS.primary},${COLORS.secondary})`,
              border: "none",
              color: "#fff",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            <Plus size={13} /> Add Track
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: "rgba(255,255,255,0.02)" }}>
                {["", "Title", "Artist", "Genre", "Plays", "Duration", "★", "Status", "Actions"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "11px 14px",
                        textAlign: "left",
                        color: COLORS.textMuted,
                        fontWeight: 600,
                        fontSize: 11,
                        letterSpacing: 0.5,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {tracks.map((t) => {
                const demo = isDemoTrack(t.id);
                return (
                  <tr
                    key={t.id}
                    style={{
                      borderTop: "1px solid rgba(255,255,255,0.04)",
                      transition: "background 0.16s",
                      opacity: t.isActive ? 1 : 0.5,
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = "rgba(255,255,255,0.03)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td style={{ padding: "9px 14px" }}>
                      <img
                        src={t.cover}
                        alt=""
                        style={{ width: 34, height: 34, borderRadius: 7, objectFit: "cover" }}
                        onError={(e) =>
                          ((e.target as HTMLImageElement).style.background = COLORS.bgSurface)
                        }
                      />
                    </td>
                    <td style={{ padding: "9px 14px", color: COLORS.textPrimary, fontWeight: 600, whiteSpace: "nowrap", maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis" }}>
                      <span>{t.title}</span>
                      {/* ← DEMO badge */}
                      {demo && (
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: 0.6,
                            background: "rgba(245,158,11,0.15)",
                            color: COLORS.warning,
                            border: "1px solid rgba(245,158,11,0.3)",
                            padding: "1px 6px",
                            borderRadius: 4,
                            verticalAlign: "middle",
                          }}
                        >
                          DEMO
                        </span>
                      )}
                    </td>
                    <td style={{ padding: "9px 14px", color: COLORS.textMuted, whiteSpace: "nowrap" }}>
                      {t.artist}
                    </td>
                    <td style={{ padding: "9px 14px" }}>
                      <GenreBadge genre={t.genre[0]} small />
                    </td>
                    <td style={{ padding: "9px 14px", color: COLORS.textMuted }}>
                      {t.playCount.toLocaleString()}
                    </td>
                    <td style={{ padding: "9px 14px", color: COLORS.textMuted }}>
                      {fmt(t.duration)}
                    </td>

                    {/* Feature toggle — disabled for demo */}
                    <td style={{ padding: "9px 14px" }}>
                      <button
                        onClick={() => !demo && onToggleFeatured(t.id)}
                        disabled={demo}
                        aria-label={t.featured ? "Unfeature" : "Feature"}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: demo ? "not-allowed" : "pointer",
                          color: demo ? "rgba(255,255,255,0.15)" : t.featured ? COLORS.accent : COLORS.textMuted,
                          fontSize: 17,
                          lineHeight: 1,
                          fontFamily: "inherit",
                        }}
                      >
                        {t.featured ? "★" : "☆"}
                      </button>
                    </td>

                    <td style={{ padding: "9px 14px" }}>
                      <span
                        style={{
                          color: t.isActive ? COLORS.success : COLORS.danger,
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {t.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    {/* Actions — hidden for demo tracks */}
                    <td style={{ padding: "9px 14px" }}>
                      {demo ? (
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.2)", fontStyle: "italic" }}>
                          demo only
                        </span>
                      ) : (
                        <div style={{ display: "flex", gap: 6 }}>
                          {t.isActive && (
                            <button
                              onClick={() => onEdit(t)}
                              aria-label={`Edit ${t.title}`}
                              style={{
                                background: "rgba(6,182,212,0.1)", border: "none", borderRadius: 6,
                                padding: "5px 7px", cursor: "pointer", color: COLORS.secondary,
                                display: "flex", transition: "all 0.18s",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(6,182,212,0.22)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(6,182,212,0.1)")}
                            >
                              <Edit3 size={13} />
                            </button>
                          )}
                          {t.isActive ? (
                            <button
                              onClick={() => onDelete(t.id)}
                              aria-label={`Deactivate ${t.title}`}
                              style={{
                                background: "rgba(239,68,68,0.1)", border: "none", borderRadius: 6,
                                padding: "5px 7px", cursor: "pointer", color: COLORS.danger,
                                display: "flex", transition: "all 0.18s",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.22)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
                            >
                              <Trash2 size={13} />
                            </button>
                          ) : (
                            <button
                              onClick={() => onRestore(t.id)}
                              aria-label={`Restore ${t.title}`}
                              style={{
                                background: "rgba(16,185,129,0.1)", border: "none", borderRadius: 6,
                                padding: "5px 7px", cursor: "pointer", color: COLORS.success,
                                display: "flex", transition: "all 0.18s",
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.22)")}
                              onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(16,185,129,0.1)")}
                            >
                              <RotateCcw size={13} />
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}