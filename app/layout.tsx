import "./globals.css";
import { ThemeProvider } from "./_components/theme-context";
import { Toaster } from "react-hot-toast";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}