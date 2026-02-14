"use client";

import * as React from "react";
import { CacheProvider } from "@emotion/react"; // Provides a custom Emotion cache
import createCache from "@emotion/cache";       // Function to create the cache

//===================================================
// 1. Create a cache for MUI's Emotion styling
//    - key: "mui" ensures that MUI styles are scoped correctly
//    - prepend: true makes sure MUI styles are inserted before other styles
//      in the <head>, allowing them to be easily overridden
//===================================================
const muiCache = createCache({
  key: "mui",
  prepend: true,
});

//===================================================
// 2. MuiRegistry Component
//    Wraps children with the CacheProvider for Emotion
//    Ensures MUI components have proper CSS injection order
//===================================================
export default function MuiRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CacheProvider value={muiCache}>{children}</CacheProvider>;
}
