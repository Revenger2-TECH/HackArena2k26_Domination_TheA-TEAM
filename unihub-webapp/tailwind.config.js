/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e94560',
        secondary: '#ff6b6b',
        dark: '#1a1a2e',
        darker: '#16213e',
        accent: '#0f3460'
      },
      fontFamily: {
        sans: ['Segoe UI', 'sans-serif']
      }
    }
  },
  plugins: []
}
