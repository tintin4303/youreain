// src/app/components/ThemeWrapper.jsx
"use client";

import { ThemeProvider } from "next-themes";

export default function ThemeWrapper({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme={false}
    >
      {children}
    </ThemeProvider>
  );
}