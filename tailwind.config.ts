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
      "light",
      "dark",
      {
        weightLight: {
          "primary": "#3B82F6",
          "secondary": "#10B981",
          "accent": "#F97316",
          "neutral": "#374151",
          "base-100": "#FFFFFF",
          "info": "#3ABFF8",
          "success": "#22C55E",
          "warning": "#FBBF24",
          "error": "#EF4444",
        },
        weightDark: {
          "primary": "#3B82F6",
          "secondary": "#10B981",
          "accent": "#F97316",
          "neutral": "#1F2937",
          "base-100": "#111827",
          "info": "#3ABFF8",
          "success": "#22C55E",
          "warning": "#FBBF24",
          "error": "#EF4444",
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