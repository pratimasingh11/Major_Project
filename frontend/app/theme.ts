"use client";

import { createTheme, PaletteMode } from "@mui/material/styles";
import { Roboto } from "next/font/google";

/* ====================================================
  Load Google Font: Roboto
  - weights: 300, 400, 500, 700
  - subsets: Latin characters
==================================================== */
export const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
});

/* ====================================================
  getTheme Function
  - Generates a Material UI theme based on the selected mode (light/dark)
  - Parameters:
      mode: "light" | "dark" (PaletteMode)
  - Returns: MUI Theme object
==================================================== */
export const getTheme = (mode: PaletteMode) =>
  createTheme({
    /* --------------------------
       Typography settings
       - Use Roboto as the primary font for all components
       - Note: Don't use `roboto.style.fontFamily` directly here
    -------------------------- */
    typography: {
      fontFamily: "Roboto, sans-serif",
    },

    /* --------------------------
       Color palette
       - Mode: light or dark
       - Primary color: blue (#1976d2)
       - You can customize secondary, error, warning, etc. if needed
    -------------------------- */
    palette: {
      mode,
      primary: { main: "#1976d2" },
    },
  });
