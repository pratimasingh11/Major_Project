"use client";

import React from "react";
import { Button, ButtonGroup } from "@mui/material";

// ===================================================
// TrendToggle Component
// ---------------------------------------------------
// This component displays a group of toggle buttons
// used to enable or disable different technical
// indicators on the stock analysis chart.
//
// Indicators included:
// - EMA12   → Exponential Moving Average (12 period)
// - EMA26   → Exponential Moving Average (26 period)
// - BB      → Bollinger Bands
// - RSI     → Relative Strength Index
// - VOLUME  → Trading Volume
// ===================================================

interface TrendToggleProps {
  selected: string[];               // List of currently active indicators
  onToggle: (type: string) => void; // Callback to toggle indicator on/off
}

const TrendToggle: React.FC<TrendToggleProps> = ({
  selected,
  onToggle,
}) => {

  // List of available technical indicators
  const options = ["EMA12", "EMA26", "BB", "RSI", "VOLUME"];

  return (
    // Wrapper container for spacing
    <div style={{ marginTop: "10px" }}>

      {/* Button group for indicator toggles */}
      <ButtonGroup
        variant="outlined"
        color="primary"
        aria-label="trend toggle group"
      >
        {options.map((opt) => (
          <Button
            key={opt} // Unique key for each button
            onClick={() => onToggle(opt)} // Toggle indicator state
            variant={
              selected.includes(opt) ? "contained" : "outlined"
            } // Highlight selected indicators
          >
            {opt}
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default TrendToggle;
