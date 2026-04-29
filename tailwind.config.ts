import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        xs: "360px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        smash: {
          black:        "#21142B",
          dark:         "#2A1B37",
          smoke:        "#362247",
          "smoke-mid": "#4A3460",
          fire:         "#8A2BE2",
          "fire-deep": "#9370DB",
          ember:        "#9370DB",
          turquoise:    "#40E0D0",
          gold:         "#F59A23",
          "gold-light": "#FFC361",
          sky:          "#A88DD6",
          "sky-light": "#C7B3E8",
          "sky-pale":  "#E6DCF8",
          cream:        "#F6F1FF",
          "cream-dim": "#CBB8E8",
          border:       "#5A4373",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Impact", "sans-serif"],
        sans:    ["var(--font-sans)", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%":   { opacity: "0", transform: "translateY(32px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-down": {
          "0%":   { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "bob": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(8px)" },
        },
        "cloud-drift": {
          "0%":   { transform: "translateX(0px) translateY(0px)" },
          "33%":  { transform: "translateX(18px) translateY(-6px)" },
          "66%":  { transform: "translateX(8px) translateY(4px)" },
          "100%": { transform: "translateX(0px) translateY(0px)" },
        },
        "cloud-drift-slow": {
          "0%":   { transform: "translateX(0px) translateY(0px)" },
          "50%":  { transform: "translateX(-28px) translateY(8px)" },
          "100%": { transform: "translateX(0px) translateY(0px)" },
        },
        "cloud-drift-mid": {
          "0%":   { transform: "translateX(0px) translateY(0px) scale(1)" },
          "40%":  { transform: "translateX(12px) translateY(-4px) scale(1.02)" },
          "100%": { transform: "translateX(0px) translateY(0px) scale(1)" },
        },
        "fire-pulse": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%":      { opacity: "0.8", transform: "scale(1.05)" },
        },
        "scale-in": {
          "0%":   { opacity: "0", transform: "scale(0.90)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
      },
      animation: {
        "fade-up":           "fade-up 0.8s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-200":       "fade-up 0.8s 0.15s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-400":       "fade-up 0.8s 0.3s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-600":       "fade-up 0.8s 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "fade-up-800":       "fade-up 0.8s 0.65s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in":           "fade-in 1.2s ease both",
        "slide-down":        "slide-down 0.4s ease both",
        "bob":               "bob 2.5s ease-in-out infinite",
        "cloud-drift":       "cloud-drift 22s ease-in-out infinite",
        "cloud-drift-slow":  "cloud-drift-slow 32s ease-in-out infinite",
        "cloud-drift-mid":   "cloud-drift-mid 18s ease-in-out infinite",
        "fire-pulse":        "fire-pulse 3s ease-in-out infinite",
        "scale-in":          "scale-in 0.6s cubic-bezier(0.16,1,0.3,1) both",
        "shimmer":           "shimmer 3s linear infinite",
      },
      boxShadow: {
        "fire":        "0 0 30px rgba(255,69,0,0.5), 0 0 80px rgba(255,69,0,0.2)",
        "fire-sm":     "0 4px 20px rgba(255,69,0,0.4)",
        "fire-lg":     "0 8px 60px rgba(255,69,0,0.5), 0 0 120px rgba(255,107,0,0.2)",
        "gold":        "0 0 24px rgba(255,179,0,0.5)",
        "sky-glow":    "0 0 40px rgba(91,155,213,0.4)",
        "card":        "0 2px 24px rgba(0,0,0,0.6)",
        "card-hover":  "0 8px 48px rgba(255,69,0,0.25), 0 2px 8px rgba(0,0,0,0.6)",
        "inner-fire":  "inset 0 1px 0 rgba(255,107,0,0.3)",
      },
    },
  },
  plugins: [],
};

export default config;
