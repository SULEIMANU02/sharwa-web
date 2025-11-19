/******** Tailwind config (JS) ********/
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0a57ff',
          500: '#0a57ff',
          600: '#064fe3',
        },
        accent: '#00c389'
      }
    },
  },
  plugins: [],
}
