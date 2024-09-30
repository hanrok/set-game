/** @type {import('tailwindcss').Config} */
export default {
  content: ["./components/**/*.{js,ts,tsx,jsx}", "./app/**/*.{js,ts,tsx,jsx}"],
  theme: {},
  plugins: [],
  safelist: [
    {
      pattern: /bg-(cyan)-(100|500|700|800)/, // You can display all the colors that you need
    },
    {
      pattern: /ring-*/, // You can display all the colors that you need
    },
  ],
};
