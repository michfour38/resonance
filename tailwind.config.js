/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx}',
    './server/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#2D4A3E',
          mid:     '#4A7C6F',
          light:   '#D1E7E0',
          subtle:  '#F2F7F5',
        },
      },
    },
  },
  plugins: [],
};
