export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B2E2E', // Deep Burgundy
        background: '#FAF7F3', // Soft Cream
        secondary: '#F6EFE8', // Warm Beige
        accent: '#B88B6A', // Gold-Beige
        text: {
          main: '#2E2E2E', // Dark Charcoal
          muted: '#7A6F68', // Muted Gray
        },
        brand: {
          dark: '#6B2E2E',
          light: '#FAF7F3'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Poppins', 'Inter', 'sans-serif'],
      },
      backgroundImage: {
        'subtle-pattern': "url('https://www.transparenttextures.com/patterns/cubes.png')", // Example subtle pattern or keep empty for now
      }
    },
  },
  plugins: [],
}
