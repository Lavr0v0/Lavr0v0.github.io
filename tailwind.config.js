/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './app.js', './en/index.html', './en/app.js', './en/Projects/index.html', './en/Projects/app.js', './Projects/index.html', './Projects/app.js', './Labs/index.html', './Labs/app.js', './DnD/index.html', './DnD/app.js'],
  theme: {
    fontFamily: {
      sans: ['"Alibaba PuHuiTi"', 'system-ui', 'sans-serif'],
      mono: ['"Alibaba PuHuiTi"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
    },
  },
  plugins: [],
}
