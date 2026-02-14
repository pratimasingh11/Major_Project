"use client";

//===================================================
// 1. React & Core Imports
//===================================================
import React, { useEffect, useState, useRef } from "react";
import { logout } from "@/store/authSlice";

//===================================================
// 2. Material UI Components
//===================================================
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  TextField,
  InputAdornment,
  Paper,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";

// Utility for color opacity
import { alpha } from "@mui/material/styles";

//===================================================
// 3. Material UI Icons
//===================================================
import {
  DarkMode,
  LightMode,
  Menu as MenuIcon,
  Close as CloseIcon,
  Search as SearchIcon,
  ArrowDropDown as ArrowDropDownIcon,
} from "@mui/icons-material";
import PersonIcon from "@mui/icons-material/Person";

//===================================================
// 4. Next.js & Redux Imports
//===================================================
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { toggleMode } from "@/store/themeSlice";
import { setRedirectPath } from "@/store/authSlice";
import { useRouter } from "next/navigation";

//===================================================
// 5. Type Definitions
//===================================================
interface HeaderProps {
  onLoginClick?: () => void;
  onSignupClick?: () => void;
}

interface StockSuggestion {
  symbol: string;
  company_name: string;
  category: string;
}

//===================================================
// 6. Header Component
//===================================================
export default function Header({ onLoginClick, onSignupClick }: HeaderProps) {
  const dispatch = useDispatch();
  const router = useRouter();

  const mode = useSelector((state: RootState) => state.theme.mode);
  const isLight = mode === "light";

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const user = useSelector((state: RootState) => state.auth.user);

  const handleThemeChange = () => dispatch(toggleMode());

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [symbolInput, setSymbolInput] = useState("");
  const [suggestions, setSuggestions] = useState<StockSuggestion[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const isUserMenuOpen = Boolean(anchorEl);

  const toggleDrawer = () => setMobileOpen(!mobileOpen);
  const handleUserMenuOpen = (e: React.MouseEvent<HTMLElement>) =>
    setAnchorEl(e.currentTarget);
  const handleUserMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    dispatch(logout());
    handleUserMenuClose();
    router.push("/");
  };

  const headerGradient = isLight
    ? "linear-gradient(90deg, #9b59b6 0%, #6e4adb 100%)"
    : "linear-gradient(90deg, #332a6d 0%, #1d1649 100%)";

  const navHoverColor = "#4b0082";

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "News", href: "/news" },
    { label: "Learn", href: "/learn" },
    { label: "About Us", href: "/aboutus" },
    { label: "Analysis", href: "/analysis" },
  ];

  const BACKEND_URL = "http://localhost:8000";

  //=============================================
  // 7. Hydration-safe mount state
  //=============================================
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  //=============================================
  // 8. Search Suggestions Effect
  //=============================================
  useEffect(() => {
    if (!symbolInput || !isAuthenticated) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    const timeout = setTimeout(() => {
      fetch(`${BACKEND_URL}/api/search-suggestions?q=${symbolInput}`)
        .then((res) => res.json())
        .then((data) => {
          setSuggestions(data);
          setIsDropdownOpen(true);
        })
        .catch(() => setSuggestions([]));
    }, 250);

    return () => clearTimeout(timeout);
  }, [symbolInput, isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (symbol: string) => {
    if (!symbol) return;
    setSymbolInput(symbol);
    setSuggestions([]);
    setIsDropdownOpen(false);

    if (!isAuthenticated) {
      dispatch(setRedirectPath(`/analysis?symbol=${symbol}`));
      onLoginClick?.();
      return;
    }

    router.push(`/analysis?symbol=${symbol}`);
  };

  const handleDropdownClick = () => {
    if (!isAuthenticated) {
      onLoginClick?.();
      return;
    }

    if (isDropdownOpen) {
      setIsDropdownOpen(false);
      return;
    }

    fetch(`${BACKEND_URL}/api/all-stocks`)
      .then((res) => res.json())
      .then((data) => {
        setSuggestions(data);
        setIsDropdownOpen(true);
      });
  };

  const handleNavClick = (href: string) => {
    if (!isAuthenticated && href !== "/") {
      dispatch(setRedirectPath(href));
      onLoginClick?.();
      return;
    }
    router.push(href);
  };

  //======================= JSX =======================
  return (
    <AppBar
      position="static"
      sx={{ background: headerGradient, color: "white", boxShadow: 4 }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          py: 1.2,
          px: { xs: 2, md: 4 },
          gap: 1.5,
        }}
      >
        {/* Left Section */}
        <Box display="flex" alignItems="center" gap={2}>
          <Image
            src="/assets/logo.png"
            alt="Logo"
            width={55}
            height={55}
            style={{ cursor: "pointer" }}
            onClick={() => handleNavClick("/")}
          />
          <IconButton
            color="inherit"
            sx={{ display: { xs: "flex", md: "none" } }}
            onClick={toggleDrawer}
          >
            <MenuIcon />
          </IconButton>
          <Box
            display={{ xs: "none", md: "flex" }}
            alignItems="center"
            gap={3}
            ml={2}
          >
            {navLinks.map((item) => (
              <Typography
                key={item.label}
                onClick={() => handleNavClick(item.href)}
                sx={{
                  cursor: "pointer",
                  fontWeight: 500,
                  fontSize: "0.95rem",
                  transition: "color 0.2s",
                  "&:hover": { color: navHoverColor },
                }}
              >
                {item.label}
              </Typography>
            ))}
          </Box>
        </Box>

{/* Center Search Section */}
<Box
  sx={{ width: { xs: "100%", md: "40%" }, position: "relative" }}
  ref={searchRef}
>
  {mounted && (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        bgcolor: isLight ? "#fff" : alpha("#fff", 0.15),
        borderRadius: "8px",
        pl: 1.5,
        transition: "box-shadow 0.3s",
        "&:focus-within": {
          boxShadow: "0 0 0 2px rgba(255,255,255,0.5)",
        },
        cursor: !isAuthenticated ? "pointer" : "text",
      }}
      onClick={() => !isAuthenticated && onLoginClick?.()}
    >
      <TextField
        fullWidth
        variant="standard"
        placeholder="Search stock or company"
        value={symbolInput}
        disabled={!isAuthenticated} // now safe
        onChange={(e) => setSymbolInput(e.target.value.toUpperCase())}
        onKeyDown={(e) =>
          e.key === "Enter" && handleSearch(symbolInput)
        }
        sx={{ input: { color: isLight ? "black" : "white" } }}
        InputProps={{
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: isLight ? "#666" : "#ccc" }} />
            </InputAdornment>
          ),
        }}
      />
      <IconButton
        size="small"
        onClick={(e) => {
          e.stopPropagation();
          handleDropdownClick();
        }}
        sx={{ color: isLight ? "#666" : "#ccc" }}
      >
        <ArrowDropDownIcon />
      </IconButton>
    </Box>
  )}

  {mounted && isDropdownOpen && suggestions.length > 0 && (
    <Paper
      elevation={8}
      sx={{
        position: "absolute",
        width: "100%",
        top: "110%",
        left: 0,
        zIndex: 2000,
        maxHeight: 350,
        overflowY: "auto",
        borderRadius: 2,
        bgcolor: isLight ? "white" : "#1e1e1e",
        border: isLight ? "1px solid #eee" : "1px solid #333",
      }}
    >
      {suggestions.map((s) => (
        <Box
          key={s.symbol}
          px={2}
          py={1.5}
          sx={{
            display: "flex",
            flexDirection: "column",
            cursor: "pointer",
            borderBottom: isLight
              ? "1px solid #f0f0f0"
              : "1px solid #2d2d2d",
            "&:hover": {
              bgcolor: isLight
                ? alpha("#6e4adb", 0.08)
                : alpha("#fff", 0.05),
            },
            "&:last-child": { borderBottom: "none" },
          }}
          onClick={() => handleSearch(s.symbol)}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              fontWeight={700}
              color={isLight ? "primary.main" : "#bb86fc"}
            >
              {s.symbol}
            </Typography>
            <Typography fontSize={12} color="text.secondary" noWrap>
              {s.category}
            </Typography>
          </Box>
          <Typography fontSize={13} color="text.secondary" noWrap>
            {s.company_name}
          </Typography>
        </Box>
      ))}
    </Paper>
  )}
