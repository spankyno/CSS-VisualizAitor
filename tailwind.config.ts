import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "Georgia", "serif"],
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        obsidian: {
          950: "#060608",
          900: "#0d0d12",
          800: "#131318",
          700: "#1a1a22",
          600: "#22222c",
          500: "#2e2e3a",
        },
        aurora: {
          cyan: "#00e5ff",
          violet: "#b447eb",
          green: "#00ff88",
          gold: "#ffd166",
        },
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        "aurora-gradient":
          "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(0,229,255,0.12), transparent), radial-gradient(ellipse 60% 40% at 80% 80%, rgba(180,71,235,0.1), transparent)",
      },
      backgroundSize: {
        "grid-size": "40px 40px",
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)",
        "glass-hover": "0 16px 48px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)",
        aurora: "0 0 60px rgba(0,229,255,0.15), 0 0 120px rgba(180,71,235,0.1)",
        glow: "0 0 20px rgba(0,229,255,0.3)",
      },
      backdropBlur: {
        glass: "20px",
      },
    },
  },
  plugins: [],
};
export default config;
