/** @type {import('tailwindcss').Config} */
module.exports = {
  // Versión súper explícita para Windows
  content: [
    './index.html',
    './src/App.jsx', // Apuntamos directamente al archivo
    './src/main.jsx' // Y a este, por si acaso
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
