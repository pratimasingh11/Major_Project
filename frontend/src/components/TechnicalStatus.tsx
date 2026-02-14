"use client";

import React, { useEffect, useState } from "react";
import { Box, Typography, Card, Paper } from "@mui/material";

interface TechnicalStatusProps {
  symbol: string;
  backendUrl?: string;
}

interface PredictionResponse {
  very_short_term: string;
  short_term: string;
  mid_term: string;
  long_term: string;
  confidence: number;
}

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case "Uptrend":
      return "📈";
    case "Downtrend":
      return "📉";
    case "Sideways":
      return "➡";
    default:
      return "📊";
  }
};

const getTrendColor = (trend: string) => {
  switch (trend) {
    case "Uptrend":
      return "#4caf50";
    case "Downtrend":
      return "#f44336";
    case "Sideways":
      return "#ff9800";
    default:
      return "#757575";
  }
};

const TechnicalStatus: React.FC<TechnicalStatusProps> = ({
  symbol,
  backendUrl = "http://localhost:8000",
}) => {
  const [status, setStatus] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const isDark =
        document.documentElement.classList.contains("dark") ||
        window.matchMedia("(prefers-color-scheme: dark)").matches;
      setIsDarkMode(isDark);
    };

    checkDarkMode();

    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `${backendUrl}/api/predict?symbol=${symbol}`
        );

        const json = await res.json();
        setStatus(json);
      } catch (err) {
        console.error(err);
        setStatus(null);
      } finally {
        setLoading(false);
      }
    };
    if (symbol) fetchStatus();
  }, [symbol, backendUrl]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" mt={2}>
        <Typography color={isDarkMode ? "white" : "inherit"}>
          Loading technical analysis...
        </Typography>
      </Box>
    );

  if (!status)
    return (
      <Box mt={2}>
        <Typography color="error">No technical data available</Typography>
      </Box>
    );

  const confidence = Math.max(0, Math.min(100, status.confidence ?? 0));
  const needleAngle = -180 + (confidence / 100) * 180;

  const themeColors = {
    background: isDarkMode ? "#1a2236" : "#ffffff",
    textPrimary: isDarkMode ? "#e2e8f0" : "#2c3e50",
    textSecondary: isDarkMode ? "#94a3b8" : "#666",
    cardBackground: isDarkMode ? "#2d3748" : "white",
    borderColor: isDarkMode ? "#4a5568" : "#e2e8f0",
  };

  return (
    <Box
      display="flex"
      flexDirection={{ xs: "column", md: "row" }}
      width="100%"
      minHeight="400px"
      gap={3}
    >
      {/* LEFT */}
      <Box flex={1} minWidth={0}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            minHeight: "400px",
            background: isDarkMode
              ? "linear-gradient(135deg, #0f172a, #1e293b, #334155)"
              : "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
            color: "white",
            borderRadius: 3,
            border: `1px solid ${isDarkMode ? "#4a5568" : "transparent"}`,
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            textAlign="center"
            mb={3}
            color="white"
          >
            📊 Technical Analysis
          </Typography>

          <Box
            display="grid"
            gridTemplateColumns={{ xs: "1fr", sm: "1fr 1fr" }}
            gap={2}
          >
            {[
              { key: "very_short_term", label: "Very Short", period: "1-2 Days" },
              { key: "short_term", label: "Short Term", period: "3-7 Days" },
              { key: "mid_term", label: "Mid Term", period: "1-2 Weeks" },
              { key: "long_term", label: "Long Term", period: "1+ Month" },
            ].map(({ key, label, period }) => (
              <Card
                key={key}
                sx={{
                  p: 2,
                  background: isDarkMode
                    ? "rgba(255, 255, 255, 0.08)"
                    : "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  border: `1px solid ${
                    isDarkMode
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.2)"
                  }`,
                  textAlign: "center",
                  borderRadius: 2,
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} color="#90caf9">
                  {label}
                </Typography>
                <Typography variant="caption" color="#b0bec5">
                  {period}
                </Typography>

                <Box display="flex" justifyContent="center" mt={1}>
                  <Typography
                    variant="h4"
                    sx={{
                      color: getTrendColor(
                        status[key as keyof PredictionResponse]
                      ),
                      fontWeight: 800,
                      mr: 1,
                    }}
                  >
                    {getTrendIcon(status[key as keyof PredictionResponse])}
                  </Typography>

                  <Typography
                    variant="h6"
                    sx={{
                      color: getTrendColor(
                        status[key as keyof PredictionResponse]
                      ),
                      fontWeight: 700,
                    }}
                  >
                    {status[key as keyof PredictionResponse]}
                  </Typography>
                </Box>
              </Card>
            ))}
          </Box>

          <Typography
            variant="body2"
            textAlign="center"
            mt={3}
            color="#90caf9"
            fontStyle="italic"
          >
            Analysis based on multiple technical indicators
          </Typography>
        </Paper>
      </Box>

      {/* RIGHT — Confidence Gauge */}
      <Box flex={1} minWidth={0}>
        <Paper
          elevation={3}
          sx={{
            p: 3,
            minHeight: "400px",
            background: themeColors.cardBackground,
            borderRadius: 3,
            border: `1px solid ${themeColors.borderColor}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h5"
            fontWeight={700}
            mb={2}
            color={themeColors.textPrimary}
          >
            Confidence Level
          </Typography>

          <Box
            sx={{
              position: "relative",
              width: "100%",
              height: 320,
            }}
          >
            <svg
              width="100%"
              height="320"
              viewBox="0 0 600 320"
              preserveAspectRatio="xMidYMid meet"
            >
              {[
                { start: -180, end: -144, color: "#f44336" },
                { start: -144, end: -108, color: "#ffeb3b" },
                { start: -108, end: -72, color: "#2196f3" },
                { start: -72, end: -36, color: "#8bc34a" },
                { start: -36, end: 0, color: "#4caf50" },
              ].map((segment, i) => {
                const startRad = (segment.start * Math.PI) / 180;
                const endRad = (segment.end * Math.PI) / 180;

                const cx = 300,
                  cy = 260,
                  r = 180;

                const x1 = cx + Math.cos(startRad) * r;
                const y1 = cy + Math.sin(startRad) * r;
                const x2 = cx + Math.cos(endRad) * r;
                const y2 = cy + Math.sin(endRad) * r;

                return (
                  <path
                    key={i}
                    d={`M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`}
                    fill="none"
                    stroke={segment.color}
                    strokeWidth="30"
                  />
                );
              })}

              {[0, 20, 40, 60, 80, 100].map((value) => {
                const angle = -180 + (value / 100) * 180;
                const rad = (angle * Math.PI) / 180;

                let labelX = 300;
                let labelY = 150;

                const positions: Record<number, [number, number]> = {
                  0: [120, 310],
                  20: [160, 80],
                  40: [240, 50],
                  60: [360, 50],
                  80: [440, 80],
                  100: [480, 310],
                };

                [labelX, labelY] = positions[value];
                  //confidence level color differentiation
                return (
                  <g key={value}>
                    <line
                      x1={300 + Math.cos(rad) * 170}
                      y1={260 + Math.sin(rad) * 170}
                      x2={300 + Math.cos(rad) * 190}
                      y2={260 + Math.sin(rad) * 190}
                      stroke={isDarkMode ? "#94a3b8" : "#666"}
                      strokeWidth="3"
                    />
                    <text
                      x={labelX}
                      y={labelY}
                      fontSize={value === 0 || value === 100 ? "24" : "20"}
                      fontWeight={value === 0 || value === 100 ? "800" : "600"}
                      fill={themeColors.textPrimary}
                      textAnchor="middle"
                      alignmentBaseline="middle"
                    >
                      {value}
                    </text>
                  </g>
                );
              })}

              <line
                x1="300"
                y1="260"
                x2={300 + Math.cos((needleAngle * Math.PI) / 180) * 160}
                y2={260 + Math.sin((needleAngle * Math.PI) / 180) * 160}
                stroke={themeColors.textPrimary}
                strokeWidth="6"
                strokeLinecap="round"
              />
              <circle cx="300" cy="260" r="15" fill={themeColors.textPrimary} />
              <circle cx="300" cy="260" r="7" fill="#e91e63" />

              <text
                x="300"
                y="230"
                fontSize="30"
                fontWeight="700"
                fill={themeColors.textPrimary}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {confidence}%
              </text>
            </svg>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
};

export default TechnicalStatus;
