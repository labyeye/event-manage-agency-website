module.exports = {
  content: [
    './*.html',
    './*.js'
  ],
  css: [
    './styles-premium.css',
    './components.css',
    './pages.css',
    './layout.css'
  ],
  output: './purged-css',
  safelist: [
    /^active/,
    /^show/,
    /^open/,
    /^fade/,
  ]
}