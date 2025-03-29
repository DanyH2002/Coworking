module.exports = {
  content: [
    "./src/**/*.{html,ts}"
  ],
  theme: {
    extend: {
      fontFamily: {
        prime: ['PrimeIcons']
      }
    }
  },
  plugins: [require('tailwindcss-primeui')],
};
