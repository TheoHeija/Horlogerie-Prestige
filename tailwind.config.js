/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#161b1d',
          foreground: '#ffffff',
        },
        border: 'hsl(var(--border))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
      },
      keyframes: {
        aurora: {
          from: { backgroundPosition: '0% 0%' },
          to: { backgroundPosition: '100% 0%' },
        },
        'shimmer-slide': {
          '0%, 100%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
        },
        'spin-around': {
          'from': {
            transform: 'translateX(50%) translateY(50%) rotate(0deg)'
          },
          'to': {
            transform: 'translateX(50%) translateY(50%) rotate(360deg)'
          }
        },
        grid: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(100%)' },
        },
        shine: {
          'from': {
            backgroundPosition: '200% 0'
          },
          'to': {
            backgroundPosition: '-200% 0'
          }
        },
      },
      animation: {
        aurora: 'aurora 10s linear infinite',
        'shimmer-slide': 'shimmer-slide 1.5s linear infinite',
        'spin-around': 'spin-around 5s cubic-bezier(0.5, 0, 0.5, 1) infinite',
        grid: 'grid 15s linear infinite',
        gradient: 'aurora 4s linear infinite',
        shine: 'shine 3s linear infinite',
      },
    },
  },
  plugins: [],
}

