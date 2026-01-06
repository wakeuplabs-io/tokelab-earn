import type { Config } from "tailwindcss";
import daisyui from "daisyui";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      colors: {
        // Neutral Colors
        neutral: {
          dark: "#101828",
          "d-grey": "#475467",
          grey: "#516278",
          "l-grey": "#8596AB",
          "grey-blue": "#98A2B3",
          silver: "#E4E7EC",
          disabled: "#ECEFF2",
          DEFAULT: "#F6F7F9",
          white: "#FFFFFC",
        },
        // Primary Colors
        primary: {
          blue: "#535EFF",
          "l-blue": "#7588FF",
          "blue-sec": "#302AD8",
          "dark-blue": "#2725AE",
          green: "#57CC99",
          violet: "#AA8FFF",
          "l-red": "#FF5353",
          sky: "#DBEDFF",
          "l-sky": "#EEF5FC",
          DEFAULT: "#535EFF", // Blue as default primary
        },
        // Success Colors
        success: {
          "d-green": "#027A48",
          forest: "#DDF5EB",
          DEFAULT: "#57CC99", // Green as default success
        },
        // Warning/Error Colors
        warning: {
          orange: "#DC6803",
          lemon: "#FEF0C7",
          DEFAULT: "#DC6803", // Orange as default warning
        },
        error: {
          "d-red": "#B00020",
          pink: "#FDF2FA",
          DEFAULT: "#B00020", // D_Red as default error
        },
      },
    },
  },
  plugins: [daisyui],
} satisfies Config;
