"use client";

import { useState } from "react";
import { Music, X, Eye, EyeOff } from "lucide-react";
import { COLORS } from "@/constants/colors";

interface AdminLoginProps {
  onSuccess: () => void;
  onClose: () => void;
}

export function AdminLogin({ onSuccess, onClose }: AdminLoginProps) {
  const [email,   setEmail]   = useState("");
  const [pass,    setPass]    = useState("");
  const [show,    setShow]    = useState(false);
  const [error,   setError]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !pass.trim()) {
      setError("Both fields are required.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ FIXED: actually call the API instead of hardcoded comparison
      const res  = await fetch("/api/admin/login", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email: email.trim(), password: pass }),
      });

      const data = await res.json();

      if (res.ok) {
        onSuccess();
      } else {
        // Show the exact error from the server (e.g. "Invalid credentials.",
        // "Too many attempts.", "Email and password required.")
        setError(data.error ?? "Login failed. Please try again.");
      }
    } catch {
      setError("Network error — check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Allow Enter key to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  const fieldStyle: React.CSSProperties = {
    padding: "12px 14px",
    borderRadius: 10,
    fontSize: 14,
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.11)",
    color: COLORS.textPrimary,
    outline: "none",
    fontFamily: "inherit",
    transition: "border 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  const onFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = COLORS.primary;
    e.currentTarget.style.boxShadow   = `0 0 0 3px ${COLORS.borderGlow}`;
  };

  const onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.11)";
    e.currentTarget.style.boxShadow   = "none";
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Admin login"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 3000,
        background: COLORS.bgDeep,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fadeIn 0.3s ease",
      }}
    >
      <div
        style={{
          width: 400,
          borderRadius: 22,
          padding: 44,
          position: "relative",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.07)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close login"
          style={{
            position: "absolute",
            top: 14,
            right: 14,
            background: "rgba(255,255,255,0.06)",
            border: "none",
            borderRadius: 8,
            padding: 8,
            cursor: "pointer",
            color: COLORS.textMuted,
            display: "flex",
          }}
        >
          <X size={16} />
        </button>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 58,
              height: 58,
              borderRadius: 16,
              background: `linear-gradient(135deg,${COLORS.primary},${COLORS.secondary})`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 14px",
              boxShadow: `0 8px 28px ${COLORS.borderGlow}`,
            }}
          >
            <Music size={26} color="#fff" />
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: COLORS.textPrimary }}>
            Admin Portal
          </div>
          <div style={{ fontSize: 13, color: COLORS.textMuted, marginTop: 4 }}>
            Sign in to manage your catalog
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div
            role="alert"
            style={{
              background: "rgba(239,68,68,.12)",
              border: "1px solid rgba(239,68,68,.3)",
              color: "#f87171",
              padding: "10px 14px",
              borderRadius: 10,
              marginBottom: 16,
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            autoComplete="username"
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            style={fieldStyle}
          />

          <div style={{ position: "relative" }}>
            <input
              type={show ? "text" : "password"}
              placeholder="Password"
              value={pass}
              autoComplete="current-password"
              onChange={(e) => setPass(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={onFocus}
              onBlur={onBlur}
              style={{ ...fieldStyle, paddingRight: 42 }}
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              style={{
                position: "absolute",
                right: 12,
                top: "50%",
                transform: "translateY(-50%)",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                color: COLORS.textMuted,
                display: "flex",
              }}
            >
              {show ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            style={{
              padding: 13,
              borderRadius: 10,
              fontSize: 15,
              width: "100%",
              background: loading
                ? "rgba(124,58,237,0.5)"
                : `linear-gradient(135deg,${COLORS.primary},${COLORS.secondary})`,
              border: "none",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              fontFamily: "inherit",
              transition: "all 0.22s",
            }}
          >
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}