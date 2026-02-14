"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Dialog } from "@mui/material";
import LoginForm from "@/components/LoginForm";
import SignupForm from "@/components/SignupForm";

//===================================================
// 1. AppShell Component
//===================================================
// This component wraps the entire app layout, including
// the header, footer, and modals for login/signup.
export default function AppShell({
  children,
}: {
  children: React.ReactNode; // Main content passed from pages
}) {
  const pathname = usePathname(); // Get current route
  const isHome = pathname === "/"; // Only allow modals on home page

  //====================
  // 2. Modal States
  //====================
  const [openLogin, setOpenLogin] = useState(false);
  const [openSignup, setOpenSignup] = useState(false);

  //====================
  // 3. Modal Handlers
  //====================
  const openLoginModal = () => {
    if (!isHome) return; // Only open on home page
    setOpenLogin(true);
    setOpenSignup(false); // Ensure only one modal is open
  };

  const openSignupModal = () => {
    if (!isHome) return; // Only open on home page
    setOpenSignup(true);
    setOpenLogin(false); // Ensure only one modal is open
  };

  return (
    <>
      {/*====================
          Header Section
        ====================*/}
      <Header
        onLoginClick={isHome ? openLoginModal : undefined}
        onSignupClick={isHome ? openSignupModal : undefined}
      />

      {/*====================
          Main Content
        ====================*/}
      <main style={{ flex: 1 }}>{children}</main>

      {/*====================
          Footer Section
        ====================*/}
      <Footer />

      {/*====================
          Login & Signup Dialogs (Home Page Only)
        ====================*/}
      {isHome && (
        <>
          {/* Login Modal */}
          <Dialog
            open={openLogin}
            onClose={() => setOpenLogin(false)}
            PaperProps={{
              sx: {
                borderRadius: 3,
                width: "400px",
                maxWidth: "90%",
                p: 2,
              },
            }}
            BackdropProps={{
              sx: {
                backgroundColor: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(6px)",
              },
            }}
          >
            <LoginForm
              closeModal={() => setOpenLogin(false)}
              switchToSignup={openSignupModal} // Allow switching to signup modal
            />
          </Dialog>

          {/* Signup Modal */}
          <Dialog
            open={openSignup}
            onClose={() => setOpenSignup(false)}
            PaperProps={{
              sx: {
                borderRadius: 3,
                width: "400px",
                maxWidth: "90%",
                p: 2,
              },
            }}
            BackdropProps={{
              sx: {
                backgroundColor: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(6px)",
              },
            }}
          >
            <SignupForm
              closeModal={() => setOpenSignup(false)}
              switchToLogin={openLoginModal} // Allow switching to login modal
            />
          </Dialog>
        </>
      )}
    </>
  );
}
