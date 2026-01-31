/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'legal-navy': '#0E1628',
        'legal-charcoal': '#111827',
        'legal-slate': '#1F2937',
        'legal-stone': '#E5E7EB',
        'legal-gold': '#C8A24D',
        'legal-steel': '#4B6FAF',
        'legal-off-white': '#F9FAFB',
        'legal-gray': '#6B7280',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Libre Baskerville', 'serif'],
        'sans': ['Inter', 'Source Sans Pro', 'sans-serif'],
      },
      spacing: {
        'sidebar': '25%',
        'main': '75%',
      },
    },
  },
  plugins: [],
}

