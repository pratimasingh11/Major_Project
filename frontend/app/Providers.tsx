"use client";

import React, { useEffect, useMemo } from "react";
import { Provider as ReduxProvider, useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material";
import { getTheme } from "./theme"; // Function that returns MUI theme based on mode
import { store, RootState } from "@/store";
import { setMode, type Mode } from "@/store/themeSlice";
import { CssBaselineWrapper } from "@/components/CssBaselineWrapper";
import MuiRegistry from "./MuiRegistry";

/* ====================================================
  Themed Component
  - Handles Material UI theming
  - Syncs theme mode with Redux + localStorage
  - Wraps children with MUI ThemeProvider & CssBaseline
==================================================== */
function Themed({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode); // Get current theme mode from Redux

  /* --------------------------------------------
     On initial render:
     - Check localStorage for saved theme
     - If exists and different from Redux, update Redux
     - This ensures theme persists across reloads
  -------------------------------------------- */
  useEffect(() => {
    try {
      const saved = (localStorage.getItem("theme") as Mode) || null;
      if (saved && saved !== mode) dispatch(setMode(saved));
    } catch (err) {
      console.error("Error reading theme from localStorage:", err);
    }
  }, []);

  /* --------------------------------------------
     Whenever theme mode changes in Redux:
     - Save current mode to localStorage
     - Ensures persistence for future visits
  -------------------------------------------- */
  useEffect(() => {
    try {
      localStorage.setItem("theme", mode);
    } catch (err) {
      console.error("Error saving theme to localStorage:", err);
    }
  }, [mode]);

  /* --------------------------------------------
     Generate MUI theme based on current mode
     - useMemo prevents unnecessary recalculation
  -------------------------------------------- */
  const theme = useMemo(() => getTheme(mode), [mode]);

  return (
    <MuiRegistry> {/* Emotion cache provider to manage styles */}
      <ThemeProvider theme={theme}>
        <CssBaselineWrapper /> {/* MUI global CSS resets */}
        {children}
      </ThemeProvider>
    </MuiRegistry>
  );
}

/* ====================================================
  Providers Component
  - Wraps the entire app with Redux + Themed
  - Ensures all children have access to Redux store and MUI theme
==================================================== */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ReduxProvider store={store}>
      <Themed>{children}</Themed>
    </ReduxProvider>
  );
}
