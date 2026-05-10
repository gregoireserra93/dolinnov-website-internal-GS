import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Identité de marque Dolinnov
        dolinnov: {
          green: "#7BF28F",
          black: "#242424",
          // Variations utilitaires
          "green-soft": "#A8F7B6",
          "green-deep": "#3DC85B",
          "black-soft": "#3A3A3A",
          gray: "#F4F4F4",
          "gray-mid": "#9A9A9A",
        },
      },
      fontFamily: {
        sans: ["var(--font-poppins)", "system-ui", "sans-serif"],
        display: ["var(--font-poppins)", "system-ui", "sans-serif"],
      },
      boxShadow: {
        card: "0 2px 16px rgba(36, 36, 36, 0.06)",
        "card-hover": "0 6px 24px rgba(36, 36, 36, 0.10)",
      },
    },
  },
  plugins: [],
};

export default config;
