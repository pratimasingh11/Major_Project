import { configureStore } from "@reduxjs/toolkit"; 
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"; 
import themeReducer from "./themeSlice"; 
import authReducer from "./authSlice";   

/* 
  Create the Redux store using configureStore
  - Combines all slice reducers under the reducer object
  - Enables Redux DevTools in non-production environments
*/
export const store = configureStore({
  reducer: {
    theme: themeReducer, // Theme slice state
    auth: authReducer,   // Authentication slice state
  },
  devTools: process.env.NODE_ENV !== "production", // Enable DevTools only in dev
});

/* 
  TypeScript type for the entire state of the store
  - ReturnType<typeof store.getState> infers the state shape from the store itself
*/
export type RootState = ReturnType<typeof store.getState>; 

/* 
  TypeScript type for the dispatch function
  - Ensures dispatching actions is type-safe
*/
export type AppDispatch = typeof store.dispatch; 

/* 
  Custom hook for dispatching actions
  - Typed version of useDispatch for TypeScript
*/
export const useAppDispatch = () => useDispatch<AppDispatch>(); 

/* 
  Custom hook for selecting state from the Redux store
  - Typed version of useSelector for TypeScript
*/
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 
