/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0A2540',
          blue: '#0D3B66',
          lightBlue: '#E8F1F5',
          gold: '#C5A059',
          amber: '#D97706',
          terracotta: '#E07A5F',
          green: '#2A9D8F',
          darkGreen: '#1E6F5C',
          surface: '#F8FAFC',
          card: '#FFFFFF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'gov': '0 2px 8px -1px rgba(10, 37, 64, 0.08), 0 1px 4px -1px rgba(10, 37, 64, 0.04)',
        'gov-lg': '0 10px 25px -3px rgba(10, 37, 64, 0.1), 0 4px 10px -2px rgba(10, 37, 64, 0.05)',
      },
    },
  },
  plugins: [],
}
