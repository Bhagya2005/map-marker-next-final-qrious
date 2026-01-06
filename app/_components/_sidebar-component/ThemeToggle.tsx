"use client";
import { useTheme } from "../theme-context";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-14 h-8 rounded-full transition
      ${theme === "dark" ? "bg-indigo-600" : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-1 left-1 w-6 h-6 rounded-full bg-white shadow
        transition-transform
        ${theme === "dark" ? "translate-x-6" : ""}`}
      />
    </button>
  );
}
