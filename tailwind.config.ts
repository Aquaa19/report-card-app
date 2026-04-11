import type { Config } from "tailwindcss";

/** Stitch / landing_page_search design tokens (code.html) */
const stitchColors = {
  background: "#121223",
  "on-background": "#e3e0f9",
  surface: "#121223",
  "on-surface": "#e3e0f9",
  "on-surface-variant": "#c4c5d9",
  "outline-variant": "#434656",
  "surface-container-lowest": "#0c0c1d",
  "surface-container-low": "#1a1a2b",
  "surface-container": "#1e1e30",
  "surface-container-high": "#28283b",
  "surface-container-highest": "#333346",
  primary: "#b8c3ff",
  "primary-container": "#2e5bff",
  "on-primary": "#002388",
  "on-primary-container": "#efefff",
  tertiary: "#00dbe7",
  "tertiary-container": "#007980",
  "on-tertiary-container": "#c0faff",
  secondary: "#d8b9ff",
  "secondary-container": "#6e06d0",
  outline: "#8e90a2",
  error: "#ffb4ab",
} as const;

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: stitchColors,
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
        headline: ["var(--font-jakarta)", "Plus Jakarta Sans", "sans-serif"],
        label: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      borderRadius: {
        /** Matches template tailwind.config override */
        stitch: "1rem",
        "stitch-lg": "2rem",
        "stitch-xl": "3rem",
      },
    },
  },
  plugins: [],
};
export default config;
