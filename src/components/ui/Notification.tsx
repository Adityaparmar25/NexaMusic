// ─────────────────────────────────────────────
//  components/ui/Notification.tsx
//  Animated toast — auto-dismisses
// ─────────────────────────────────────────────
"use client";

import { useEffect, useState } from "react";
import { Check, AlertCircle, Info, X } from "lucide-react";
import { COLORS } from "@/constants/colors";
import type { Notification as TNotif } from "@/types";

const CONFIG = {
  success: { icon: Check,         border: COLORS.success,   bg: "rgba(16,185,129,.12)"  },
  error:   { icon: AlertCircle,   border: COLORS.danger,    bg: "rgba(239,68,68,.12)"   },
  info:    { icon: Info,          border: COLORS.secondary, bg: "rgba(6,182,212,.12)"   },
} as const;

interface Props {
  notification: TNotif;
  onDismiss: (id: string) => void;
}

export function Notification({ notification, onDismiss }: Props) {
  const [visible, setVisible] = useState(false);
  const { icon: Icon, border, bg } = CONFIG[notification.type];

  useEffect(() => {
    // Slight delay → trigger CSS transition
    const show = setTimeout(() => setVisible(true), 10);
    const hide = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onDismiss(notification.id), 320);
    }, 3500);
    return () => { clearTimeout(show); clearTimeout(hide); };
  }, [notification.id, onDismiss]);

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "12px 18px 12px 14px",
        borderRadius: 14,
        background: COLORS.bgSurface,
        border: `1px solid ${border}`,
        boxShadow: "0 12px 44px rgba(0,0,0,.5)",
        fontSize: 14,
        color: COLORS.textPrimary,
        minWidth: 260,
        transform: visible ? "translateX(0)" : "translateX(80px)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.32s ease, opacity 0.32s ease",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={14} color={border} />
      </div>
      <span style={{ flex: 1 }}>{notification.message}</span>
      <button
        onClick={() => onDismiss(notification.id)}
        aria-label="Dismiss"
        style={{
          background: "transparent",
          border: "none",
          cursor: "pointer",
          color: COLORS.textMuted,
          padding: 2,
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}
