"use client";

import React from "react";
import { Button, ButtonGroup } from "@mui/material";

// ===================================================
// TimeFilter Component
// ---------------------------------------------------
// This component displays a group of buttons representing
// different timeframes for stock chart data filtering.
//
// Available Timeframes:
// - 1D  → 1 Day
// - 1W  → 1 Week
// - 1M  → 1 Month
// - 6M  → 6 Months
// - 1Y  → 1 Year
// - 3Y  → 3 Years
// - 5Y  → 5 Years
// ===================================================

interface TimeFilterProps {
  onFilterChange: (value: string) => void; // Callback to notify parent about selected timeframe
}

const TimeFilter: React.FC<TimeFilterProps> = ({ onFilterChange }) => {
  // Array of available timeframes
  const timeframes = ["1D", "1W", "1M", "6M", "1Y", "3Y", "5Y"];

  return (
    // Container wrapper with top and bottom margin
    <div style={{ margin: "10px 0" }}>
      
      {/* Button group for selecting timeframes */}
      <ButtonGroup variant="outlined" color="secondary">
        {timeframes.map((tf) => (
          <Button
            key={tf}                  // Unique key for each button
            onClick={() => onFilterChange(tf)} // Trigger parent callback with selected timeframe
          >
            {tf}                      // Button label
          </Button>
        ))}
      </ButtonGroup>
    </div>
  );
};

export default TimeFilter;
