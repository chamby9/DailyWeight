import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        weightLight: {
          "primary": "#3B82F6",    // Blue
          "secondary": "#10B981",   // Emerald
          "accent": "#F97316",      // Orange
          "neutral": "#374151",     // Gray
          "base-100": "#FFFFFF",    // White
          "info": "#3ABFF8",        // Sky
          "success": "#22C55E",     // Green
          "warning": "#FBBF24",     // Amber
          "error": "#EF4444",       // Red
        },
        weightDark: {
          "primary": "#3B82F6",     // Blue
          "secondary": "#10B981",    // Emerald
          "accent": "#F97316",       // Orange
          "neutral": "#1F2937",      // Dark Gray
          "base-100": "#111827",     // Near Black
          "info": "#3ABFF8",         // Sky
          "success": "#22C55E",      // Green
          "warning": "#FBBF24",      // Amber
          "error": "#EF4444",        // Red
        },
      },
    ],
    darkTheme: "weightDark",
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  },
  theme: {
    extend: {},
  },
};

export default config;