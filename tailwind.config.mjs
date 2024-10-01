/** @type {import('tailwindcss').Config} */
export default {
  content: ["./components/**/*.{js,ts,tsx,jsx}", "./app/**/*.{js,ts,tsx,jsx}"],
  theme: {
    extend: {
      colors: {
        purple: {
          1200: "#32103E"
        },
        orange: {
          1200: "#FE9356"
        },
        pink: {
          1200: "#F2386C"
        },
        gray: {
          1200: "#EDEAE5",
          1300: "#D9D4CC"
        }
      }
    }
  },
  plugins: [
    require("@designbycode/tailwindcss-text-stroke"),
  ],
  safelist: [
    "ring-1",
    "ring-offset-cyan-700",
    "ring-offset-2",
    "bg-cyan-800",
    "text-white",
  ],
};
