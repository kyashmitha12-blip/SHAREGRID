/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ivory: {
          50: '#FDFCF9',
          100: '#FAF7F0',
          200: '#F4EFE6',
          300: '#EAE3D6',
          400: '#DED5C4',
          500: '#CFC3AE',
        },
        forest: {
          950: '#0B1610',
          900: '#112219',
          850: '#162C21',
          800: '#1B3729',
          700: '#254A37',
          600: '#32624A',
          500: '#427E60',
          200: '#C5DDD0',
          100: '#E4EFE8',
          50: '#F2F7F4',
        },
        charcoal: {
          950: '#111413',
          900: '#1A1E1D',
          800: '#252B29',
          700: '#373E3B',
          600: '#4F5854',
          500: '#6C7672',
          400: '#919B97',
          300: '#BEC5C2',
          200: '#DEE3E1',
          100: '#EFF2F1',
        },
        accent: {
          lime: '#D2E646',
          'lime-hover': '#C3D833',
          'lime-light': '#F4F9D6',
          'lime-deep': '#68770F',
        }
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        'sm': '2px',
        'DEFAULT': '4px',
        'md': '6px',
        'lg': '8px',
        'xl': '12px',
      },
      boxShadow: {
        'editorial': '0 1px 3px rgba(17, 34, 25, 0.05), 0 10px 25px -5px rgba(17, 34, 25, 0.04)',
        'editorial-hover': '0 4px 6px -1px rgba(17, 34, 25, 0.06), 0 20px 30px -10px rgba(17, 34, 25, 0.08)',
        'modal': '0 25px 50px -12px rgba(17, 34, 25, 0.25)',
      }
    },
  },
  plugins: [],
}
