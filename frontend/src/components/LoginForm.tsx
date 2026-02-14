"use client";


//===================================================
// 1. Package Imports
//===================================================
// React core and state management
import React, { useState } from "react";

// Material UI components for layout and inputs
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
} from "@mui/material";

// Material UI icons
import CloseIcon from "@mui/icons-material/Close";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Redux hooks for state management
import { useDispatch, useSelector } from "react-redux";

// Next.js router for navigation
import { useRouter } from "next/navigation";

// Redux action and root state type
import { loginSuccess } from "@/store/authSlice";
import { RootState } from "@/store";


//===================================================
// 2. Component Props Interface
//===================================================
// Defines the props required by LoginForm component
// closeModal     → closes the login modal
// switchToSignup → switches UI to signup form
interface Props {
  closeModal: () => void;
  switchToSignup: () => void;
}


//===================================================
// 3. LoginForm Component
//===================================================
export default function LoginForm({ closeModal, switchToSignup }: Props) {

  //===================================================
  // 3-1. Local State Management
  //===================================================
  // Stores user email input
  const [email, setEmail] = useState("");

  // Stores user password input
  const [password, setPassword] = useState("");

  // Controls password visibility (eye icon toggle)
  const [showPassword, setShowPassword] = useState(false);


  //===================================================
  // 3-2. Redux & Router Setup
  //===================================================
  // Dispatch is used to update global auth state
  const dispatch = useDispatch();

  // Router is used for redirecting after login
  const router = useRouter();

  // Gets redirect path stored in Redux (protected routes)
  const redirectPath = useSelector(
    (state: RootState) => state.auth.redirectPath
  );


  //===================================================
  // 3-3. Login Handler Function
  //===================================================
  // Sends login request to backend API
  // On success:
  // - Stores user data in Redux
  // - Closes modal
  // - Redirects user
  const handleLogin = async () => {
    try {
      const res = await fetch("http://localhost:8000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      // Handle invalid login response
      if (!res.ok) {
        alert(data.detail || "Login failed");
        return;
      }

      // Store logged-in user info in Redux
      dispatch(
        loginSuccess({
          fullName: data.full_name,
          email: data.email,
        })
      );

      // Close modal and redirect user
      closeModal();
      router.push(redirectPath || "/");
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };


  //===================================================
  // 4. UI Rendering (JSX)
  //===================================================
  return (
    <Paper
      sx={{
        p: 4,
        borderRadius: 3,
        width: "100%",
        maxWidth: 420,
        mx: "auto",
        position: "relative",
        boxShadow: "0px 12px 30px rgba(0,0,0,0.25)",
        bgcolor: "background.paper",
      }}
    >

      {/* ==============================================
          4-1. Close Button
         ============================================== */}
      <IconButton
        onClick={closeModal}
        sx={{ position: "absolute", top: 8, right: 8 }}
      >
        <CloseIcon />
      </IconButton>


      {/* ==============================================
          4-2. Logo Section
         ============================================== */}
      <Box display="flex" justifyContent="center" mb={2}>
        <img
          src="/assets/logo.png"
          alt="Logo"
          style={{ width: 90, height: 90 }}
        />
      </Box>


      {/* ==============================================
          4-3. Page Heading
         ============================================== */}
      <Typography
        variant="h5"
        fontWeight="bold"
        textAlign="center"
        mb={3}
        sx={{
          background: "linear-gradient(90deg, #6e4adb, #5936d3)",
          WebkitBackgroundClip: "text",
          color: "transparent",
        }}
      >
        Login
      </Typography>


      {/* ==============================================
          4-4. Email Input Field
         ============================================== */}
      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        size="small"
        margin="dense"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />


      {/* ==============================================
          4-5. Password Input Field with Eye Icon
         ============================================== */}
      <TextField
        fullWidth
        label="Password"
        type={showPassword ? "text" : "password"}
        variant="outlined"
        size="small"
        margin="dense"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((prev) => !prev)}
                edge="end"
                size="small"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />


      {/* ==============================================
          4-6. Login Button
         ============================================== */}
      <Button
        fullWidth
        variant="contained"
        sx={{
          mt: 2,
          bgcolor: "#6e4adb",
          color: "#fff",
          fontWeight: 600,
          "&:hover": { bgcolor: "#5936d3" },
        }}
        onClick={handleLogin}
      >
        Login
      </Button>


      {/* ==============================================
          4-7. Signup Redirect Text
         ============================================== */}
      <Typography variant="body2" textAlign="center" mt={2}>
        Don't have an account?{" "}
        <span
          style={{
            cursor: "pointer",
            fontWeight: 600,
            background: "linear-gradient(90deg, #6e4adb, #5936d3)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
          onClick={switchToSignup}
        >
          Sign Up
        </span>
      </Typography>
    </Paper>
  );
}
