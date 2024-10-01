/** @type {import('tailwindcss').Config} */
export default {
  content: ["./components/**/*.{js,ts,tsx,jsx}", "./app/**/*.{js,ts,tsx,jsx}"],
  theme: {},
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
