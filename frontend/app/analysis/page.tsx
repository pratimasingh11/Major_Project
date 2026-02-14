"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import StockChart from "@/components/StockChart";
import TechnicalStatus from "@/components/TechnicalStatus";
import {
  TrendingUp,
  BarChart3,
  Zap,
  Activity,
  LineChart,
} from "lucide-react";
import { RootState } from "@/store";
import StockChatbot from "@/components/StockChatbot";


// Backend API URL
const BACKEND_URL = "http://localhost:8000";

// Type for stock data returned by backend
interface StockData {
  close: number;
  high: number;
  low: number;
  [key: string]: any;
}

const AnalysisPage: React.FC = () => {
  //===========================
  // 1. URL Params & Theme
  //===========================
  const searchParams = useSearchParams();
  const symbolParam = searchParams.get("symbol") || "NEPSE"; // Default symbol

  const theme = useSelector((state: RootState) => state.theme.mode) || "light"; // Current theme

  
//===========================
// 2. Local State
//===========================
const [data, setData] = useState<StockData[]>([]);
const [selectedTrends, setSelectedTrends] = useState<string[]>(["EMA12", "EMA26"]);
const [timeframe, setTimeframe] = useState<string>("5Y");
const [loading, setLoading] = useState<boolean>(true);
const [mounted, setMounted] = useState<boolean>(false);
const [predictionContext, setPredictionContext] = useState<any>(undefined);


  //===========================
  // 3. Fetch Data Effects
  //===========================
  useEffect(() => {
    setMounted(true);
    fetchStockData(symbolParam, timeframe);
  }, [symbolParam, timeframe]);

  //===========================
  // 4. Fetch Stock Data
  //===========================
  const fetchStockData = async (symbol: string, tf: string): Promise<void> => {
    try {
      setLoading(true);
      const res = await fetch(`${BACKEND_URL}/api/stocks?symbol=${symbol}&timeframe=${tf}`);
      if (!res.ok) {
        setData([]);
        return;
      }
      const json = await res.json();
      setData(Array.isArray(json.records) ? json.records : []);
    } catch (err) {
      console.error("Error fetching:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };


  //===========================
  // 5. Handlers
  //===========================
  const handleFilterChange = (tf: string) => setTimeframe(tf);

  const handleToggle = (trend: string) =>
    setSelectedTrends((prev) =>
      prev.includes(trend) ? prev.filter((t) => t !== trend) : [...prev, trend]
    );

  //===========================
  // 6. Icons for trends
  //===========================
  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "EMA12":
        return <LineChart size={16} />;
      case "EMA26":
        return <TrendingUp size={16} />;
      case "BB":
        return <BarChart3 size={16} />;
      case "RSI":
        return <Activity size={16} />;
      default:
        return <BarChart3 size={16} />;
    }
  };

  const timeframeLabels: Record<string, string> = {
    "1D": "1Day",
    "1W": "1Week",
    "1M": "1Month",
    "6M": "6Month",
    "1Y": "1Year",
    "5Y": "5Year",
  };

  //===========================
  // 7. Theme Styles
  //===========================
  const isDark = theme === "dark";

  const themeStyles = {
    background: isDark ? "#111827" : "#f5f5f5",
    textPrimary: isDark ? "#f9fafb" : "#111827",
    textSecondary: isDark ? "#d1d5db" : "#6b7280",
    cardBackground: isDark ? "#1f2937" : "#ffffff",
    cardBorder: isDark ? "#374151" : "#e2e8f0",
    buttonBackground: isDark ? "#374151" : "#ffffff",
    buttonBorder: isDark ? "#4b5563" : "#cbd5e1",
    buttonText: isDark ? "#e5e7eb" : "#475569",
    chartBackground: isDark ? "#1f2937" : "#ffffff",
    hoverBackground: isDark ? "#4b5563" : "#f1f5f9",
  };

  //  Button colors MATCH chart colors (EMA12 amber, EMA26 sky, BB purple, RSI yellow)
  const indicatorStyles: Record<
    string,
    {
      activeBg: string;   // gradient for active
      inactiveBg: string; // subtle background for inactive
      border: string;
      text: string;
    }
  > = {
    EMA12: {
      activeBg: "linear-gradient(135deg, #d97706, #f59e0b)", // amber
      inactiveBg: isDark ? "rgba(245,158,11,0.15)" : "rgba(245,158,11,0.10)",
      border: isDark ? "rgba(245,158,11,0.45)" : "rgba(245,158,11,0.35)",
      text: isDark ? "#fef3c7" : "#92400e",
    },
    EMA26: {
      activeBg: "linear-gradient(135deg, #0284c7, #38bdf8)", // sky-blue
      inactiveBg: isDark ? "rgba(56,189,248,0.14)" : "rgba(56,189,248,0.10)",
      border: isDark ? "rgba(56,189,248,0.45)" : "rgba(56,189,248,0.35)",
      text: isDark ? "#e0f2fe" : "#075985",
    },
    BB: {
      activeBg: "linear-gradient(135deg, #7c3aed, #a78bfa)", // purple
      inactiveBg: isDark ? "rgba(167,139,250,0.14)" : "rgba(167,139,250,0.10)",
      border: isDark ? "rgba(167,139,250,0.45)" : "rgba(167,139,250,0.35)",
      text: isDark ? "#ede9fe" : "#5b21b6",
    },
    RSI: {
      activeBg: "linear-gradient(135deg, #f59e0b, #fbbf24)", // yellow/amber
      inactiveBg: isDark ? "rgba(251,191,36,0.14)" : "rgba(251,191,36,0.10)",
      border: isDark ? "rgba(251,191,36,0.45)" : "rgba(251,191,36,0.35)",
      text: isDark ? "#fef9c3" : "#854d0e",
    },
  };

  // fetch prediction when symbol changes
useEffect(() => {
  const fetchPrediction = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/api/predict?symbol=${symbolParam}`);
      if (!res.ok) return setPredictionContext(undefined);
      const json = await res.json();
      setPredictionContext(json);
    } catch {
      setPredictionContext(undefined);
    }
  };
  fetchPrediction();
}, [symbolParam]);

if (!mounted) return null;
  //===========================
  // 8. Render
  //===========================
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: themeStyles.background,
        color: themeStyles.textPrimary,
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <main style={{ flex: 1, padding: "20px 40px" }}>
        {/*==================== HERO SECTION ====================*/}
        <div
          style={{
            width: "100%",
            minHeight: "25vh",
            padding: "30px 20px",
            marginBottom: "30px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            background: isDark
              ? "linear-gradient(135deg, #111827 0%, #1e1e2f 100%)"
              : "linear-gradient(135deg, #e0e7ff 0%, #e2e7fc 100%)",
            color: isDark ? "#f9fafb" : "#111827",
            borderRadius: "16px",
          }}
        >
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: isDark ? "#3b82f6" : "#6366f1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "15px",
              boxShadow: isDark
                ? "0 6px 20px rgba(0,0,0,0.3)"
                : "0 4px 12px rgba(103,58,183,0.2)",
            }}
          >
            <TrendingUp size={28} color="#fff" />
          </div>

          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              marginBottom: "8px",
              background: "linear-gradient(90deg, #3b82f6 0%, #10b981 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Stock Trend Prediction System
          </h1>

          <p
            style={{
              fontSize: "1rem",
              maxWidth: "600px",
              lineHeight: 1.5,
              margin: 0,
              color: isDark ? "#d1d5db" : "#4b5563",
            }}
          >
            This system analyzes Nepal Stock Exchange data using technical indicators
            and machine learning models to identify market trends and provide predictive
            insights based on historical patterns.
          </p>
        </div>

        {/*==================== CONTAINERS: TIMEFRAME + INDICATORS ====================*/}
        <div
          style={{
            display: "flex",
            gap: "20px",
            marginBottom: "30px",
            flexWrap: "wrap",
            width: "100%",
          }}
        >
          {/* Timeframe Container */}
          <div
            style={{
              flex: 1,
              minWidth: "280px",
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: themeStyles.cardBackground,
              border: `1px solid ${themeStyles.cardBorder}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Zap size={18} color="#f59e0b" />
              <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0, color: themeStyles.textPrimary }}>
                Timeframe
              </h3>
            </div>

            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {Object.entries(timeframeLabels).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => handleFilterChange(key)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    fontWeight: 500,
                    fontSize: "14px",
                    cursor: "pointer",
                    ...(key === timeframe
                      ? {
                          background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                          color: "#fff",
                          border: "none",
                        }
                      : {
                          backgroundColor: themeStyles.buttonBackground,
                          color: themeStyles.buttonText,
                          border: `1px solid ${themeStyles.buttonBorder}`,
                        }),
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/*==================== TECHNICAL INDICATORS CONTAINER ====================*/}
          <div
            style={{
              flex: 1,
              minWidth: "280px",
              padding: "16px",
              borderRadius: "12px",
              backgroundColor: themeStyles.cardBackground,
              border: `1px solid ${themeStyles.cardBorder}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <Activity size={18} color="#06b6d4" />
              <h3 style={{ fontSize: "16px", fontWeight: 600, margin: 0, color: themeStyles.textPrimary }}>
                Technical Indicators
              </h3>
            </div>

            {/* Colored buttons matching chart colors (VOLUME removed) */}
            <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {["EMA12", "EMA26", "BB", "RSI"].map((trend) => {
                const active = selectedTrends.includes(trend);
                const s = indicatorStyles[trend];

                return (
                  <button
                    key={trend}
                    onClick={() => handleToggle(trend)}
                    style={{
                      padding: "10px 16px",
                      borderRadius: "10px",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      transition: "all 0.2s ease",
                      userSelect: "none",

                      ...(active
                        ? {
                            background: s.activeBg,
                            color: "#fff",
                            border: "none",
                            boxShadow: isDark
                              ? "0 10px 22px rgba(0,0,0,0.35)"
                              : "0 10px 18px rgba(0,0,0,0.14)",
                            transform: "translateY(-1px)",
                          }
                        : {
                            backgroundColor: s.inactiveBg,
                            color: s.text,
                            border: `1px solid ${s.border}`,
                          }),
                    }}
                  >
                    {getTrendIcon(trend)}
                    {trend}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/*==================== MARKET TREND STATUS ====================*/}
        {data.length > 0 && (
          <div style={{ marginBottom: "20px", display: "flex", gap: "12px", alignItems: "center", paddingLeft: "10px" }}>
            <span style={{ fontSize: "14px", fontWeight: 600, color: themeStyles.textSecondary }}>
              Market Trend:
            </span>

            <span
              style={{
                padding: "6px 16px",
                borderRadius: "20px",
                fontSize: "14px",
                fontWeight: 600,
                border: `1px solid ${
                  data[data.length - 1]?.close > data[0]?.close
                    ? isDark
                      ? "rgba(34,197,94,0.4)"
                      : "rgba(34,197,94,0.3)"
                    : isDark
                    ? "rgba(239,68,68,0.4)"
                    : "rgba(239,68,68,0.3)"
                }`,
                backgroundColor:
                  data[data.length - 1]?.close > data[0]?.close
                    ? isDark
                      ? "rgba(34,197,94,0.2)"
                      : "rgba(34,197,94,0.1)"
                    : isDark
                    ? "rgba(239,68,68,0.2)"
                    : "rgba(239,68,68,0.1)",
                color: data[data.length - 1]?.close > data[0]?.close ? "#16a34a" : "#dc2626",
              }}
            >
              {data[data.length - 1]?.close > data[0]?.close ? "📈 Bullish Trend" : "📉 Bearish Trend"}
            </span>
          </div>
        )}

        {/*==================== CHART + TECHNICAL STATUS ====================*/}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 700px", minHeight: "600px" }}>
            <div
              style={{
                flex: 1,
                backgroundColor: themeStyles.chartBackground,
                borderRadius: "12px",
                padding: "20px",
                border: `1px solid ${themeStyles.cardBorder}`,
                minHeight: "550px",
              }}
            >
              <div
                style={{
                  marginBottom: "15px",
                  paddingBottom: "10px",
                  borderBottom: `1px solid ${themeStyles.cardBorder}`,
                }}
              >
                <h3 style={{ fontSize: "18px", fontWeight: 600, margin: 0 }}>
                  <BarChart3 size={20} color="#3b82f6" /> {symbolParam} Price Chart
                </h3>
              </div>

              <div style={{ minHeight: "450px" }}>
                {loading ? (
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          width: "40px",
                          height: "40px",
                          border: `3px solid ${isDark ? "#374151" : "#f1f5f9"}`,
                          borderTop: "3px solid #3b82f6",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      ></div>
                      <p style={{ marginTop: "12px", color: themeStyles.textSecondary }}>
                        Loading chart data...
                      </p>
                    </div>
                  </div>
                ) : (
                  <StockChart data={data} selectedTrends={selectedTrends} />
                )}
              </div>
            </div>
          </div>

          <div style={{ flex: 1, minWidth: "48%" }}>
            <TechnicalStatus symbol={symbolParam} />
          </div>
        </div>
      </main>

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
       {/* CHATBOT GOES HERE */}
       <StockChatbot
  symbol={symbolParam}
  data={data}
  theme={theme as "light" | "dark"}
  predictionContext={predictionContext}
/>
    </div>
    
  );
};

export default AnalysisPage;
