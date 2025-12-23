/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        netflix: {
          red: '#E50914',
          black: '#141414',
          dark: '#0b0b0f', // Keeping the slightly lighter dark for contrast if needed
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        stranger: ['Merriweather', 'serif'],
      },
      dropShadow: {
        'glow': '0 0 10px rgba(229, 9, 20, 0.5)',
      }
    }
  },
  plugins: []
};
