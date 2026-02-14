"use client";
import React, { useState } from "react";
import { SvgIconProps } from "@mui/material/SvgIcon";
import {
  Box,
  Container,
  Typography,
  Grid,
  Stack,
  useTheme,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton,
} from "@mui/material";
import { motion, Variants } from "framer-motion";
import {
  School,
  TrendingUp,
  CandlestickChart,
  ShowChart,
  Psychology,
  Speed,
  BarChart,
  WarningAmber,
  Add,
} from "@mui/icons-material";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (custom: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: custom * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

const SectionCard = ({
  icon,
  title,
  content,
  index,
}: {
  icon: React.ReactNode;
  title: string;
  content: string;
  index: number;
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeUp}
      custom={index}
      style={{ height: "100%", width: "100%" }}
    >
      <Accordion
        expanded={expanded}
        onChange={() => {}} // Disable default accordion behavior
        square
        sx={{
          borderRadius: 4,
          bgcolor: "transparent",
          boxShadow: "none",
          "&:before": { display: "none" },
          "&.Mui-expanded": {
            borderRadius: 4,
            boxShadow: isDark
              ? "0 15px 40px rgba(106,27,154,0.4)"
              : "0 12px 30px rgba(103,58,183,0.25)",
          },
        }}
      >
        <AccordionSummary
        component="div"
  expandIcon={null}
  sx={{
  minHeight: 120,
  px: 3,
  py: 3,
  borderRadius: expanded ? "16px 16px 0 0" : 4,
  bgcolor: isDark ? "#1e1e2f" : "#ffffff",
  border: isDark
    ? "1px solid #2e2e3f"
    : "1px solid rgba(103,58,183,0.1)",
  borderBottom: expanded ? "none" : undefined,
  cursor: "default",
  "& .MuiAccordionSummary-content": {
    m: 0,
    alignItems: "center",
  },
}}

>

          <Stack direction="row" spacing={3} sx={{ width: "100%", alignItems: "center" }}>
            {/* Icon + Title - Left Side */}
            <Stack spacing={2} alignItems="center" sx={{ flex: 1 }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: isDark ? "#6a1b9a" : "#7b5cf5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: isDark
                    ? "0 6px 20px rgba(0,0,0,0.25)"
                    : "0 4px 12px rgba(103,58,183,0.15)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                    boxShadow: isDark
                      ? "0 10px 28px rgba(106,27,154,0.4)"
                      : "0 8px 20px rgba(103,58,183,0.25)",
                  },
                }}
              >
                {React.isValidElement(icon)
                  ? React.cloneElement(icon as React.ReactElement<any>, {
                      fontSize: "large",
                      htmlColor: "#fff",
                    })
                  : icon}
              </Box>
              <Typography
                variant="h6"
                fontWeight={800}
                color={isDark ? "grey.100" : "text.primary"}
                textAlign="center"
              >
                {title}
              </Typography>
            </Stack>

            {/* Custom Plus Button - Right Side */}
            <motion.div animate={{ rotate: expanded ? 45 : 0 }} transition={{ duration: 0.3 }}>
              <IconButton
              component="span"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent accordion default click
                  setExpanded(!expanded);
                }}
                sx={{
                  width: 44,
                  height: 44,
                  bgcolor: isDark ? "#6a1b9a" : "#7b5cf5",
                  color: "#fff",
                  borderRadius: "50%",
                  boxShadow: isDark
                    ? "0 6px 20px rgba(106,27,154,0.4)"
                    : "0 4px 12px rgba(103,58,183,0.2)",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: isDark ? "#8b3faf" : "#9333ea",
                    transform: "scale(1.1)",
                    boxShadow: isDark
                      ? "0 12px 30px rgba(106,27,154,0.6)"
                      : "0 8px 20px rgba(103,58,183,0.3)",
                  },
                }}
              >
                <Add />
              </IconButton>
            </motion.div>
          </Stack>
        </AccordionSummary>

