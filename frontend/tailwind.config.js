/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'cnn-red': '#CC0000',
        'cnn-dark': '#1a1a1a',
        'cnn-gray': '#f8f9fa',
      },
    },
  },
  plugins: [],
} 