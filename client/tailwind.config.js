/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'forest-green': '#2E7D32',
        'ocean-blue': '#1565C0',
        'alert-red': '#D32F2F',
      }
    },
  },
  plugins: [],
}
