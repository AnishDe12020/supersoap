const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#040004",
        foreground: "#D8D8D8",
        muted: "#2D2D2D",
        border: "#292929",
        input: "#262626",
        ring: "#1F1F1F",
        primary: {
          DEFAULT: "#0e4acb",
          foreground: "#F2F2F2",
        },
        secondary: {
          DEFAULT: "#2a2a2a",
          foreground: "#F2F2F2",
        },
        destructive: {
          DEFAULT: "#E74C3C",
          foreground: "#F2F2F2",
        },
        accent: {
          DEFAULT: "#389150",
          foreground: "#F2F2F2",
        },
        popover: {
          DEFAULT: "#1b1b1b",
          foreground: "#A6A6A6",
        },
        card: {
          DEFAULT: "#151515",
          foreground: "#D8D8D8",
        },
      },

      borderRadius: {
        lg: "0.75rem",
        md: "calc(0.75rem - 2px)",
        sm: "calc(0.75rem - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
