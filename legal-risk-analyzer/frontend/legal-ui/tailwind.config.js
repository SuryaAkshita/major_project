/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'legal-navy': '#0a0f1a',
        'legal-navy-light': '#0f1729',
        'legal-charcoal': '#0d1321',
        'legal-slate': '#1e293b',
        'legal-slate-light': '#334155',
        'legal-stone': '#e2e8f0',
        'legal-gold': '#d4a853',
        'legal-gold-muted': '#b8923d',
        'legal-steel': '#3b82f6',
        'legal-steel-light': '#60a5fa',
        'legal-off-white': '#f1f5f9',
        'legal-gray': '#94a3b8',
        'legal-mint': '#34d399',
      },
      fontFamily: {
        'serif': ['Playfair Display', 'Libre Baskerville', 'serif'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'sidebar': '25%',
        'main': '75%',
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(59, 130, 246, 0.25)',
        'glow-gold': '0 0 30px -8px rgba(212, 168, 83, 0.35)',
        'card': '0 4px 24px -4px rgba(0, 0, 0, 0.25)',
        'card-hover': '0 8px 32px -8px rgba(0, 0, 0, 0.35)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'mesh': 'radial-gradient(at 40% 20%, rgba(59, 130, 246, 0.08) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(212, 168, 83, 0.06) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(30, 41, 59, 0.4) 0px, transparent 50%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.35s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(8px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

