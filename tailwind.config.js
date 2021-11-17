module.exports = {
  purge: ['./src/**/*.{ts,tsx}'],
  darkMode: false,
  theme: {
    extend: {
      colors: {
        'theme-green-lightest': '#E4F5EB',
        'theme-green-light': '#14A86B',
        'theme-green': '#0E7B3B',
        'theme-green-dark': '#0E7B3B',
        'theme-blue': '#0E6CA5',
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
