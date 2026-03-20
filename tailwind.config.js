/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './app.js', './en/index.html', './en/app.js'],
  theme: {
    fontFamily: {
      sans: ['"Alibaba PuHuiTi"', 'system-ui', 'sans-serif'],
      mono: ['"Alibaba PuHuiTi"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
    },
  },
  plugins: [],
}
