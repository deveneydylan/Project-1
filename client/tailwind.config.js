/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#003057',
          light: '#0a4070',
          dark: '#001f3d',
          50: '#e6eef5',
        },
        gold: {
          DEFAULT: '#EAAA00',
          light: '#f5c842',
          dark: '#c89200',
          50: '#fdf6d9',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
      },
    },
  },
  plugins: [],
}
