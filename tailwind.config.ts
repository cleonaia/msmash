import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        virutes: {
          red: "#C0392B",
          "red-dark": "#8B1A1A",
          "red-light": "#E74C3C",
          cream: "#F5ECD7",
          "cream-light": "#FDFAF4",
          olive: "#4A5240",
          brown: "#3E2723",
          "brown-mid": "#6D4C41",
          "brown-light": "#A1887F",
          border: "#E8D5B7",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "cursive"],
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bob": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(8px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease both",
        "fade-up-200": "fade-up 0.7s 0.2s ease both",
        "fade-up-400": "fade-up 0.7s 0.4s ease both",
        "fade-up-600": "fade-up 0.7s 0.6s ease both",
        "fade-in": "fade-in 1s ease both",
        "slide-down": "slide-down 0.4s ease both",
        "bob": "bob 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
