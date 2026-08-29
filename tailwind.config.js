/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef4ff',
          100: '#d9e5ff',
          200: '#bcd0ff',
          300: '#8eb0ff',
          400: '#5985ff',
          500: '#3459f7',
          600: '#1f3ceb',
          700: '#1a2dd8',
          800: '#1b28af',
          900: '#1c2a8a',
        },
        ink: {
          50: '#f6f7f9',
          100: '#eceef2',
          200: '#d5d9e2',
          300: '#b0b8c9',
          400: '#8590a8',
          500: '#66718c',
          600: '#525a73',
          700: '#434a5e',
          800: '#3a4050',
          900: '#191d28',
        },
      },
      boxShadow: {
        card: '0 1px 2px rgba(16,24,40,.04), 0 8px 24px rgba(16,24,40,.06)',
        panel: '0 1px 3px rgba(16,24,40,.06), 0 12px 40px rgba(16,24,40,.10)',
        phone: '0 24px 70px rgba(16,24,40,.22)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"PingFang SC"', '"Microsoft YaHei"', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
