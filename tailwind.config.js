/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#e8a838',
          dark: '#c8891a',
          soft: 'rgba(232, 168, 56, 0.12)',
        },
        sidebar: {
          bg: '#0f1117',
          text: '#a0a8b8',
          active: '#ffffff',
        },
        surface: {
          DEFAULT: '#ffffff',
          2: '#f7f8fa',
          3: '#eef0f4',
        },
        danger: {
          DEFAULT: '#ef4444',
          soft: 'rgba(239, 68, 68, 0.1)',
        },
        success: {
          DEFAULT: '#22c55e',
          soft: 'rgba(34, 197, 94, 0.1)',
        },
        warning: {
          DEFAULT: '#f59e0b',
          soft: 'rgba(245, 158, 11, 0.1)',
        },
        info: {
          DEFAULT: '#3b82f6',
          soft: 'rgba(59, 130, 246, 0.1)',
        },
        text: {
          primary: '#0f1117',
          secondary: '#6b7280',
          muted: '#9ca3af',
        },
        border: '#e2e5eb',
      },
      fontFamily: {
        sans: ['Sora', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        sm: '6px',
        DEFAULT: '10px',
        lg: '16px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        DEFAULT: '0 4px 16px rgba(0,0,0,0.08)',
        lg: '0 8px 32px rgba(0,0,0,0.12)',
      },
      height: {
        header: '60px',
      },
      width: {
        sidebar: '240px',
      }
    },
  },
  plugins: [],
}
