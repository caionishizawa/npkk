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
        bg: "#08090c",
        surface: "#0f1117",
        raised: "#151820",
        border: "#1c1f2e",
        "border-focus": "#4f6ef7",
        text: "#e8eaef",
        "text-soft": "#9ba1b7",
        "text-muted": "#565c75",
        brand: "#4f6ef7",
        green: "#22c55e",
        amber: "#f59e0b",
        red: "#ef4444",
        purple: "#a78bfa",
        orange: "#f97316",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
    },
  },
  plugins: [],
};
export default config;
