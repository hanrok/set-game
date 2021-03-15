const defaultConfig = require('tailwindcss/defaultConfig')

module.exports = {
  purge: [
    'src/**/*.{ts,tsx,jsx,js},',
    './public/index.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      display: ['Poppins', ...defaultConfig.theme.fontFamily.sans]
    },
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
