import { createSlice, PayloadAction } from "@reduxjs/toolkit"; 
// Import createSlice and PayloadAction from Redux Toolkit for state management
export type Mode = "light" | "dark";
export interface ThemeState {
  mode: Mode; // Current theme mode
}
const initialState: ThemeState = { mode: "light" }; 
// Default theme mode is set to light

/* 
  Create a Redux slice for theme management using createSlice 
  This automatically generates actions and reducer
*/
const themeSlice = createSlice({
  name: "theme",        // Name of the slice
  initialState,         // Initial state defined above
  reducers: {
    /* 
      Set the theme mode explicitly
      Updates state.mode and saves it to localStorage if in the browser
    */
    setMode: (state, action: PayloadAction<Mode>) => {
      state.mode = action.payload; // Update the mode
      if (typeof window !== "undefined") { // Ensure window exists (browser)
        localStorage.setItem("theme", state.mode); // Save mode in localStorage
      }
    },
    /* 
      Toggle the theme between light and dark
      Updates state.mode and saves it to localStorage if in the browser
    */
    toggleMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light"; // Toggle mode
      if (typeof window !== "undefined") { // Check for browser environment
        localStorage.setItem("theme", state.mode); // Save mode in localStorage
      }
    },
  },
});

// Export the generated action creators
export const { setMode, toggleMode } = themeSlice.actions;
// Export the reducer as default to configure in the store
export default themeSlice.reducer;
