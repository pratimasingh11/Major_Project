"use client";

import React, { useMemo, useRef, useState } from "react";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";

const BACKEND_URL = "http://localhost:8000";

type Msg = { role: "user" | "assistant"; text: string };

export default function StockChatbot({
  symbol,
  data,
  predictionContext,
  theme,
}: {
  symbol: string;
  data: any[];
  predictionContext?: {
    trend?: "Bullish" | "Bearish" | "Neutral";
    confidence?: number;
    rsi?: number;
    ema12?: number;
    ema26?: number;
    bbUpper?: number;
    bbLower?: number;
  };
  theme: "light" | "dark";
}) {
  const isDark = theme === "dark";
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "assistant", text: "👋 Hi! Ask me about stocks, trends and indicators.." },
  ]);
  const [loading, setLoading] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(true);
  const endRef = useRef<HTMLDivElement | null>(null);

  const styles = useMemo(
    () => ({
      panelBg: isDark ? "#0b1220" : "#fff",
      border: isDark ? "1px solid #223047" : "1px solid #e2e8f0",
      text: isDark ? "#e5e7eb" : "#0f172a",
      inputBg: isDark ? "#0f1b2e" : "#f8fafc",
      btnBg: "linear-gradient(135deg, #8b5cf6, #6366f1)",
      accentPurple: "#8b5cf6",
      accentBlue: "#6366f1",
      accentGreen: "#10b981",
    }),
    [isDark]
  );

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;

    setMsgs((m) => [...m, { role: "user", text: q }]);
    setInput("");
    setLoading(true);

    try {
      const payload = {
        question: q,
        symbol,
        timeframe: "1Y",
        history: msgs.slice(-6),
      };

      const res = await fetch(`${BACKEND_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      setMsgs((m) => [
        ...m,
        { role: "assistant", text: json.reply || "No answer generated." },
      ]);

      setTimeout(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    } catch {
      setMsgs((m) => [...m, { role: "assistant", text: "Something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  const renderMsg = (m: Msg, i: number) => (
    <div
      key={i}
      style={{
        marginBottom: 16,
        padding: "12px 16px",
        borderRadius: 16,
        background:
          m.role === "user"
            ? isDark
              ? "rgba(99,102,241,0.15)"
              : "rgba(99,102,241,0.08)"
            : isDark
            ? "rgba(30,41,59,0.5)"
            : "rgba(241,245,249,0.8)",
        borderLeft: `4px solid ${
          m.role === "user" ? styles.accentPurple : styles.accentBlue
        }`,
        maxWidth: "85%",
        marginLeft: m.role === "user" ? "auto" : 0,
      }}
    >
      <div
        style={{
          fontSize: 12,
          fontWeight: 700,
          marginBottom: 6,
          color: m.role === "user" ? styles.accentPurple : styles.accentBlue,
        }}
      >
        {m.role === "user" ? "You" : "🤖 Assistant"}
      </div>
      <div style={{ lineHeight: 1.5 }}>{m.text}</div>
    </div>
  );

  return (
    <>
      {!open && bubbleVisible && (
        <div
          style={{
            position: "fixed",
            right: 22,
            bottom: 92,
            zIndex: 9998,
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setOpen(true)}
        >
          <div
            style={{
              background: styles.btnBg,
              color: "#fff",
              padding: "14px 18px",
              borderRadius: 20,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 10,
            }}
          >
            <Sparkles size={20} />
            We're Here!
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setBubbleVisible(false);
            }}
            style={{
              marginLeft: 8,
              background: "rgba(255,255,255,0.2)",
              border: "none",
              borderRadius: "50%",
              width: 28,
              height: 28,
            }}
          >
            ×
          </button>
        </div>
      )}

      <button
        onClick={() => {
          setOpen((v) => !v);
          if (!open) setBubbleVisible(false);
        }}
        style={{
          position: "fixed",
          right: 22,
          bottom: 22,
          width: 64,
          height: 64,
          borderRadius: "50%",
          border: "none",
          background: styles.btnBg,
          color: "#fff",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
        }}
      >
        {open ? <X size={28} /> : <MessageCircle size={28} />}
      </button>

      {open && (
        <div
          style={{
            position: "fixed",
            right: 22,
            bottom: 100,
            width: 380,
            height: 500,
            background: styles.panelBg,
            border: styles.border,
            borderRadius: 20,
            display: "flex",
            flexDirection: "column",
            zIndex: 9997,
          }}
        >
          <div
            style={{
              padding: 16,
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 10,
              borderBottom: styles.border,
              background: "linear-gradient(135deg, #8b5cf6, #6366f1)",
              color: "#fff",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          >
            <img
              src="/assets/logo.png"
              alt="Logo"
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                objectFit: "contain",
              }}
            />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>FinSight</div>
              <div style={{ fontSize: 15 }}>{symbol.toUpperCase()} Analysis</div>
            </div>
          </div>

          <div style={{ flex: 1, padding: 16, overflowY: "auto" }}>
            {msgs.map(renderMsg)}
            {loading && renderMsg({ role: "assistant", text: "Thinking..." }, -1)}
            <div ref={endRef} />
          </div>

          <div style={{ padding: 12, display: "flex", gap: 8, borderTop: styles.border }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: `1px solid ${isDark ? "#334155" : "#cbd5e1"}`,
                background: styles.inputBg,
                color: styles.text,
              }}
            />
            <button
              onClick={send}
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                border: "none",
                background: styles.btnBg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Send size={18} color="#fff" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
