import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  fullName: string;
  email: string;
}

interface AuthState {
  isAuthenticated: boolean;
  redirectPath: string | null;
  user: User | null;
}

// ----------------------------------------
// Load user from localStorage (persist login)
// ----------------------------------------
const savedUser =
  typeof window !== "undefined"
    ? localStorage.getItem("authUser")
    : null;

const initialState: AuthState = {
  isAuthenticated: !!savedUser,
  redirectPath: null,
  user: savedUser ? JSON.parse(savedUser) : null,
};

// ----------------------------------------
// Auth Slice
// ----------------------------------------
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Save the path user wanted before login
    setRedirectPath: (state, action: PayloadAction<string>) => {
      state.redirectPath = action.payload;
    },

    // Called after successful login
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.redirectPath = null;

      // Persist login across refresh
      localStorage.setItem("authUser", JSON.stringify(action.payload));
    },

    // Called when user clicks Logout
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.redirectPath = null;

      // Clear persisted auth
      localStorage.removeItem("authUser");
    },
  },
});

// ----------------------------------------
// Exports
// ----------------------------------------
export const { setRedirectPath, loginSuccess, logout } =
  authSlice.actions;

export default authSlice.reducer;