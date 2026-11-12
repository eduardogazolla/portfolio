/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        line: "var(--color-line)",
        text: "var(--color-text)",
        "text-muted": "var(--color-text-muted)",
        accent: "var(--color-accent)",
        "on-accent": "var(--color-on-accent)",
        danger: "var(--color-danger)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "display-xl": ["176px", { lineHeight: "0.88", letterSpacing: "-4px", fontWeight: "800" }],
        "display-l": ["112px", { lineHeight: "0.92", letterSpacing: "-3px", fontWeight: "800" }],
        h1: ["64px", { lineHeight: "1", letterSpacing: "-2px", fontWeight: "700" }],
        h2: ["40px", { lineHeight: "1.1", letterSpacing: "-1px", fontWeight: "600" }],
        h3: ["24px", { lineHeight: "1.25", letterSpacing: "-0.5px", fontWeight: "600" }],
        "body-l": ["20px", { lineHeight: "1.5" }],
        "body-m": ["16px", { lineHeight: "1.6" }],
        "label-m": ["14px", { lineHeight: "1.4", fontWeight: "500" }],
        "mono-s": ["13px", { lineHeight: "1.4" }],
      },
      borderRadius: {
        sm: "6px",
        md: "14px",
      },
      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
        slow: "var(--duration-slow)",
      },
      transitionTimingFunction: {
        out: "var(--ease-out)",
        "in-out": "var(--ease-in-out)",
      },
      spacing: {
        40: "160px",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};
