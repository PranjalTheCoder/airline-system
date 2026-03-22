/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,ts,scss}'
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body:    ['DM Sans', 'system-ui', 'sans-serif'],
        mono:    ['DM Mono', 'monospace'],
      },
      colors: {
        sky: {
          50:  '#eff6ff',
          100: '#dbeafe',
          300: '#60a5fa',
          400: '#3b82f6',
          500: '#1d4ed8',
          600: '#1e3a6e',
          700: '#1a2540',
          800: '#0f1829',
          900: '#0a0f1e',
        },
        gold: {
          100: '#fef9e7',
          300: '#f0cc6a',
          400: '#d4af37',
          500: '#c9a227',
        },
        neutral: {
          50:  '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          600: '#374151',
          700: '#252836',
          800: '#1a1d27',
          900: '#0f1117',
          950: '#080c16',
        }
      },
      borderRadius: {
        'card': '16px',
        'btn':  '10px',
      },
      boxShadow: {
        'card':  '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'float': '0 16px 48px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.08)',
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.4s ease forwards',
        'shimmer':    'shimmer 1.5s infinite',
      },
    },
  },
  plugins: [],
};
