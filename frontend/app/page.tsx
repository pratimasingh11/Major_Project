"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  useMediaQuery,
  TextField,
  Grid,
  MenuItem,
  Divider,
  Button,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

// Define stock type
type Stock = {
  symbol: string;
  company_name: string;
  current_price: number;
  change_percent: number;
  last_7_days: number[];
};


/* ================= COMMISSION ================= */
const getBrokerCommission = (amount: number) => {
  if (amount <= 50000) return amount * 0.004;
  if (amount <= 500000) return amount * 0.0037;
  if (amount <= 2000000) return amount * 0.0034;
  if (amount <= 10000000) return amount * 0.003;
  return amount * 0.0027;
};

/* ================= SHARE CALCULATOR (CHUKUL STYLE) ================= */
function ShareCalculatorWrapper() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null; // render nothing on SSR

  return <ShareCalculator />;
}
/* ================= SHARE CALCULATOR ================= */
function ShareCalculator() {
  const [mode, setMode] = useState<"buy" | "sell">("buy");
  const [qty, setQty] = useState<number | "">("");
  const [buyPrice, setBuyPrice] = useState<number | "">("");
  const [sellPrice, setSellPrice] = useState<number | "">("");
  const [investorType, setInvestorType] = useState<"Individual" | "Institutional">("Individual");
  const [capitalTaxRate, setCapitalTaxRate] = useState<number>(7.5);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const sebonRate = 0.00015;
  const dpCharge = 25;

  useEffect(() => {
    setCapitalTaxRate(investorType === "Individual" ? 7.5 : 10);
  }, [investorType]);

  const taxRate = capitalTaxRate / 100;

  // ---------------- CALCULATIONS ----------------
  const totalBuy = qty && buyPrice ? qty * buyPrice : 0;
  const buyCommission = totalBuy ? getBrokerCommission(totalBuy) : 0;
  const buySebon = totalBuy ? totalBuy * sebonRate : 0;
  const totalPayable = totalBuy + buyCommission + buySebon + (totalBuy ? dpCharge : 0);
  const costPerShare = qty && totalPayable ? totalPayable / qty : 0;

  const totalSell = qty && sellPrice ? qty * sellPrice : 0;
  const sellCommission = totalSell ? getBrokerCommission(totalSell) : 0;
  const sellSebon = totalSell ? totalSell * sebonRate : 0;
  const grossProfit = qty && buyPrice && sellPrice ? (sellPrice - buyPrice) * qty : 0;
  const capitalTax = grossProfit > 0 ? grossProfit * taxRate : 0;
  const totalReceivable = totalSell - sellCommission - sellSebon - (totalSell ? dpCharge : 0) - capitalTax;
  const netProfit = totalReceivable - totalBuy;

  // ---------------- HANDLERS ----------------
  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};
    if (!qty) newErrors.qty = "Please enter quantity";
    if (!buyPrice) newErrors.buyPrice = "Please enter buy price";
    if (mode === "sell" && !sellPrice) newErrors.sellPrice = "Please enter sell price";
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setSubmitted(true);
  };

  const handleReset = () => {
    setQty("");
    setBuyPrice("");
    setSellPrice("");
    setInvestorType("Individual");
    setCapitalTaxRate(7.5);
    setSubmitted(false);
    setErrors({});
  };

  return (
    <Paper sx={{ p: 3, borderRadius: 4, boxShadow: 4, color: "#000" }}>
      {/* Buy/Sell buttons */}
      <Box display="flex" gap={2} justifyContent="center" mb={3}>
        <Button
          variant={mode === "buy" ? "contained" : "outlined"}
          color="success"
          sx={{ width: 120, py: 1.3, fontWeight: 700, fontSize: "1rem" }}
          onClick={() => { setMode("buy"); setSubmitted(false); }}
        >
          BUY
        </Button>
        <Button
          variant={mode === "sell" ? "contained" : "outlined"}
          color="error"
          sx={{ width: 120, py: 1.3, fontWeight: 700, fontSize: "1rem" }}
          onClick={() => { setMode("sell"); setSubmitted(false); }}
        >
          SELL
        </Button>
      </Box>

      {/* Main horizontal container: Inputs | Details */}
      <Box display="flex" width="100%" gap={2}>
        {/* Left: Input Fields */}
        <Box flex={1}>
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              value={qty}
              error={!!errors.qty}
              helperText={errors.qty}
              onChange={(e) => setQty(e.target.value === "" ? "" : +e.target.value)}
            />
            <TextField
              fullWidth
              label="Buy Price (Rs.)"
              type="number"
              value={buyPrice}
              error={!!errors.buyPrice}
              helperText={errors.buyPrice}
              onChange={(e) => setBuyPrice(e.target.value === "" ? "" : +e.target.value)}
            />
            {mode === "sell" && (
              <>
                <TextField
                  fullWidth
                  label="Sell Price (Rs.)"
                  type="number"
                  value={sellPrice}
                  error={!!errors.sellPrice}
                  helperText={errors.sellPrice}
                  onChange={(e) => setSellPrice(e.target.value === "" ? "" : +e.target.value)}
                />
                <TextField
                  select
                  fullWidth
                  label="Investor Type"
                  value={investorType}
                  onChange={(e) => setInvestorType(e.target.value as "Individual" | "Institutional")}
                >
                  <MenuItem value="Individual">Individual</MenuItem>
                  <MenuItem value="Institutional">Institutional</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  label="Capital Gain Tax (%)"
                  type="number"
                  value={capitalTaxRate}
                  InputProps={{ readOnly: true }}
                />
              </>
            )}

            {/* Submit & Reset */}
            <Box display="flex" gap={2} mt={1}>
              <Button
                sx={{ width: 120, bgcolor: "#1976d2", color: "#fff", py: 1, fontWeight: 700, "&:hover": { bgcolor: "#1565c0" } }}
                onClick={handleSubmit}
              >
                Submit
              </Button>
              <Button
                sx={{ width: 120, bgcolor: "#d32f2f", color: "#fff", py: 1, fontWeight: 700, "&:hover": { bgcolor: "#b71c1c" } }}
                onClick={handleReset}
              >
                Reset
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Right: Details Table */}
        <Box flex={1}>
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table>
              <TableBody>
                {mode === "buy" ? (
                  <>
                    <TableRow><TableCell>Total Amount</TableCell><TableCell>{submitted ? `Rs. ${totalBuy.toFixed(2)}` : "-"}</TableCell></TableRow>
                    <TableRow><TableCell>Commission</TableCell><TableCell>{submitted ? `Rs. ${buyCommission.toFixed(2)}` : "-"}</TableCell></TableRow>
                    <TableRow><TableCell>SEBON Fee</TableCell><TableCell>{submitted ? `Rs. ${buySebon.toFixed(2)}` : "-"}</TableCell></TableRow>
                    <TableRow><TableCell>DP Charge</TableCell><TableCell>{submitted ? `Rs. ${dpCharge}` : "-"}</TableCell></TableRow>
                    <TableRow><TableCell>Total Payable</TableCell><TableCell>{submitted ? `Rs. ${totalPayable.toFixed(2)}` : "-"}</TableCell></TableRow>
                    <TableRow><TableCell>Cost Per Share</TableCell><TableCell>{submitted ? `Rs. ${costPerShare.toFixed(2)}` : "-"}</TableCell></TableRow>
                  </>
                ) : (
                  <>
                    <TableRow><TableCell>Investor Type</TableCell><TableCell>{submitted ? investorType : "-"}</TableCell></TableRow>
                    <TableRow><TableCell>Total Amount</TableCell><TableCell>{submitted ? `Rs. ${totalSell.toFixed(2)}` : "-"}</TableCell></TableRow>
                    <TableRow><TableCell>Commission</TableCell><TableCell>{submitted ? `Rs. ${sellCommission.toFixed(2)}` : "-"}</TableCell></TableRow>
                    <TableRow><TableCell>SEBON Fee</TableCell><TableCell>{submitted ? `Rs. ${sellSebon.toFixed(2)}` : "-"}</TableCell></TableRow>
                    <TableRow><TableCell>DP Charge</TableCell><TableCell>{submitted ? `Rs. ${dpCharge}` : "-"}</TableCell></TableRow>
                    <TableRow><TableCell>Total Receivable</TableCell><TableCell>{submitted ? `Rs. ${totalReceivable.toFixed(2)}` : "-"}</TableCell></TableRow>
                    <TableRow><TableCell>Capital Gain Tax</TableCell><TableCell>{submitted ? `Rs. ${capitalTax.toFixed(2)}` : "-"}</TableCell></TableRow>
                    <TableRow><TableCell>Profit / Loss</TableCell><TableCell sx={{ color: netProfit >= 0 ? "green" : "red" }}>{submitted ? `Rs. ${netProfit.toFixed(2)}` : "-"}</TableCell></TableRow>
                  </>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Disclaimer */}
          <Typography variant="caption" color="red" mt={1} display="block">
            * Commission Amount includes NEPSE Commission Rs - & SEBON Regularity Fee Rs -
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
}


