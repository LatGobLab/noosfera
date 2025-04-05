/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#007AFF",
          light: "#47A3FF",
          dark: "#0055B3",
        },
        secondary: {
          DEFAULT: "#5856D6",
          light: "#7A79E0",
          dark: "#3E3D96",
        },
        accent: {
          DEFAULT: "#FF2D55",
          light: "#FF6B8B",
          dark: "#CC0022",
        },
        background: {
          DEFAULT: "#FFFFFF",
          dark: "#000000",
        },
        text: {
          DEFAULT: "#000000",
          light: "#FFFFFF",
          gray: "#8E8E93",
        },
      },
    },
  },
  plugins: [],
};
