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
} from "@mui/material";

// Material UI icons
import CloseIcon from "@mui/icons-material/Close";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

//===================================================
// 2. Component Props Interface
//===================================================
// closeModal     → closes the signup modal
// switchToLogin  → switches UI to login form
interface Props {
  closeModal: () => void;
  switchToLogin: () => void;
}


//===================================================
// 3. SignupForm Component
//===================================================
export default function SignupForm({ closeModal, switchToLogin }: Props) {

  //===================================================
  // 3-1. Form State Management
  //===================================================
  // Stores user input values
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  //===================================================
  // 3-2. Error State Management
  //===================================================
  // Stores validation error messages for each field
  const [fullNameError, setFullNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [serverError, setServerError] = useState("");


  //===================================================
  // 3-3. Submission State
  //===================================================
  // Indicates whether the user clicked "Sign Up"
  // Used to control when validation errors appear
  const [submitted, setSubmitted] = useState(false);


  //===================================================
  // 3-4. Validation Rules (Regex)
  //===================================================
  // Email validation pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Password validation pattern
  // Must contain:
  // - Minimum 8 characters
  // - Uppercase letter
  // - Lowercase letter
  // - Number
  // - Special character
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).{8,}$/;


  //===================================================
  // 3-5. Form Validation Function
  //===================================================
  // Validates all form fields before submission
  const validate = () => {
    let valid = true;

    // Full Name validation
    if (!fullName.trim()) {
      setFullNameError("Full name is required");
      valid = false;
    } else {
      setFullNameError("");
    }

    // Email validation
    if (!email.trim()) {
      setEmailError("Email is required");
      valid = false;
    } else if (!emailRegex.test(email.trim())) {
      setEmailError("Invalid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    // Password validation
    if (!password) {
      setPasswordError("Password is required");
      valid = false;
    } else if (!passwordRegex.test(password)) {
      setPasswordError(
        "Password must be at least 8 characters and include uppercase, lowercase, number, special character"
      );
      valid = false;
    } else {
      setPasswordError("");
    }

    // Confirm Password validation
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      valid = false;
    } else {
      setConfirmPasswordError("");
    }

    return valid;
  };


  //===================================================
  // 3-6. Signup Handler Function
  //===================================================
  // Sends signup request to backend API
  // Performs validation before submission
  const handleSignup = async () => {
    setSubmitted(true); // mark form as submitted
    setServerError("");

    if (!validate()) return;

    try {
      const res = await fetch("http://localhost:8000/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      // Handle backend validation or server errors
      if (!res.ok) {
        setServerError(data.detail || "Signup failed");
        return;
      }

      // On successful signup, switch to login form
      switchToLogin();
    } catch (error) {
      console.error(error);
      setServerError("Server error");
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
        Sign Up
      </Typography>


      {/* ==============================================
          4-4. Signup Form Fields
         ============================================== */}
      <TextField
        fullWidth
        label="Full Name"
        variant="outlined"
        size="small"
        margin="dense"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        error={submitted && !!fullNameError}
        helperText={submitted ? fullNameError : ""}
      />

      <TextField
        fullWidth
        label="Email"
        variant="outlined"
        size="small"
        margin="dense"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        error={submitted && !!emailError}
        helperText={submitted ? emailError : ""}
      />

<TextField
  fullWidth
  label="Password"
  type={showPassword ? "text" : "password"}
  variant="outlined"
  size="small"
  margin="dense"
  value={password}
  onChange={(e) => setPassword(e.target.value)}
  error={submitted && !!passwordError}
  helperText={submitted ? passwordError : ""}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowPassword((prev) => !prev)}
          edge="end"
        >
          {showPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>


<TextField
  fullWidth
  label="Confirm Password"
  type={showConfirmPassword ? "text" : "password"}
  variant="outlined"
  size="small"
  margin="dense"
  value={confirmPassword}
  onChange={(e) => setConfirmPassword(e.target.value)}
  error={submitted && !!confirmPasswordError}
  helperText={submitted ? confirmPasswordError : ""}
  InputProps={{
    endAdornment: (
      <InputAdornment position="end">
        <IconButton
          onClick={() => setShowConfirmPassword((prev) => !prev)}
          edge="end"
        >
          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
        </IconButton>
      </InputAdornment>
    ),
  }}
/>

      {/* ==============================================
          4-5. Server Error Message
         ============================================== */}
      {submitted && serverError && (
        <Typography color="error" fontSize={12} mt={1} textAlign="center">
          {serverError}
        </Typography>
      )}


      {/* ==============================================
          4-6. Signup Button
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
        onClick={handleSignup}
      >
        Sign Up
      </Button>


      {/* ==============================================
          4-7. Login Redirect Text
         ============================================== */}
      <Typography variant="body2" textAlign="center" mt={2}>
        Already have an account?{" "}
        <span
          style={{
            cursor: "pointer",
            fontWeight: 600,
            background: "linear-gradient(90deg, #6e4adb, #5936d3)",
            WebkitBackgroundClip: "text",
            color: "transparent",
          }}
          onClick={switchToLogin}
        >
          Login
        </span>
      </Typography>
    </Paper>
  );
}
