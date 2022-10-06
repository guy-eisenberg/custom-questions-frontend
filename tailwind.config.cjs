const colors = require('tailwindcss/colors');
const theme = require('tailwindcss/defaultTheme');

deleteDeprecatedColors(colors);

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      ...theme.fontSize,
      title: ['3rem', '1'],
      'small-title': ['1.5rem', '2rem'],
      small: ['0.875rem', '1.25rem'],
      'extra-small': ['0.75rem', '1rem'],
    },
    colors: {
      ...colors,
      'theme-blue': '#00acdd',
      'theme-green': '#74d813',
      'theme-red': '#e42031',
      'theme-light-gray': '#c6c6c6',
      'theme-medium-gray': '#8e8e8e',
      'theme-dark-gray': '#6b6b6b',
      'theme-extra-dark-gray': '#3d3d3d',
    },
    extend: {
      fontFamily: {
        sans: ['Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

function deleteDeprecatedColors(colors) {
  ['lightBlue', 'warmGray', 'trueGray', 'coolGray', 'blueGray'].forEach(
    function deleteColor(color) {
      delete colors[color];
    }
  );
}
