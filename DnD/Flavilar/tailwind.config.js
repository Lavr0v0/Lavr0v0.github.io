/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html'],
  theme: {
    extend: {
      colors: {
        dnd: {
          dark: '#0c0b0a',
          paper: '#11100e',
          light: '#eae4d9',
          gold: '#c5a059',
          emerald: '#10b981',
          muted: '#8c8273'
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'Noto Serif SC', 'serif'],
        garamond: ['Cormorant Garamond', 'Noto Serif SC', 'serif'],
      }
    }
  },
  plugins: [],
}
