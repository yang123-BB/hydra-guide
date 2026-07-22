/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EEEDFE',
          100: '#CECBF6',
          200: '#AFA9EC',
          400: '#7F77DD',
          500: '#534AB7',
          600: '#3C3489',
          700: '#26215C',
        },
        accent: {
          50: '#FAECE7',
          100: '#F5C4B3',
          400: '#D85A30',
          500: '#993C1D',
          600: '#712B13',
        },
      },
    },
  },
  plugins: [],
}
