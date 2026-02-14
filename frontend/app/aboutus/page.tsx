"use client";
import React from "react";
import { SvgIconProps } from "@mui/material/SvgIcon";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  Chip,
  Avatar,
  Stack,
  Button,
  useTheme,
} from "@mui/material";
import { motion, Variants } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { WarningAmber } from "@mui/icons-material";

import {
  Groups,
  ShowChart,
  Lightbulb,
  Description,
  School,
} from "@mui/icons-material";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 1) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

export default function AboutUsPage() {
  const theme = useTheme();
  const router = useRouter();
  const isDark = theme.palette.mode === "dark";

  const textColor = isDark ? "#fff" : "#000";
  const textSecondary = isDark ? "#aaa" : "#555";

  return (
    <Box sx={{ background: isDark ? "#0f0f1a" : "#f4f5ff", minHeight: "100vh", pb: 12 }}>
      {/* HERO */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: isDark
            ? "linear-gradient(135deg, #151528, #1e1e2f)"
            : "linear-gradient(135deg, #a8bdf6, #da9df873)",
          textAlign: "center",
        }}
      >
        <Container maxWidth="lg">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <Typography
              variant="h2"
              fontWeight={900}
              mb={3}
              sx={{ color: textColor, fontSize: { xs: "2.2rem", md: "2.8rem" } }}
            >
              FinSight: Stock Trend Prediction System
            </Typography>

            <Typography
              variant="h6"
              color={textSecondary}
              maxWidth={800}
              mx="auto"
              sx={{ fontSize: { xs: "1rem", md: "1.1rem" }, lineHeight: 1.6 }}
            >
              AI-powered platform for analyzing Nepali stock market trends using machine learning and historical NEPSE data. 
              Designed to provide both educational insights and practical data analysis experience for students.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 8 }}>
        {/* PROJECT OVERVIEW */}
        <Card
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            mb: 8,
            borderRadius: 4,
            overflow: "hidden",
          }}
        >
          <Box sx={{ flex: 1, position: "relative", minHeight: 400 }}>
            <Image src="/assets/stock-dashboard.jpeg" alt="Dashboard" fill style={{ objectFit: "cover" }} />
          </Box>
          <Box sx={{ flex: 1, p: { xs: 4, md: 6 } }}>
            <Typography variant="h4" fontWeight={700} mb={3} sx={{ color: textColor }}>
              Project Overview
            </Typography>
            <Stack spacing={2}>
              <Typography color={textSecondary}>• AI-driven stock trend prediction system</Typography>
              <Typography color={textSecondary}>• Uses historical NEPSE data for analysis</Typography>
              <Typography color={textSecondary}>• Visualizes EMA, RSI, and Bollinger Bands</Typography>
              <Typography color={textSecondary}>• Designed for learning and exploration</Typography>
              <Typography color={textSecondary}>• Encourages data-driven understanding</Typography>
            </Stack>
          </Box>
        </Card>

{/* WHO THIS PLATFORM IS FOR & WHY FINSIGHT */}
<Grid container spacing={4} mb={8}>
  {/* WHO THIS PLATFORM IS FOR */}
  <Grid item xs={12} md={6}>
    <Box
      sx={{
        p: "2px",
        borderRadius: 5,
        background:
          "linear-gradient(135deg, #7b2ff7, #9f44d3, #ff6ec4)",
        height: "100%",
      }}
    >
      <Card
        sx={{
          p: 4,
          height: "100%",
          borderRadius: 4,
          background: isDark
            ? "rgba(20,20,40,0.85)"
            : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 16px 40px rgba(123,47,247,0.35)",
          transition: "0.45s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 24px 60px rgba(255,110,196,0.45)",
          },
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <Groups sx={{ fontSize: 42, mr: 2, color: "#ff6ec4" }} />
          <Typography variant="h4" fontWeight={800} sx={{ color: textColor }}>
            Who This Platform Is For
          </Typography>
        </Box>

        <Stack spacing={2.2}>
          <Typography color={textSecondary}>
            🎓 Students learning stock markets and financial analytics
          </Typography>
          <Typography color={textSecondary}>
            📊 Beginners exploring technical indicators visually
          </Typography>
          <Typography color={textSecondary}>
            🤖 Learners studying machine learning in finance
          </Typography>
          <Typography color={textSecondary}>
            🇳🇵 Individuals analyzing NEPSE market patterns
          </Typography>
        </Stack>
      </Card>
    </Box>
  </Grid>

  {/* WHY FINSIGHT */}
  <Grid item xs={12} md={6}>
    <Box
      sx={{
        p: "2px",
        borderRadius: 5,
        background:
          "linear-gradient(135deg, #00c6ff, #0072ff, #6a11cb)",
        height: "100%",
      }}
    >
      <Card
        sx={{
          p: 4,
          height: "100%",
          borderRadius: 4,
          background: isDark
            ? "rgba(18,25,40,0.85)"
            : "rgba(255,255,255,0.92)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 16px 40px rgba(0,114,255,0.35)",
          transition: "0.45s ease",
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 24px 60px rgba(0,198,255,0.45)",
          },
        }}
      >
        <Box display="flex" alignItems="center" mb={3}>
          <Lightbulb sx={{ fontSize: 42, mr: 2, color: "#00c6ff" }} />
          <Typography variant="h4" fontWeight={800} sx={{ color: textColor }}>
            Why FinSight
          </Typography>
        </Box>

        <Stack spacing={2.2}>
          <Typography color={textSecondary}>
            📈 Built using real historical NEPSE market data
          </Typography>
          <Typography color={textSecondary}>
            🧠 Integrates technical indicators with ML-based analysis
          </Typography>
          <Typography color={textSecondary}>
            🎯 Focused on learning and analysis, not trading execution
          </Typography>
          <Typography color={textSecondary}>
            🔍 Emphasizes transparency through charts and indicators
          </Typography>
          <Typography color={textSecondary}>
            📚 Designed to support academic understanding and research
          </Typography>
        </Stack>
      </Card>
    </Box>
  </Grid>
