/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'kilegram-blue': '#00a6ff', // أزرق نيون كهربائي
        'kill-red': '#ff3b3b',
        'slate-950': '#0b1120',
      },
      keyframes: {
        glow: {
          '0%': { textShadow: '0 0 5px #00a6ff, 0 0 10px #00a6ff' },
          '100%': { textShadow: '0 0 20px #00a6ff, 0 0 30px #00a6ff' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px #00a6ff, 0 0 40px #00a6ff' },
          '50%': { boxShadow: '0 0 30px #ff3b3b, 0 0 60px #ff3b3b' },
        },
      },
      animation: {
        glow: 'glow 2s ease-in-out infinite alternate',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}