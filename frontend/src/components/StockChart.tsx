"use client";
import React, { useEffect, useState } from "react";
import { ChartCanvas, Chart } from "react-financial-charts";
import { CandlestickSeries, LineSeries, BarSeries, AreaSeries } from "@react-financial-charts/series";
import { XAxis, YAxis } from "@react-financial-charts/axes";
import { CrossHairCursor, MouseCoordinateX, MouseCoordinateY } from "@react-financial-charts/coordinates";
import { discontinuousTimeScaleProvider } from "@react-financial-charts/scales";
import { timeFormat } from "d3-time-format";
import { useTheme } from "@mui/material";

interface StockChartProps {
  data: any[];
  selectedTrends: string[];
}

const StockChart: React.FC<StockChartProps> = ({ data, selectedTrends }) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [width, setWidth] = useState<number>(900);

  useEffect(() => {
    const onResize = () =>
      setWidth(Math.max(600, Math.min(window.innerWidth - 120, 1400)));
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (!data || data.length === 0) return <div>No data available</div>;

  const formattedData = data
    .map((d) => ({
      ...d,
      date: d.date ? new Date(d.date) : null,
      open: d.open !== null ? +d.open : null,
      high: d.high !== null ? +d.high : null,
      low: d.low !== null ? +d.low : null,
      close: d.close !== null ? +d.close : null,
      volume: d.volume !== null ? +d.volume : null,
      EMA12: d.EMA12 !== undefined ? +d.EMA12 : undefined,
      EMA26: d.EMA26 !== undefined ? +d.EMA26 : undefined,
      BB_UPPER: d.BB_UPPER !== undefined ? +d.BB_UPPER : undefined,
      BB_LOWER: d.BB_LOWER !== undefined ? +d.BB_LOWER : undefined,
      BB_MA20: d.BB_MA20 !== undefined ? +d.BB_MA20 : undefined,
      RSI14: d.RSI14 !== undefined ? +d.RSI14 : undefined,
    }))
    .filter((d) => d.date !== null);

  if (formattedData.length === 0) return <div>No valid dates available</div>;

  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor((d: any) => d.date);
  const { data: chartData, xScale, xAccessor, displayXAccessor } = xScaleProvider(formattedData);

  const showVolume =
    selectedTrends.includes("VOLUME") && chartData.some((d: any) => d.volume !== null);

  const showRSI =
    selectedTrends.includes("RSI") && chartData.some((d: any) => d.RSI14 !== null);

  const mainHeight = showRSI ? 380 : 450;
  const volumeHeight = showVolume ? 80 : 0;
  const rsiHeight = showRSI ? 120 : 0;
  const totalHeight = mainHeight + volumeHeight + rsiHeight + 50;

  // Theme colors (clear + distinct)
  const colors = {
    up: isDark ? "#22c55e" : "#16a34a",
    down: isDark ? "#ef4444" : "#dc2626",

    // Trend line colors (distinct)
    EMA12: isDark ? "#f59e0b" : "#d97706", // amber
    EMA26: isDark ? "#38bdf8" : "#0284c7", // sky-blue

    // Bollinger Band colors
    BB_UPPER: isDark ? "#a78bfa" : "#7c3aed", // purple
    BB_LOWER: isDark ? "#fb7185" : "#e11d48", // rose/red
    BB_MA20: isDark ? "#34d399" : "#059669", // green-teal

    // RSI
    RSI_LINE: isDark ? "#fbbf24" : "#f59e0b", // yellow/amber
    RSI_FILL: isDark ? "rgba(251, 191, 36, 0.25)" : "rgba(245, 158, 11, 0.18)",

    // Volume
    volume: isDark ? "#64748b" : "#94a3b8",

    // Background/Grid
    bg: isDark ? "#0b1220" : "#ffffff",
    grid: isDark ? "#243041" : "#e5e7eb",
    text: isDark ? "#e5e7eb" : "#111827",
  };

  return (
    <ChartCanvas
      height={totalHeight}
      width={width}
      ratio={typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1}
      margin={{ left: 60, right: 60, top: 10, bottom: 30 }}
      data={chartData}
      seriesName="NEPSE"
      xScale={xScale}
      xAccessor={xAccessor}
      displayXAccessor={displayXAccessor}
      style={{ background: colors.bg }}
    >
      {/* Main chart */}
      <Chart id={1} yExtents={(d: any) => [d.high, d.low, d.BB_UPPER, d.BB_LOWER, d.EMA12, d.EMA26]}>
        <XAxis showGridLines stroke={colors.grid} />
        <YAxis showGridLines stroke={colors.grid} />
        <MouseCoordinateX displayFormat={timeFormat("%Y-%m-%d")} />
        <MouseCoordinateY displayFormat={(y) => y.toFixed(2)} />

        <CandlestickSeries
          fill={(d: any) => (d.close > d.open ? colors.up : colors.down)}
          wickStroke={(d: any) => (d.close > d.open ? colors.up : colors.down)}
          candleStrokeWidth={1.5}
        />

        {/* Overlays (IMPORTANT: use strokeStyle, not stroke) */}
        {selectedTrends.includes("EMA12") && (
          <LineSeries
            yAccessor={(d: any) => d.EMA12}
            strokeStyle={colors.EMA12}
            strokeWidth={2}
          />
        )}

        {selectedTrends.includes("EMA26") && (
          <LineSeries
            yAccessor={(d: any) => d.EMA26}
            strokeStyle={colors.EMA26}
            strokeWidth={2}
          />
        )}

        {selectedTrends.includes("BB") && (
          <>
            <LineSeries
              yAccessor={(d: any) => d.BB_UPPER}
              strokeStyle={colors.BB_UPPER}
              strokeWidth={1.6}
            />
            <LineSeries
              yAccessor={(d: any) => d.BB_LOWER}
              strokeStyle={colors.BB_LOWER}
              strokeWidth={1.6}
            />
            <LineSeries
              yAccessor={(d: any) => d.BB_MA20}
              strokeStyle={colors.BB_MA20}
              strokeWidth={1.8}
            />
          </>
        )}
      </Chart>

      {/* Volume (still supported, but your button is removed in AnalysisPage) */}
      {showVolume && (
        <Chart id={2} height={volumeHeight} yExtents={(d: any) => d.volume}>
          <YAxis showGridLines={false} stroke={colors.grid} />
          <BarSeries yAccessor={(d: any) => d.volume} fillStyle={colors.volume} opacity={0.6} />
        </Chart>
      )}

      {/* RSI */}
      {showRSI && (
        <Chart id={3} height={rsiHeight} yExtents={[0, 100]}>
          <XAxis stroke={colors.grid} />
          <YAxis stroke={colors.grid} />
          <AreaSeries
            yAccessor={(d: any) => d.RSI14}
            fillStyle={colors.RSI_FILL}
            strokeStyle={colors.RSI_LINE}
            strokeWidth={2}
          />
        </Chart>
      )}

      <CrossHairCursor stroke={isDark ? "#f97316" : "#3b82f6"} />
    </ChartCanvas>
  );
};

export default StockChart;
