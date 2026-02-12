import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "Inter",
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "system-ui",
          "sans-serif",
        ],
      },
      colors: {
        // Warm, inviting neutrals
        warm: {
          50: "#FEFDFB",
          100: "#FBF9F7",
          200: "#F5F3F0",
          300: "#E8E4DF",
          400: "#B5AFA6",
          500: "#857D73",
          600: "#5C564E",
          700: "#3D3A35",
          800: "#262420",
          900: "#1A1816",
        },
        // Vibrant accent palette
        accent: {
          orange: "#F97316",
          coral: "#FB7185",
          amber: "#F59E0B",
          emerald: "#10B981",
          sky: "#0EA5E9",
          violet: "#8B5CF6",
          rose: "#F43F5E",
        },
      },
      backgroundImage: {
        "gradient-warm": "linear-gradient(145deg, #FFFBEB 0%, #FEF3C7 100%)",
        "gradient-hero": "linear-gradient(180deg, #FFFBEB 0%, #FFF7ED 50%, #FFFFFF 100%)",
        "gradient-card": "linear-gradient(165deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%)",
        "gradient-orange": "linear-gradient(135deg, #FB923C 0%, #F97316 50%, #EA580C 100%)",
        "gradient-emerald": "linear-gradient(135deg, #34D399 0%, #10B981 50%, #059669 100%)",
        "gradient-mesh": "radial-gradient(at 40% 20%, rgba(251, 146, 60, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(251, 113, 133, 0.1) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(245, 158, 11, 0.1) 0px, transparent 50%)",
      },
      boxShadow: {
        "soft-sm": "0 1px 2px rgba(0, 0, 0, 0.04), 0 2px 8px rgba(0, 0, 0, 0.04)",
        "soft": "0 2px 8px -2px rgba(0, 0, 0, 0.06), 0 4px 16px -4px rgba(0, 0, 0, 0.08)",
        "soft-lg": "0 4px 16px -4px rgba(0, 0, 0, 0.08), 0 8px 32px -8px rgba(0, 0, 0, 0.1)",
        "soft-xl": "0 8px 24px -8px rgba(0, 0, 0, 0.1), 0 20px 48px -16px rgba(0, 0, 0, 0.12)",
        "glow-orange": "0 8px 40px -8px rgba(249, 115, 22, 0.35)",
        "glow-emerald": "0 8px 40px -8px rgba(16, 185, 129, 0.35)",
        "pill": "0 1px 3px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.04)",
        "pill-hover": "0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)",
        "inner-glow": "inset 0 1px 0 rgba(255, 255, 255, 0.8)",
      },
      borderRadius: {
        "xl": "12px",
        "2xl": "16px",
        "3xl": "24px",
        "4xl": "32px",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "slide-up": "slideUp 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.4s ease-out forwards",
        "float": "float 6s ease-in-out infinite",
        "pulse-soft": "pulseSoft 3s ease-in-out infinite",
        "bounce-soft": "bounceSoft 0.4s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.96)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.85", transform: "scale(0.98)" },
        },
        bounceSoft: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(0.96)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
