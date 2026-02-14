"use client";

import React from "react";
import { CssBaseline } from "@mui/material";

// ===================================================
// CssBaselineWrapper Component
// - Normalizes CSS across different browsers
// - Applies consistent typography and layout
// (e.g., in layout.tsx or _app.tsx).
// ===================================================
export function CssBaselineWrapper() {
  return (
    <>
      {/* Applies global CSS reset and base styles */}
      <CssBaseline />
    </>
  );
}
