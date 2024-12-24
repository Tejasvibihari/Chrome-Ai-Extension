/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: "#CC72F2",
          200: "#BF60E7",
          300: "#7F00C2",
          400: "#290885",
          500: "#171559",
        },
        secondary: {
          100: "#404040",
          200: "#212121",
        },
      },
      fontFamily: {
        kanit: ["Kanit", "serif"],
      },
    },
  },
  plugins: [],
}