const pseudoElementVariantsExtend = [
  'width',
  'height',
  'fontSize',
  'textColor',
  'backgroundColor',
  'borderWidth',
  'borderColor',
  'borderStyle',
  'position',
].reduce((s, c) => ((s[c] = ['before', 'after', 'hover::before', 'hover::after']), s), {})

/** @see https://tailwindcss.com/docs */
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
        'theme-green-darker': '#4DA944',
        'theme-blue': '#0E6CA5',
      },
    },
  },
  variants: {
    scrollbar: ['rounded'],
    extend: {
      ...pseudoElementVariantsExtend,
    },
  },
  plugins: [
    /** @see https://github.com/adoxography/tailwind-scrollbar */
    require('tailwind-scrollbar'),

    /** @see https://github.com/croutonn/tailwindcss-pseudo-elements */
    require('tailwindcss-pseudo-elements')({
      contentUtilities: { prefix: 'tw-content' },
      emptyContent: false,
      classNameReplacer: {},
    }),
  ],
}