<AccordionDetails
  sx={{
    px: 3,
    pt: 2,        // ⬅ reduced top gap
    pb: 3,        // ⬅ reduced bottom gap
    bgcolor: isDark ? "#1e1e2f" : "#ffffff",
    borderTop: isDark
      ? "1px solid #2e2e3f"
      : "1px solid rgba(103,58,183,0.1)",
    borderRadius: "0 0 16px 16px",
  }}
>

 

  <Typography
    color={isDark ? "grey.200" : "text.primary"}
    lineHeight={1.9}
    textAlign="justify"
    sx={{
      whiteSpace: "pre-line",
      fontSize: { xs: "1rem", md: "1.15rem" },
    // ⬆ increased font size
      fontWeight: 500,        // ⬆ more bold
    }}
  >
    {content}
  </Typography>
</AccordionDetails>


      </Accordion>
    </motion.div>
  );
};

export default function LearnPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  return (
    <Box>
      {/* HERO SECTION */}
      <Box
        sx={{
          py: 12,
          background: isDark
            ? "linear-gradient(135deg, #1e1e2f, #151528)"
            : "linear-gradient(135deg, #afdbf9, #d4bcfa)",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h2"
              fontWeight={900}
              mb={2}
              color={isDark ? "grey.100" : "text.primary"}
              textAlign="center"
              sx={{ fontSize: { xs: "2rem", md: "2.6rem" } }}
            >
              Learn & Understand Stock Market
            </Typography>

            <Typography
              variant="h6"
              color={isDark ? "grey.400" : "text.secondary"}
              maxWidth={750}
              mx="auto"
              textAlign="center"
              sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, lineHeight: 1.6 }}
            >
              Explore how stocks work, understand market behavior, and learn
              the key principles of trading with easy explanations and visual guides.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* CONTENT SECTION */}
      <Box
        sx={{
          py: 10,
          width: "100%",
          background: isDark ? "#151528" : "#f1f9f3",
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            {[
              {
                icon: <School />,
                title: "What is the Stock Market?",
                content:
                  "A stock market is a place where investors buy and sell shares of companies. Each share represents ownership in a company. Prices change daily depending on company performance, demand and supply, and economic events. Beginners can start by learning small investments and observing market trends before trading.",
              },
              {
                icon: <TrendingUp />,
                title: "Why Stock Prices Go Up or Down",
                content:
                  "Stock prices rise when more investors want to buy than sell and fall when selling dominates. Influencing factors include company profits, market sentiment, global and local economic news, investor psychology, and trading volume. Understanding these factors helps beginners make informed decisions.",
              },
              {
                icon: <CandlestickChart />,
                title: "Understanding Candlestick Charts",
                content:
                  "Candlestick charts show price movement over a period. Each candle has an open, close, high, and low price. Green/white candles indicate price increase, red/black candles indicate decrease. Beginners can use these charts to see patterns, trends, and market momentum visually.",
              },
              {
                icon: <ShowChart />,
                title: "Technical Indicators Explained",
                content:
                  "Technical indicators are calculations based on price, volume, and historical data to help traders make informed decisions. Key indicators include:\n\n" +
                  "•EMA (Exponential Moving Average)– shows the trend direction by giving more weight to recent prices, helping identify momentum.\n" +
                  "•RSI (Relative Strength Index) – measures overbought or oversold conditions, indicating potential trend reversals.\n" +
                  "•Bollinger Bands– display price volatility and potential support/resistance levels.\n" +
                  "•Volume – tracks the number of shares traded, confirming the strength of price movements.",
              },
              {
                icon: <BarChart />,
                title: "Top Gainers and Top Losers",
                content:
                  "Top gainers are stocks with the highest price increase in a day; top losers are the opposite. This helps beginners quickly spot strong and weak performers. Observing these lists can provide insights into market trends and investment opportunities.",
              },
              {
                icon: <Psychology />,
                title: "Logic Behind Gainers & Losers",
                content:
                  "Our system compares today's price with previous prices to calculate percentage changes. Stocks with high positive changes are labeled as gainers, while high negative changes are losers. Volume and market momentum are also considered. Beginners can use this to track which stocks are trending.",
              },
              {
                icon: <Speed />,
                title: "AI Trend & Confidence Score",
                content:
                  "The confidence score measures how strongly multiple indicators agree on a stock trend. A high score indicates strong alignment among EMA, RSI, volume, and price direction. Beginners can use this as a guide to understand the reliability of a predicted trend.",
              },
              {
                icon: <WarningAmber />,
                title: "Important Note for Beginners",
                content:
                  "Stock predictions are not guaranteed. Always combine analysis with personal research, risk management, and small investments first. Use this platform to learn, practice, and gain confidence without risking significant capital.",
              },
            ].map((item, index) => (
              <Grid key={item.title} item xs={12} md={6}>
                <SectionCard
                  icon={item.icon}
                  title={item.title}
                  content={item.content}
                  index={index}
                />
              </Grid>
            ))}
          </Grid>

          {/* COMMON STOCK PATTERNS SECTION */}
          <Box sx={{ py: 10 }}>
            <Typography
              variant="h4"
              fontWeight={800}
              mb={6}
              color={isDark ? "grey.100" : "text.primary"}
              textAlign="center"
              sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" } }}
            >
              Common Stock Patterns & Signals
            </Typography>

            <Grid container spacing={5}>
              {[
                {
                  title: "Head & Shoulders",
                  icon: <ShowChart />,
                  content:
                    "The Head and Shoulders pattern in the stock market is a key technical analysis formation signaling a potential trend reversal, typically from bullish to bearish, featuring three peaks: a left shoulder, a higher head, and a lower right shoulder, connected by a neckline with a break below it confirming a downward price move. An Inverse Head and Shoulders signals a bullish reversal from a downtrend. It helps traders identify trend changes and set price targets and stop-loss levels.",
                },
                {
                  title: "Double Top / Double Bottom",
                  icon: <TrendingUp />,
                  content:
                    "Double tops (M shape) and double bottoms (W shape) are key technical analysis chart patterns signaling potential trend reversals: a double top suggests an uptrend ending and a downtrend starting, while a double bottom indicates a downtrend ending and an uptrend beginning; both are confirmed when the price breaks below the neckline (the trough between the two peaks/lows) for a double top, or above it for a double bottom, showing buyer/seller exhaustion.",
                },
                {
                  title: "Support & Resistance",
                  icon: <BarChart />,
                  content:
                    "Support and resistance are key technical analysis levels where buying (support) or selling (resistance) pressure often stops or reverses a stock's price, acting as a price floor (support) and ceiling (resistance) based on supply/demand psychology, helping traders find entry/exit points, with strong levels being hit multiple times before breaking, signaling new trends.",
                },
                {
                  title: "Breakouts",
                  icon: <Speed />,
                  content:
                    "Mastering Breakout Trading: Key Strategies for SuccessA stock market breakout is when a stock's price moves decisively past a key support or resistance level, breaking its established trading range, often signaling the start of a strong new trend, confirmed by a surge in trading volume. Traders look for upside breakouts (above resistance) or downside breakouts (below support) to enter positions, aiming to capture momentum, but must watch for fakeouts where the price quickly reverses.",
                },
              ].map((item, index) => (
                <Grid key={item.title} item xs={12} md={6}>
                  <SectionCard
                    icon={item.icon}
                    title={item.title}
                    content={item.content}
                    index={index + 8}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider sx={{ my: 8, borderColor: isDark ? "#2e2e3f" : "#d1d5db" }} />

          <Typography
            variant="body1"
            color={isDark ? "grey.400" : "text.secondary"}
            textAlign="center"
            maxWidth={900}
            mx="auto"
            sx={{ fontSize: "1.1rem" }}
          >
            This learning page provides a beginner-friendly guide to understand stock market fundamentals, charts, indicators, and AI-assisted trend predictions.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}