/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./js/**/*.js"
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ['Rajdhani', 'sans-serif'],
        heading: ['Orbitron', 'sans-serif'],
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ]
}
