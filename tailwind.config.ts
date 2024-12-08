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
          "primary": "#6366F1",    // Indigo-500
          "primary-focus": "#4F46E5", // Indigo-600
          "secondary": "#A855F7",   // Purple-500
          "accent": "#F97316",      // Orange-500
          "neutral": "#1E293B",     // Slate-800
          "base-100": "#FFFFFF",    // White
          "base-200": "#F8FAFC",    // Slate-50
          "base-300": "#F1F5F9",    // Slate-100
          "info": "#3ABFF8",        // Sky-400
          "success": "#22C55E",     // Green-500
          "warning": "#FBBF24",     // Amber-400
          "error": "#EF4444",       // Red-500
        },
        weightDark: {
          "primary": "#818CF8",    // Indigo-400 (lighter for dark mode)
          "primary-focus": "#6366F1", // Indigo-500
          "secondary": "#C084FC",   // Purple-400
          "accent": "#FB923C",      // Orange-400
          "neutral": "#CBD5E1",     // Slate-300
          "base-100": "#0F172A",    // Slate-900
          "base-200": "#1E293B",    // Slate-800
          "base-300": "#334155",    // Slate-700
          "info": "#38BDF8",        // Sky-400
          "success": "#4ADE80",     // Green-400
          "warning": "#FCD34D",     // Amber-300
          "error": "#F87171",       // Red-400
        }
      },
    ],
    base: true,
    styled: true,
    utils: true,
    prefix: "",
    logs: false,
  },
  theme: {
    extend: {
      colors: {
        'card-dark': '#14162E',  // Dark blue for cards
        'purple-gradient': {
          start: '#6366F1',  // Indigo-500
          end: '#A855F7',    // Purple-500
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
};

export default config;