</Grid>




        {/* MISSION */}
       <Card
  sx={{
    display: "flex",
    flexDirection: { xs: "column", md: "row" },
    mb: 8,
    borderRadius: 4,
    boxShadow: isDark
      ? "0 12px 36px rgba(106,27,154,0.3)"
      : "0 6px 24px rgba(103,58,183,0.15)",
    transition: "0.4s",
    "&:hover": { transform: "scale(1.02)", boxShadow: isDark ? "0 18px 50px rgba(106,27,154,0.45)" : "0 12px 36px rgba(103,58,183,0.25)" },
  }}
>
  <Box sx={{ flex: 1, p: { xs: 4, md: 6 } }}>
    <Typography variant="h4" fontWeight={700} mb={2} sx={{ color: textColor }}>Our Mission</Typography>
    <Stack spacing={2}>
      <Typography color={textSecondary}>• AI-powered stock market learning</Typography>
      <Typography color={textSecondary}>• Risk-free understanding of trading concepts</Typography>
      <Typography color={textSecondary}>• Bridge theory and practice with real NEPSE data</Typography>
      <Typography color={textSecondary}>• Encourage data-driven financial decisions</Typography>
      <Typography color={textSecondary}>• Hands-on ML experience & data visualization</Typography>
    </Stack>
  </Box>
  <Box sx={{ flex: 1, position: "relative", minHeight: 400 }}>
    <Image src="/assets/mission.jpeg" alt="Mission" fill style={{ objectFit: "cover", borderRadius: 4 }} />
  </Box>
</Card>


        {/* VISION */}
        <Card
  sx={{
    display: "flex",
    flexDirection: { xs: "column", md: "row-reverse" },
    mb: 8,
    borderRadius: 4,
    boxShadow: isDark
      ? "0 12px 36px rgba(106,27,154,0.3)"
      : "0 6px 24px rgba(103,58,183,0.15)",
    transition: "0.4s",
    "&:hover": { transform: "scale(1.02)", boxShadow: isDark ? "0 18px 50px rgba(106,27,154,0.45)" : "0 12px 36px rgba(103,58,183,0.25)" },
  }}
>
  <Box sx={{ flex: 1, p: { xs: 4, md: 6 } }}>
    <Typography variant="h4" fontWeight={700} mb={2} sx={{ color: textColor }}>Our Vision</Typography>
    <Stack spacing={2}>
      <Typography color={textSecondary}>• Become a learning hub for stock market analytics in Nepal</Typography>
      <Typography color={textSecondary}>• Empower students with ML skills</Typography>
      <Typography color={textSecondary}>• Promote financial literacy and data-driven decisions</Typography>
      <Typography color={textSecondary}>• Provide an interactive, hands-on educational platform for stock analysis</Typography>
      <Typography color={textSecondary}>• Encourage practical data science application</Typography>
    </Stack>
  </Box>
  <Box sx={{ flex: 1, position: "relative", minHeight: 400 }}>
    <Image src="/assets/vision.jpeg" alt="Vision" fill style={{ objectFit: "cover", borderRadius: 4 }} />
  </Box>
