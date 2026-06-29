"use client";

import React from "react";
import { ThemeProvider } from "next-themes";

if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  window.fetch = async function (url, options = {}) {
    const urlString = typeof url === "string" ? url : (url && url.url ? url.url : "");
    // Fallback search patterns for dev or prod backend URLs
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";
    if (urlString.includes(backendUrl) || urlString.includes("localhost:5001") || urlString.includes("medicare-server-457k.onrender.com")) {
      options.credentials = "include";
    }
    return originalFetch(url, options);
  };
}

export function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={true}>
      {children}
    </ThemeProvider>
  );
}
