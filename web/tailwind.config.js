/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eefbf9',
          100: '#d3f4ef',
          200: '#a9e8e1',
          300: '#74d5cd',
          400: '#40bab3',
          500: '#219e99',
          600: '#167e7d',
          700: '#166465',
          800: '#165051',
          900: '#154244',
          950: '#06282a',
        },
        accent: {
          50: '#fef6ee',
          100: '#fce9d5',
          200: '#f8cfa9',
          300: '#f3ad73',
          400: '#ee853c',
          500: '#e96a20',
          600: '#da5116',
          700: '#b53d15',
          800: '#903218',
          900: '#742c17',
        },
        ink: {
          50: '#f7f8f8',
          100: '#eef0f0',
          200: '#dadfdf',
          300: '#b9c2c2',
          400: '#909d9e',
          500: '#6f7d7e',
          600: '#586566',
          700: '#495253',
          800: '#3e4546',
          900: '#363c3d',
          950: '#1f2425',
        },
      },
      fontFamily: {
        display: ['Schibsted Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Hanken Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(21, 66, 68, 0.04), 0 8px 24px -12px rgba(21, 66, 68, 0.18)',
        pop: '0 12px 40px -12px rgba(21, 66, 68, 0.35)',
      },
    },
  },
  plugins: [],
}
