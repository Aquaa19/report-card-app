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
        // Core background and surface tokens from Stitch HTML
        background: '#121223',
        surface: {
          DEFAULT: '#121223',
          dim: '#121223',
          bright: '#38374a',
          container: '#1e1e30',
          'container-low': '#1a1a2b',
          'container-high': '#28283b',
          'container-highest': '#333346',
        },
        // Primary and Tertiary tokens for Luminescent Scholar
        primary: {
          DEFAULT: '#b8c3ff',
          container: '#2e5bff',
          fixed: '#dde1ff',
          'fixed-dim': '#b8c3ff',
        },
        tertiary: {
          DEFAULT: '#00dbe7',
          container: '#007980',
          fixed: '#74f5ff',
        },
        secondary: {
          DEFAULT: '#d8b9ff',
          container: '#6e06d0',
        },
        // Text and Interface colors
        on: {
          surface: '#e3e0f9',
          'surface-variant': '#c4c5d9',
          primary: '#002388',
          'primary-container': '#efefff',
          tertiary: '#00363a',
          error: '#690005',
        },
        outline: {
          DEFAULT: '#8e90a2',
          variant: '#434656',
        },
        error: {
          DEFAULT: '#ffb4ab',
          container: '#93000a',
        },
        // Map old text tokens to new Stitch tokens for compatibility
        text: {
          primary: '#e3e0f9',    // maps to on-surface
          secondary: '#c4c5d9',  // maps to on-surface-variant
          muted: '#8e90a2',      // maps to outline
        },
        border: {
          light: 'rgba(255, 255, 255, 0.08)',
          focus: '#2e5bff',
        },
        status: {
          success: '#00dbe7',    // Using tertiary for success in this theme
          warning: '#eddcff',
          error: '#ffb4ab',
        }
      },
      fontFamily: {
        headline: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '1rem',
        lg: '2rem',
        xl: '3rem',
      },
      boxShadow: {
        'glass': '0 4px 30px rgba(0, 0, 0, 0.2)',
        'glow-primary': '0 0 20px rgba(46, 91, 255, 0.3)',
        'glow-tertiary': '0 0 20px rgba(0, 219, 231, 0.3)',
      }
    },
  },
  plugins: [],
}
export default config;