</Box>

        {/* Right Section (Theme + Auth) */}
        {mounted && (
          <Box display="flex" alignItems="center" gap={1.5}>
            <IconButton color="inherit" onClick={handleThemeChange}>
              {isLight ? <DarkMode /> : <LightMode />}
            </IconButton>

            {!isAuthenticated ? (
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={onLoginClick}
                  sx={{ borderRadius: "20px", textTransform: "none" }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    borderRadius: "20px",
                    bgcolor: "white",
                    color: "#6e4adb",
                    textTransform: "none",
                    "&:hover": { bgcolor: "#f0f0f0" },
                  }}
                  onClick={onSignupClick}
                >
                  Sign Up
                </Button>
              </Box>
            ) : (
              <Box
                sx={{ position: "relative", display: "flex", alignItems: "center", gap: 1 }}
              >
                {/* User Card */}
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    p: 0.5,
                    borderRadius: 2,
                    bgcolor: isLight
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.1)",
                    cursor: "pointer",
                  }}
                  onClick={(e) => handleUserMenuOpen(e)}
                >
                  <Avatar sx={{ width: 35, height: 35, bgcolor: alpha("#fff", 0.2) }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 500, display: { xs: "none", sm: "block" } }}
                  >
                    {user?.fullName || ""}
                  </Typography>
                  <ArrowDropDownIcon />
                </Box>

                {/* Logout Menu */}
                <Menu
                  anchorEl={anchorEl}
                  open={isUserMenuOpen}
                  onClose={handleUserMenuClose}
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  transformOrigin={{ vertical: "top", horizontal: "right" }}
                  disableScrollLock
                  PaperProps={{
                    sx: {
                      borderRadius: 0,
                      boxShadow: "none",
                      bgcolor: "transparent",
                      mt: 1.5,
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 2,
                      py: 1.2,
                      color: "white",
                      borderRadius: 2,
                      backgroundColor: "#b169f5 !important",
                      minWidth: 160,
                      "&:hover": { backgroundColor: "#8e4df5 !important" },
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="20"
                      viewBox="0 0 24 24"
                      width="20"
                      fill="white"
                    >
                      <path d="M0 0h24v24H0z" fill="none" />
                      <path d="M16 13v-2H7V8l-5 4 5 4v-3h9zM20 3h-8v2h8v14h-8v2h8c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
                    </svg>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      Logout
                    </Typography>
                  </MenuItem>
                </Menu>
              </Box>
            )}
          </Box>
        )}

        {/* Mobile Drawer */}
        <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer}>
          <Box
            sx={{
              width: 280,
              background: headerGradient,
              height: "100%",
              color: "white",
              p: 3,
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h6" fontWeight={700}>
                FinSight
              </Typography>
              <IconButton color="inherit" onClick={toggleDrawer}>
                <CloseIcon />
              </IconButton>
            </Box>

            <List>
              {navLinks.map((item) => (
                <ListItem
                  key={item.label}
                  disablePadding
                  sx={{
                    mb: 2,
                    cursor: "pointer",
                    userSelect: "none",
                    "&:hover": { backgroundColor: "transparent", color: "#4b0082" },
                  }}
                  onClick={() => {
                    handleNavClick(item.href);
                    toggleDrawer();
                  }}
                >
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{ fontSize: "1.1rem", fontWeight: 500 }}
                  />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Toolbar>
    </AppBar>
  );
}