const ResultRow = ({ label, value, highlight, profit }: any) => {
  const displayValue = isNaN(value) ? 0 : value; // fallback if value is empty or NaN
  return (
    <Box display="flex" justifyContent="space-between" py={0.7}>
      <Typography fontWeight={highlight ? 700 : 500}>{label}</Typography>
      <Typography
        fontWeight={highlight ? 800 : 600}
        color={profit ? (displayValue >= 0 ? "green" : "red") : "text.primary"}
      >
        Rs. {displayValue.toFixed(2)}
      </Typography>
    </Box>
  );
};


/* ================= MAIN PAGE ================= */

export default function HomePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery("(max-width:900px)"); // responsive check
  const [gainers, setGainers] = useState<Stock[]>([]); // top gainers
  const [losers, setLosers] = useState<Stock[]>([]);   // top losers

  // Fetch market movers data on mount
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/market-movers")
      .then((res) => res.json())
      .then((data) => {
        setGainers((data.gainers || []).slice(0, 10)); // take top 10
        setLosers((data.losers || []).slice(0, 10));   // take top 10
      })
      .catch((err) => console.error("Market movers error:", err));
  }, []);

  // -------------------------
  // Function: render mini trend chart for each stock
  // -------------------------
  const renderChart = (prices: number[], positive: boolean) => {
    const chartData = prices
      .map((price, index) => ({ day: `D${7 - index}`, price }))
      .reverse();
    const lineColor = positive ? "#4caf50" : "#f44336"; // green for gainers, red for losers
    const fillColor = positive ? "rgba(76, 175, 80, 0.2)" : "rgba(244, 67, 54, 0.2)";

    return (
      <ResponsiveContainer width="100%" height={60}>
        <AreaChart data={chartData}>
          <XAxis dataKey="day" hide />
          <YAxis domain={["auto", "auto"]} hide />
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              border: `1px solid ${theme.palette.divider}`,
            }}
            formatter={(value: any) => [`Rs. ${value.toFixed(2)}`, "Price"]}
          />
          <Area type="monotone" dataKey="price" stroke={lineColor} fill={fillColor} strokeWidth={2.5} />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  // -------------------------
  // Function: render stock table (gainers or losers)
  // -------------------------
  const renderStockTable = (stocks: Stock[], positive: boolean) => {
    const color = positive ? "#4caf50" : "#f44336"; // text color for % change
    return (
      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3, bgcolor: theme.palette.background.paper }}>
        <Table sx={{ borderCollapse: "separate", borderSpacing: 0 }}>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: theme.palette.mode === "dark" ? "#222222" : "#e0e0e0",
                borderBottom: `3px solid ${theme.palette.divider}`,
              }}
            >
              {["Symbol", "Company", "Price (Rs.)", "Change %", "Trend (7d)"].map((header, idx) => (
                <TableCell
                  key={header}
                  sx={{
                    fontWeight: 800,
                    fontSize: "1rem",
                    textTransform: "uppercase",
                    color: theme.palette.text.primary,
                    borderRight: idx !== 4 ? `1px solid ${theme.palette.divider}` : "none",
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {stocks.map((s, index) => (
              <TableRow
                key={s.symbol}
                hover
                sx={{
                  backgroundColor:
                    index % 2 === 0
                      ? theme.palette.mode === "dark"
                        ? "#1c1c1c"
                        : "#f9f9f9"
                      : "transparent",
                  "&:hover": {
                    backgroundColor: theme.palette.mode === "dark" ? "#2a2a2a" : "#ede7f6",
                  },
                }}
              >
                {/* Stock symbol */}
                <TableCell sx={{ fontWeight: 700, fontSize: "1rem", borderRight: `1px solid ${theme.palette.divider}` }}>
                  {s.symbol}
                </TableCell>

                {/* Company name */}
                <TableCell sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>{s.company_name}</TableCell>

                {/* Current price */}
                <TableCell sx={{ borderRight: `1px solid ${theme.palette.divider}` }}>
                  <Box
                    sx={{
                      display: "inline-block",
                      px: 1.2,
                      py: 0.3,
                      borderRadius: 1,
                      bgcolor: theme.palette.mode === "dark" ? "#1e1e1e" : "#f5f5f5",
                      fontWeight: 700,
                    }}
                  >
                    {s.current_price.toFixed(2)}
                  </Box>
                </TableCell>

                {/* % change */}
                <TableCell sx={{ color: color, fontWeight: 600, borderRight: `1px solid ${theme.palette.divider}` }}>
                  {positive ? "+" : ""}
                  {s.change_percent.toFixed(2)}%
                </TableCell>

                {/* Mini trend chart */}
                <TableCell sx={{ width: 170, minWidth: 170 }}>{renderChart(s.last_7_days, positive)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ width: "100%", minHeight: "100vh", py: 4, bgcolor: theme.palette.background.default }}>
      <Container maxWidth="xl">
        {/* ======================
            Header Section: Market Movers
            Includes gradient title, emoji icons, and animated accent line
        ====================== */}
        <Box
          sx={{
            mb: 5,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            gap: 1.5,
            position: "relative",
          }}
        >
          {/* Shadowed background behind title */}
          <Box
            sx={{
              position: "absolute",
              width: isMobile ? "90%" : "500px",
              height: 80,
              borderRadius: 3,
              bgcolor: "rgba(156, 39, 176, 0.08)",
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: -1,
            }}
          />

          {/* Title with emojis */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography fontSize={isMobile ? "1.3rem" : "1.6rem"} className="pulse-icon">
              💹
            </Typography>

            <Typography
              variant={isMobile ? "h5" : "h4"}
              fontWeight={900}
              sx={{
                background: "linear-gradient(90deg, #6a1b9a, #9c27b0)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: 1.5,
                textShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              Market Movers
            </Typography>

            <Typography fontSize={isMobile ? "1.3rem" : "1.6rem"} className="pulse-icon">
              📊
            </Typography>
            <Typography fontSize={isMobile ? "1.3rem" : "1.6rem"} className="pulse-icon">
              📈
            </Typography>
          </Box>

          {/* Subtitle */}
          <Typography
            fontSize={isMobile ? "0.9rem" : "1rem"}
            color={theme.palette.text.secondary}
            sx={{ letterSpacing: 0.5, mt: 1 }}
          >
            Stay updated with today’s top gainers and losers
          </Typography>

          {/* Animated accent line */}
          <Box
            sx={{
              width: 120,
              height: 5,
              mt: 2,
              borderRadius: 2,
              background: "linear-gradient(90deg, #6a1b9a, #9c27b0)",
              position: "relative",
              overflow: "hidden",
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: "-50%",
                width: "50%",
                height: "100%",
                bgcolor: "rgba(255,255,255,0.3)",
                transform: "skewX(-20deg)",
                animation: "shine 2s infinite",
              },
            }}
          />
        </Box>

        {/* ======================
            Tables Section: Gainers & Losers
        ====================== */}
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 4,
            width: "100%",
          }}
        >
          {/* Top Gainers */}
          <Box sx={{ flex: 1 }}>
            <Typography
              fontWeight={700}
              mb={1}
              fontSize="1.5rem"
              color="#4caf50"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              🔼 Top Gainers
            </Typography>
            {renderStockTable(gainers, true)}
          </Box>

          {/* Top Losers */}
          <Box sx={{ flex: 1 }}>
            <Typography
              fontWeight={700}
              mb={1}
              fontSize="1.5rem"
              color="#f44336"
              sx={{ display: "flex", alignItems: "center", gap: 1 }}
            >
              🔽 Top Losers
            </Typography>
            {renderStockTable(losers, false)}
          </Box>
        </Box>

        {/* ======================
            Animation styles
        ====================== */}
        <style>
          {`
            @keyframes shine {
              0% { left: -50%; }
              100% { left: 100%; }
            }
            .pulse-icon {
              display: inline-block;
              animation: pulse 1.5s infinite alternate;
            }
            @keyframes pulse {
              0% { transform: scale(1); }
              50% { transform: scale(1.2); }
              100% { transform: scale(1); }
            }
          `}
        </style>

{/* SHARE CALCULATOR */}
<Box mt={8}>
  <Typography variant="h4" textAlign="center" fontWeight={900} mb={3}>
    📟 Share Calculator
  </Typography>
  <ShareCalculatorWrapper />
</Box>


    </Container>
  </Box>

);
 }