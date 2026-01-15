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
          "SF Pro Display",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        apple: {
          gray: {
            50: "#fafafa",
            100: "#f5f5f7",
            200: "#e8e8ed",
            300: "#d2d2d7",
            400: "#86868b",
            500: "#6e6e73",
            600: "#1d1d1f",
          },
          blue: "#0071e3",
          green: "#34c759",
          red: "#ff3b30",
          orange: "#ff9500",
        },
      },
      boxShadow: {
        apple: "0 4px 24px rgba(0, 0, 0, 0.08)",
        "apple-lg": "0 8px 40px rgba(0, 0, 0, 0.12)",
        "apple-hover": "0 8px 32px rgba(0, 0, 0, 0.12)",
      },
      borderRadius: {
        apple: "12px",
        "apple-lg": "20px",
        "apple-xl": "28px",
      },
    },
  },
  plugins: [],
};

export default config;
