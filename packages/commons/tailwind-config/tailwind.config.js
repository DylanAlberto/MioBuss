/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');
delete colors.lightBlue;
delete colors.warmGray;
delete colors.trueGray;
delete colors.coolGray;
delete colors.blueGray;

module.exports = {
  content: [
    'src/**/*.{js,ts,jsx,tsx}',
    '../ui/src/**/*.{js,ts,jsx,tsx}',
    './index.html',
  ],
  theme: {
    extend: {
      colors,
    },
    colors: {
      primary: '#654ee6',
      secondary: '#846cfb',
      tertiary: '#30658e',
    },
  },
  plugins: [],
  darkMode: 'media',
  important: true,
};
