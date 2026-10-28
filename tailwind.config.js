/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#1B4332',
          950: '#0d281e',
        },
        cream: {
          50: '#FDFCF9',
          100: '#FAF6EE',
          200: '#F5EFEB',
          300: '#EFE8DD',
          400: '#E2D8C7',
          500: '#CBBFA9',
        },
        earth: {
          50: '#fdf8f6',
          100: '#f2e8e5',
          600: '#8d5b4c',
          700: '#754638',
          800: '#5c3528',
          900: '#45261c',
        },
        accent: {
          amber: '#D97706',
          gold: '#F59E0B',
          honey: '#E59819',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.03)',
        'card': '0 4px 20px -2px rgba(27, 67, 50, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 12px 30px -4px rgba(27, 67, 50, 0.15), 0 4px 12px -2px rgba(0, 0, 0, 0.06)',
      }
    },
  },
  plugins: [],
}
