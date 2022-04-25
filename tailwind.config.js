module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  mode: 'jit',
  theme: {
    screens: {
      'mb-ext': '450px',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      fontFamily: {
        pixel: ['"PixelCowboy"', 'cursive'],
        card: ['"Card"', 'cursive'],
      },
    },
  },
  plugins: [],
}
