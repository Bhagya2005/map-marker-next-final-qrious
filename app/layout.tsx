"use client";

import "./globals.css";
import { useEffect } from "react"; 
import { ThemeProvider } from "./_components/theme-context";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "@/app/store/useAuthStore";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    useAuthStore.getState().bootstrapUser(); 
  }, []);

  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          {children}
          <Toaster position="top-right" reverseOrder={false} />
        </ThemeProvider>
      </body>
    </html>
  );
}
