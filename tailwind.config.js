/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  extend: {
    keyframes: {
      scanning: {
        '0%': { transform: 'translateX(-100%)' },
        '100%': { transform: 'translateX(400%)' },
      },
      'fade-in': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
    },
    animation: {
      scanning: 'scanning 1.4s ease-in-out infinite',
      'fade-in': 'fade-in 0.3s ease-out forwards',
    },
  },
  plugins: [],
}
