"use client";

//===================================================
// 1. Init
//===================================================

// 1-1. Package imports
import { IconButton, Tooltip } from "@mui/material";  // MUI button and tooltip components
import { useDispatch, useSelector } from "react-redux"; // Redux hooks for state and actions
import DarkModeIcon from "@mui/icons-material/DarkMode"; // Icon for dark mode
import LightModeIcon from "@mui/icons-material/LightMode"; // Icon for light mode

// 1-2. Custom imports
import { RootState } from "@/store";                   // Root state type for useSelector
import { toggleMode } from "@/store/themeSlice";       // Redux action to toggle theme mode

//===================================================
// 2. Main Component
//===================================================

export default function ThemeToggle() {
  // Get current theme mode from Redux store
  const mode = useSelector((state: RootState) => state.theme.mode);

  // Redux dispatch function
  const dispatch = useDispatch();

  // Boolean to check if the current mode is dark
  const isDark = mode === "dark";

  return (
    // Tooltip shows text on hover
    <Tooltip title={`Switch to ${isDark ? "light" : "dark"} mode`}>
      
      {/* Icon button for theme toggle */}
      <IconButton
        onClick={() => dispatch(toggleMode())} // Dispatch toggle action on click
        size="small"
        color="inherit"
      >
        {/* Show icon depending on current mode */}
        {isDark ? <LightModeIcon /> : <DarkModeIcon />}
      </IconButton>
    </Tooltip>
  );
}
