/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        sangpa: {
          50: '#F6F9F2',
          100: '#E9EFDD',
          200: '#D3DEBA',
          300: '#BDCE97',
          400: '#A7BD75',
          500: '#91AD52',
          600: '#7B9643',
          700: '#5F7533',
          800: '#3D4C1F',
          900: '#1F280E',
          950: '#141C09',
        },
        emergency: {
          50: '#FDF2F2',
          100: '#FDE8E8',
          200: '#FBD5D5',
          500: '#E05252',
          600: '#C83B3B',
          700: '#9B1C1C',
        }
      },
      fontFamily: {
        sans: ['Nunito', 'Segoe UI', '-apple-system', 'BlinkMacSystemFont', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(95, 117, 51, 0.08), 0 2px 6px -1px rgba(95, 117, 51, 0.04)',
        'card': '0 6px 24px rgba(61, 76, 31, 0.06)',
        'touch': '0 8px 30px rgba(145, 173, 82, 0.25)',
      },
      borderRadius: {
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      }
    },
  },
  plugins: [],
}
