
// ─────────────────────────────────────────────
//  components/ui/KeyboardHUD.tsx
//  Keyboard shortcut reference overlay
// ─────────────────────────────────────────────
"use client";

import { COLORS } from "@/constants/colors";

const SHORTCUTS: [string, string][] = [
  ["Space",   "Play / Pause"],
  ["← / →",  "Seek ±10 s"],
  ["M",       "Mute"],
  ["N",       "Next track"],
  ["P",       "Prev track"],
  ["Esc",     "Close overlay"],
  ["/",       "Toggle this HUD"],
];

interface Props {
  visible: boolean;
}

export function KeyboardHUD({ visible }: Props) {
  return (
    <div
      aria-hidden={!visible}
      style={{
        position: "fixed",
        bottom: 110,
        right: 18,
        zIndex: 900,
        pointerEvents: visible ? "auto" : "none",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(10px)",
        transition: "opacity 0.25s ease, transform 0.25s ease",
      }}
    >
      <div
        style={{
          padding: "14px 18px",
          borderRadius: 16,
          background: "rgba(15,10,30,0.94)",
          backdropFilter: "blur(18px)",
          WebkitBackdropFilter: "blur(18px)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 16px 48px rgba(0,0,0,.55)",
          minWidth: 210,
        }}
      >
        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: COLORS.textPrimary,
            letterSpacing: 0.8,
            marginBottom: 12,
          }}
        >
          ⌨&nbsp; KEYBOARD SHORTCUTS
        </div>
        {SHORTCUTS.map(([key, desc]) => (
          <div
            key={key}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 18,
              marginBottom: 6,
            }}
          >
            <kbd
              style={{
                background: "rgba(255,255,255,0.1)",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "2px 8px",
                borderRadius: 6,
                fontFamily: "monospace",
                fontSize: 11,
                color: COLORS.secondary,
                letterSpacing: 0.3,
                flexShrink: 0,
              }}
            >
              {key}
            </kbd>
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>{desc}</span>
          </div>
        ))}
      </div>
    </div>
  );
}