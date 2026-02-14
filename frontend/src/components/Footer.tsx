"use client";

import React from "react";
import { Box, Typography, Stack, Divider } from "@mui/material";
import { Email, Phone } from "@mui/icons-material";
import Image from "next/image";

// ===================================================
// Footer Component
// Displays branding, contact details, and copyright
// ===================================================
const Footer = () => {
  return (
    <Box
      component="footer" // Semantic footer element
      sx={{
        color: "white",
        background: "linear-gradient(90deg, #6e4adb 0%, #5936d3 100%)",
        py: { xs: 4, md: 5 }, // Responsive vertical padding
        px: { xs: 2, md: 6 }, // Responsive horizontal padding
        textAlign: "center",
        width: "100%",
      }}
    >
      {/* ===================== LOGO SECTION ===================== */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        mb={2}
      >
        <Image
          src="/assets/logo.png"
          alt="FinSight Logo"
          width={60}
          height={60}
          style={{ maxWidth: "100%", height: "auto" }}
        />
      </Box>

      {/* ===================== DIVIDER ===================== */}
      <Divider
        sx={{
          bgcolor: "rgba(255,255,255,0.2)", // Light divider color
          width: { xs: "80%", md: "60%" }, // Responsive width
          mx: "auto",
          mb: 3,
        }}
      />

      {/* ===================== EMAIL CONTACTS ===================== */}
      <Stack
        direction={{ xs: "column", sm: "row" }} // Column on mobile, row on desktop
        spacing={{ xs: 1, sm: 4 }}
        justifyContent="center"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
      >
        {/* Email 1 */}
        <Box display="flex" alignItems="center" gap={1}>
          <Email fontSize="small" sx={{ color: "rgba(255,255,255,0.9)" }} />
          <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
            prashuna.shrestha021@apexcollege.edu.np
          </Typography>
        </Box>

        {/* Email 2 */}
        <Box display="flex" alignItems="center" gap={1}>
          <Email fontSize="small" sx={{ color: "rgba(255,255,255,0.9)" }} />
          <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
            pratima.singh021@apexcollege.edu.np
          </Typography>
        </Box>
      </Stack>

      {/* ===================== PHONE CONTACTS ===================== */}
      <Stack
        direction={{ xs: "column", sm: "row" }} // Responsive layout
        spacing={{ xs: 1, sm: 4 }}
        justifyContent="center"
        alignItems="center"
        mb={2}
        flexWrap="wrap"
      >
        {/* Phone number 1 */}
        <Box display="flex" alignItems="center" gap={1}>
          <Phone fontSize="small" sx={{ color: "rgba(255,255,255,0.9)" }} />
          <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
            9864111755
          </Typography>
        </Box>

        {/* Phone number 2 */}
        <Box display="flex" alignItems="center" gap={1}>
          <Phone fontSize="small" sx={{ color: "rgba(255,255,255,0.9)" }} />
          <Typography sx={{ color: "rgba(255,255,255,0.9)" }}>
            9803257815
          </Typography>
        </Box>
      </Stack>

      {/* ===================== COPYRIGHT ===================== */}
      <Typography
        variant="body2"
        sx={{
          color: "rgba(255,255,255,0.8)",
          mt: 2,
          fontSize: "0.85rem",
        }}
      >
        © {new Date().getFullYear()} FinSight Analytics — All Rights Reserved
      </Typography>
    </Box>
  );
};

export default Footer;
