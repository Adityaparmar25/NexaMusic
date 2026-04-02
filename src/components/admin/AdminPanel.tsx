
// ─────────────────────────────────────────────
//  components/admin/AdminPanel.tsx
//  Shell: sidebar + content router
// ─────────────────────────────────────────────
"use client";

import { useState } from "react";
import { Music, LogOut, X } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { Dashboard } from "./Dashboard";
import { TrackForm } from "./TrackForm";
import { Analytics } from "./Analytics";
import type { Track, AdminView, TrackFormData } from "@/types";

interface AdminPanelProps {
  tracks: Track[];
  onClose: () => void;
  onLogout: () => void;
  onAdd: (data: TrackFormData) => void;
  onUpdate: (id: string, data: TrackFormData) => void;
  onDelete: (id: string) => void;
  onRestore: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

const NAV_ITEMS: { id: AdminView; icon: string; label: string }[] = [
  { id: "dashboard", icon: "⊞", label: "Dashboard"  },
  { id: "add",       icon: "+", label: "Add Track"   },
  { id: "analytics", icon: "▲", label: "Analytics"   },
];

export function AdminPanel({
  tracks,
  onClose,
  onLogout,
  onAdd,
  onUpdate,
  onDelete,
  onRestore,
  onToggleFeatured,
}: AdminPanelProps) {
  const [view,    setView]    = useState<AdminView>("dashboard");
  const [editing, setEditing] = useState<Track | null>(null);
  const [form,    setForm]    = useState<TrackFormData>({
    title: "", artist: "", album: "", genre: "Lo-Fi",
    duration: "", driveFileId: "", coverArtUrl: "", featured: false,
  });
  const [saving, setSaving] = useState(false);

  const activeCount = tracks.filter((t) => t.isActive).length;
  const totalPlays  = tracks.reduce((s, t) => s + t.playCount, 0);

  const startEdit = (t: Track) => {
    setEditing(t);
    setForm({
      title: t.title, artist: t.artist, album: t.album ?? "",
      genre: t.genre[0] ?? "Lo-Fi", duration: String(t.duration),
      driveFileId: t.driveFileId ?? "", coverArtUrl: t.cover ?? "", featured: t.featured,
    });
    setView("edit");
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.artist.trim()) return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    if (editing) { onUpdate(editing.id, form); }
    else          { onAdd(form); }
    setSaving(false);
    setView("dashboard");
    setEditing(null);
    setForm({ title: "", artist: "", album: "", genre: "Lo-Fi", duration: "", driveFileId: "", coverArtUrl: "", featured: false });
  };

  const handleCancel = () => {
    setView("dashboard");
    setEditing(null);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admin panel"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        background: COLORS.bgDeep,
        display: "flex",
        animation: "fadeIn 0.3s ease",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 224,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          background: "rgba(15,10,30,0.92)",
          backdropFilter: "blur(24px)",
          borderRight: "1px solid rgba(255,255,255,0.07)",
          padding: "22px 16px",
        }}
      >
        {/* Logo */}
        <a href="/">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 32,
              padding: "0 6px",
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 9,
                background: `linear-gradient(135deg,${COLORS.primary},${COLORS.secondary})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Music size={16} color="#fff" />
            </div>
            <span
              style={{
                fontSize: 17,
                fontWeight: 800,
                color: COLORS.textPrimary,
              }}
            >
              NexaMusic
            </span>
          </div>
        </a>

        {/* Nav */}
        {NAV_ITEMS.map((item) => {
          const isActive =
            view === item.id || (item.id === "add" && view === "edit");
          return (
            <button
              key={item.id}
              onClick={() => {
                setView(item.id);
                setEditing(null);
              }}
              aria-current={isActive ? "page" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "11px 14px",
                borderRadius: 10,
                border: "none",
                cursor: "pointer",
                background: isActive ? "rgba(124,58,237,0.2)" : "transparent",
                color: isActive ? COLORS.primary : COLORS.textMuted,
                fontWeight: isActive ? 600 : 400,
                fontSize: 14,
                width: "100%",
                textAlign: "left",
                marginBottom: 4,
                transition: "all 0.18s",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: 16, width: 20 }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}

        <div style={{ flex: 1 }} />

        {/* Footer */}
        <div
          style={{
            borderTop: "1px solid rgba(255,255,255,0.07)",
            paddingTop: 14,
            marginTop: 14,
          }}
        >
          <div
            style={{
              fontSize: 12,
              color: COLORS.textMuted,
              marginBottom: 10,
              padding: "0 4px",
            }}
          >
            {activeCount} active · {totalPlays.toLocaleString()} plays
          </div>
          <button
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: COLORS.textMuted,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              padding: "6px 4px",
              fontFamily: "inherit",
              marginBottom: 6,
              transition: "color 0.18s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = COLORS.danger)}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = COLORS.textMuted)
            }
          >
            <LogOut size={13} /> Sign Out
          </button>
          <button
            onClick={onClose}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              color: COLORS.textMuted,
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: 12,
              padding: "4px",
              fontFamily: "inherit",
              transition: "color 0.18s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = COLORS.textPrimary)
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = COLORS.textMuted)
            }
          >
            <X size={12} /> Close Panel
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, overflowY: "auto", padding: "32px 36px" }}>
        {view === "dashboard" && (
          <Dashboard
            tracks={tracks}
            onAdd={() => setView("add")}
            onEdit={startEdit}
            onDelete={onDelete}
            onRestore={onRestore}
            onToggleFeatured={onToggleFeatured}
          />
        )}
        {(view === "add" || view === "edit") && (
          <TrackForm
            mode={editing ? "edit" : "add"}
            data={form}
            onChange={setForm}
            onSave={handleSave}
            onCancel={handleCancel}
            isSaving={saving}
          />
        )}
        {view === "analytics" && <Analytics tracks={tracks} />}
      </main>
    </div>
  );
}