</Card>


        {/* HOW SYSTEM WORKS */}
        <Grid container spacing={4} mb={10} alignItems="stretch" justifyContent="center">
  {[
    {
      title: "Data Collection",
      icon: <Description sx={{ fontSize: 36, color: "#fff" }} />,
      desc: "We collect historical NEPSE data and clean it for accurate analysis.",
      points: ["Daily and monthly stock prices",  "Trading volume and price history", "Market indices trends"],
    },
    {
      title: "ML & Indicators",
      icon: <ShowChart sx={{ fontSize: 36, color: "#fff" }} />,
      desc: "Combine technical indicators with machine learning models for predictions.",
      points: ["RSI, EMA, Bollinger Bands", "LSTM and other trend prediction models", "Feature engineering for better accuracy"],
    },
    {
      title: "Insights & Visualization",
      icon: <Lightbulb sx={{ fontSize: 36, color: "#fff" }} />,
      desc: "Provide actionable insights and visual trends to users.",
      points: ["Trend charts and signals", "User-friendly visual interface", "Educational explanations for beginners"],
    },
  ].map((item, i) => (
    <Grid key={item.title} item xs={12} sm={6} md={4}>
      <motion.div
        style={{ flex: 1, height: "100%" }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        custom={i}
      >
        <Card
          sx={{
            p: 4,
            borderRadius: 4,
            height: "100%",
            textAlign: "center",
            background: isDark 
              ? "linear-gradient(145deg, #1a1a2e, #22223b)"
              : "linear-gradient(145deg, #fff, #f0f0ff)",
            boxShadow: isDark 
              ? "0 10px 30px rgba(106,27,154,0.4)" 
              : "0 6px 20px rgba(103,58,183,0.2)",
            border: "1px solid transparent",
            cursor: "pointer",
            transition: "0.4s",
            "&:hover": {
              boxShadow: isDark 
                ? "0 15px 40px rgba(106,27,154,0.6)" 
                : "0 12px 35px rgba(103,58,183,0.35)",
              transform: "scale(1.05)",
              border: "1px solid rgba(106,27,154,0.5)",
            },
          }}
        >
         <Box
  sx={{
    width: 64,
    height: 64,
    borderRadius: "50%",
    bgcolor: isDark
      ? "linear-gradient(135deg, #6a1b9a, #2196f3)"
      : "#6a1b9a", // solid purple in light mode
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    mx: "auto",
    mb: 2,
    boxShadow: isDark
      ? "0 6px 18px rgba(0,0,0,0.2)"
      : "0 4px 12px rgba(0,0,0,0.1)",
    transition: "0.3s",
    "&:hover": { transform: "scale(1.15)", boxShadow: "0 10px 28px rgba(0,0,0,0.25)" },
  }}
>
  {React.isValidElement(item.icon) &&
  React.cloneElement(item.icon as React.ReactElement<SvgIconProps>, {
    fontSize: "large",  // now TypeScript knows it's valid
    htmlColor: "#fff",
  })}
</Box>




          <Typography fontWeight={700} mt={1} mb={1} sx={{ color: textColor }}>
            {item.title}
          </Typography>
          <Typography color={textSecondary} mb={1}>
            {item.desc}
          </Typography>

          <Stack
            spacing={0.5}
            mt={1}
            sx={{ width: "100%", maxWidth: 260, mx: "auto", alignItems: "flex-start" }}
          >
            {item.points.map((p, idx) => (
              <Typography key={idx} color={textSecondary} variant="body2" sx={{ textAlign: "left" }}>
                • {p}
              </Typography>
            ))}
          </Stack>
        </Card>
      </motion.div>
    </Grid>
  ))}
</Grid>

{/* CTA */}
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
          <Card
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              textAlign: "center",
              mb: 8,
              background: "linear-gradient(135deg, #6a1b9a, #2196f3)",
              color: "#fff",
            }}
          >
            <Typography variant="h4" fontWeight={700} mb={2}>
              Learn & Explore the Stock Market
            </Typography>
            <Typography mb={4} maxWidth={700} mx="auto">
              Understand stock market concepts, indicators, and how FinSight works
              through our learning section.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
              <Button
                variant="contained"
                onClick={() => router.push("/analysis")}
                sx={{ background: "#fff", color: "#6a1b9a", fontWeight: 600 }}
              >
                Try Prediction System
              </Button>
              <Button
                variant="outlined"
                onClick={() => router.push("/learn")}
                sx={{ borderColor: "#fff", color: "#fff", fontWeight: 600 }}
              >
                Explore Stock Learning
              </Button>
            </Stack>
          </Card>
          {/* DISCLAIMER */}
<Box
  mt={10}
  mb={4}
  px={2}
  display="flex"
  justifyContent="center"
>
  <Box
    sx={{
      maxWidth: 1000,
      width: "100%",
      p: "2px",
      borderRadius: 4,
      background:
        "linear-gradient(135deg, #ff9800, #f44336, #9c27b0)",
    }}
  >
    <Card
      sx={{
        p: 3,
        borderRadius: 3,
        background: isDark
          ? "rgba(20,20,30,0.9)"
          : "rgba(255,255,255,0.95)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 10px 30px rgba(244,67,54,0.25)",
      }}
    >
      <Box display="flex" alignItems="center" mb={1.5}>
        <WarningAmber sx={{ color: "#ff9800", mr: 1.5, fontSize: 28 }} />
        <Typography variant="h6" fontWeight={700} sx={{ color: textColor }}>
          Disclaimer
        </Typography>
      </Box>

      <Typography
        variant="body2"
        sx={{ color: textSecondary, lineHeight: 1.8 }}
      >
        This platform is developed strictly for educational and analytical
        purposes. The information, visualizations, and predictions provided
        are not intended to be used as financial advice or as a basis for
        making investment decisions. This system does not support, recommend,
        or facilitate the buying or selling of securities. 
      </Typography>
    </Card>
  </Box>
</Box>


        </motion.div>
      </Container>
    </Box>
  );
}









