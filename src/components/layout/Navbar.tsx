// ─────────────────────────────────────────────
//  components/layout/Navbar.tsx
// ─────────────────────────────────────────────
"use client";

import { useState, useCallback } from "react";
import { Music, Search, X } from "lucide-react";
import { COLORS } from "@/constants/colors";
import { EqBars } from "@/components/ui/EqBars";
import { usePlayerStore } from "@/store/usePlayerStore";

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onAdminClick: () => void;
  onHudToggle: () => void;
}

export function Navbar({
  searchQuery,
  onSearchChange,
  onAdminClick,
  onHudToggle,
}: NavbarProps) {
  const { isPlaying } = usePlayerStore();
  const [adminHover, setAdminHover] = useState(false);

  const clearSearch = useCallback(() => onSearchChange(""), [onSearchChange]);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        padding: "12px 24px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        background: "rgba(15,10,30,0.92)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderBottom: "1px solid rgba(255,255,255,0.07)",
      }}
    >
      {/* Logo */}
      <a href="/">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            flexShrink: 0,
            userSelect: "none",
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
              boxShadow: `0 4px 16px ${COLORS.borderGlow}`,
            }}
          >
            <Music size={16} color="#fff" />
          </div>
          <span
            style={{
              fontSize: 18,
              fontWeight: 800,
              background: `linear-gradient(135deg,${COLORS.textPrimary},${COLORS.secondary})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            NexaMusic
          </span>
        </div>
      </a>

      {/* Search */}
      <div
        style={{
          flex: 1,
          position: "relative",
          maxWidth: 420,
          margin: "0 auto",
        }}
      >
        <Search
          size={14}
          style={{
            position: "absolute",
            left: 13,
            top: "50%",
            transform: "translateY(-50%)",
            color: COLORS.textMuted,
            pointerEvents: "none",
          }}
        />
        <input
          type="search"
          placeholder="Search songs, artists, albums…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search music"
          style={{
            width: "100%",
            padding: "9px 36px 9px 38px",
            borderRadius: 22,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.11)",
            color: COLORS.textPrimary,
            fontSize: 13,
            outline: "none",
            transition: "border 0.2s, box-shadow 0.2s",
            fontFamily: "inherit",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = COLORS.primary;
            e.target.style.boxShadow = `0 0 0 3px ${COLORS.borderGlow}`;
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "rgba(255,255,255,0.11)";
            e.target.style.boxShadow = "none";
          }}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            aria-label="Clear search"
            style={{
              position: "absolute",
              right: 11,
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: COLORS.textMuted,
              display: "flex",
              alignItems: "center",
              padding: 3,
            }}
          >
            <X size={13} />
          </button>
        )}
      </div>

      {/* Right actions */}
      <div
        style={{
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {isPlaying && (
          <EqBars
            active={true}
            color={COLORS.secondary}
            barWidth={3}
            height={22}
          />
        )}

        {/* Keyboard HUD toggle */}
        <button
          onClick={onHudToggle}
          title="Keyboard shortcuts  (/)"
          aria-label="Toggle keyboard shortcuts"
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: COLORS.textMuted,
            padding: "5px 10px",
            borderRadius: 8,
            cursor: "pointer",
            fontSize: 12,
            fontFamily: "monospace",
            letterSpacing: 0.5,
            transition: "all 0.18s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = COLORS.primary;
            e.currentTarget.style.color = COLORS.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            e.currentTarget.style.color = COLORS.textMuted;
          }}
        >
          /
        </button>

        {/* Admin button */}
        <button
          onClick={onAdminClick}
          aria-label="Open admin panel"
          style={{
            background: adminHover
              ? "rgba(124,58,237,0.24)"
              : "rgba(124,58,237,0.13)",
            border: `1px solid rgba(124,58,237,${
              adminHover ? "0.45" : "0.26"
            })`,
            color: COLORS.primary,
            padding: "7px 18px",
            borderRadius: 20,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "inherit",
            transition: "all 0.2s",
          }}
          onMouseEnter={() => setAdminHover(true)}
          onMouseLeave={() => setAdminHover(false)}
        >
          Admin
        </button>
      </div>
    </nav>
  );
}
