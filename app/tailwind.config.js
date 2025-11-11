/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        notion: {
          purple: '#9333ea',
          'purple-light': '#e9d5ff',
          'purple-bg': '#faf5ff',
          blue: '#3b82f6',
          'blue-light': '#dbeafe',
          'blue-bg': '#eff6ff',
          pink: '#ec4899',
          'pink-light': '#fce7f3',
          'pink-bg': '#fdf2f8',
        },
      },
      backgroundImage: {
        'gradient-notion': 'linear-gradient(135deg, #faf5ff 0%, #eff6ff 100%)',
        'gradient-text': 'linear-gradient(135deg, #9333ea, #3b82f6)',
        'gradient-button': 'linear-gradient(135deg, #9333ea, #3b82f6)',
        'gradient-shine': 'linear-gradient(135deg, #ec4899, #8b5cf6, #3b82f6)',
      },
      animation: {
        'pulse-slow': 'pulse 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s infinite',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
}
