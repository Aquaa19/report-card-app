import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#030014',
        surface: '#0B0524',
        surfaceHover: '#130B38',
        primary: {
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          glow: 'rgba(99, 102, 241, 0.5)'
        },
        secondary: {
          400: '#C084FC',
          500: '#A855F7',
          600: '#9333EA',
          glow: 'rgba(168, 85, 247, 0.5)'
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#94A3B8',
          muted: '#64748B'
        },
        border: {
          light: 'rgba(255, 255, 255, 0.08)',
          focus: 'rgba(99, 102, 241, 0.3)'
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'glow-primary': '0 0 20px rgba(99, 102, 241, 0.3)',
        'glow-secondary': '0 0 20px rgba(168, 85, 247, 0.3)',
      }
    },
  },
  plugins: [],
}
export default config;