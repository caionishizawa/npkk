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
        background: "#0A0E14",
        panel: "#151B23",
        border: "#1E2732",
        primary: "#00D9FF",
        success: "#00FF88",
        warning: "#FFB800",
        danger: "#FF3366",
        "text-primary": "#E6EDF3",
        "text-secondary": "#8B949E",
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
