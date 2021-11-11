module.exports = {
  purge: ['./src/**/*.{ts,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'theme-green': '#0E7B3B',
        'theme-green-light': '#E4F5EB',
        'theme-green-dark': '#0E7B3B',
      },
    },
  },
  variants: {
    scrollbar: ['rounded'],
    extend: {},
  },
  plugins: [
    /** @see https://github.com/adoxography/tailwind-scrollbar */
    require('tailwind-scrollbar'),
  ],
}
