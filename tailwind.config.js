/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Custom color palette matching the existing design
        'bg-primary': {
          DEFAULT: '#0a0a0a',
          light: '#f9fafb'
        },
        'bg-secondary': {
          DEFAULT: '#121212',
          light: '#ffffff'
        },
        'border-color': {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          light: '#e5e7eb'
        },
        'text-primary': {
          DEFAULT: '#ffffff',
          light: '#111827'
        },
        'text-secondary': {
          DEFAULT: '#a1a1aa',
          light: '#6b7280'
        },
        'accent-btn-bg': {
          DEFAULT: '#ffffff',
          light: '#111827'
        },
        'accent-btn-text': {
          DEFAULT: '#000000',
          light: '#ffffff'
        },
        // Status colors
        'success': '#34d399',
        'warning': '#fbbf24',
        'danger': '#fb7185',
        'info': '#fbbf24'
      },
      fontFamily: {
        'display': ['var(--font-display)', 'Space Grotesk', 'system-ui', 'sans-serif'],
        'body': ['var(--font-body)', 'Plus Jakarta Sans', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        'lg': '28px',
        'md': '18px'
      },
      boxShadow: {
        'soft': '0 24px 70px rgba(0, 0, 0, 0.5)',
        'card': '0 12px 40px rgba(0, 0, 0, 0.4)',
        'soft-light': '0 22px 60px rgba(15, 23, 42, 0.08)',
        'card-light': '0 12px 40px rgba(15, 23, 42, 0.08)'
      },
      spacing: {
        '18': '4.5rem'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.2s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        }
      }
    },
  },
  plugins: [],
}