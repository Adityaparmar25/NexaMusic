
// ─────────────────────────────────────────────
//  components/admin/TrackForm.tsx
//  Add & Edit track form
// ─────────────────────────────────────────────
"use client";

import { ArrowLeft } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { GENRES } from "@/constants/genres";
import type { TrackFormData } from "@/types";

interface TrackFormProps {
  mode: "add" | "edit";
  data: TrackFormData;
  onChange: (d: TrackFormData) => void;
  onSave: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export function TrackForm({
  mode,
  data,
  onChange,
  onSave,
  onCancel,
  isSaving = false,
}: TrackFormProps) {
  const set = (key: keyof TrackFormData, val: string | boolean) =>
    onChange({ ...data, [key]: val });

  const FIELDS: { key: keyof TrackFormData; label: string; placeholder: string; type: string }[] = [
    { key: "title",       label: "Track Title *",          placeholder: "e.g. Midnight Dreams",                            type: "text"   },
    { key: "artist",      label: "Artist Name *",          placeholder: "e.g. Luna Eclipse",                               type: "text"   },
    { key: "album",       label: "Album",                  placeholder: "e.g. Cosmic Vibes",                               type: "text"   },
    { key: "driveFileId", label: "Google Drive File ID",   placeholder: "Paste the ID from the Drive shareable URL",       type: "text"   },
    { key: "coverArtUrl", label: "Cover Art URL",          placeholder: "https://…/cover.jpg",                            type: "url"    },
    { key: "duration",    label: "Duration (seconds)",     placeholder: "e.g. 213",                                        type: "number" },
  ];

  const fieldStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.11)",
    background: "rgba(255,255,255,0.06)",
    color: COLORS.textPrimary,
    fontSize: 14,
    fontFamily: "inherit",
    outline: "none", 
    boxSizing: "border-box", 
    transition: "border 0.2s, box-shadow 0.2s", 
  };

  const focusStyle = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.currentTarget.style.borderColor = COLORS.primary;
    e.currentTarget.style.boxShadow = `0 0 0 3px ${COLORS.borderGlow}`; 
  };

  // ── Blur handler ─────────────────────────────────────────────────
  const blurStyle = (
    e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.11)";
    e.currentTarget.style.boxShadow = "none"; 
  };


  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 26 }}>
        <button
          onClick={onCancel}
          aria-label="Back to dashboard"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "none",
            borderRadius: 10,
            padding: 10,
            cursor: "pointer",
            color: COLORS.textMuted,
            display: "flex",
          }}
        >
          <ArrowLeft size={19} />
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: COLORS.textPrimary }}>
          {mode === "edit" ? "Edit Track" : "Add New Track"}
        </h1>
      </div>

      <div style={{ maxWidth: 580 }}>
        <div
          style={{
            borderRadius: 16,
            padding: 30,
            display: "flex",
            flexDirection: "column",
            gap: 18,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label
                htmlFor={`tf-${f.key}`}
                style={{ display: "block", fontSize: 13, color: COLORS.textMuted, marginBottom: 6, fontWeight: 500 }}
              >
                {f.label}
              </label>
              <input
                id={`tf-${f.key}`}
                type={f.type}
                placeholder={f.placeholder}
                value={String(data[f.key])}
                onChange={(e) => set(f.key, e.target.value)}
                style={fieldStyle}
                onFocus={focusStyle}
                onBlur={blurStyle}
              />
            </div>
          ))}

          {/* Genre select */}
          <div>
            <label htmlFor="tf-genre" style={{ display: "block", fontSize: 13, color: COLORS.textMuted, marginBottom: 6, fontWeight: 500 }}>
              Genre
            </label>
            <select
              id="tf-genre"
              value={data.genre}
              onChange={(e) => set("genre", e.target.value)}
              style={{
                ...fieldStyle,
                cursor: "pointer",
              }}
            >
              {GENRES.filter((g) => g !== "All").map((g) => (
                <option key={g} value={g} style={{ background: COLORS.bgSurface }}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Featured toggle */}
          <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
            <input
              type="checkbox"
              checked={data.featured}
              onChange={(e) => set("featured", e.target.checked)}
              style={{ width: 16, height: 16, accentColor: COLORS.primary }}
            />
            <span style={{ fontSize: 14, color: COLORS.textPrimary }}>
              Mark as featured (shown in hero carousel)
            </span>
          </label>

          {/* Cover preview */}
          {data.coverArtUrl && (
            <div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8 }}>
                Cover preview
              </div>
              <img
                src={data.coverArtUrl}
                alt="Cover preview"
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 10,
                  objectFit: "cover",
                  border: `1px solid ${COLORS.primary}44`,
                }}
                onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
              />
            </div>
          )}

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
            <button
              onClick={onSave}
              disabled={isSaving}
              style={{
                padding: "12px 28px",
                borderRadius: 10,
                fontSize: 14,
                background: isSaving
                  ? "rgba(124,58,237,0.5)"
                  : `linear-gradient(135deg,${COLORS.primary},${COLORS.secondary})`,
                border: "none",
                color: "#fff",
                fontWeight: 700,
                cursor: isSaving ? "not-allowed" : "pointer",
                fontFamily: "inherit",
                transition: "all 0.22s",
              }}
            >
              {isSaving ? "Saving…" : mode === "edit" ? "Update Track" : "Publish Track"}
            </button>
            <button
              onClick={onCancel}
              style={{
                padding: "12px 20px",
                borderRadius: 10,
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: COLORS.textMuted,
                cursor: "pointer",
                fontSize: 14,
                fontFamily: "inherit",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}