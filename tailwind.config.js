/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/web/pages/**/*.{js,ts,jsx,tsx}',
    './src/web/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: '#1d1e26',
        gray: '#0B0D19',
        red_pink: '#ff9580',
        red_dark: '#ff6e51e6',
        white: '#f8f8f2',
      },
    },
  },
  plugins: [],
};
