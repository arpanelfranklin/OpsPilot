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
        devops: {
          bg: '#0B0F19',
          card: '#111827',
          cardHover: '#172033',
          border: '#1F2937',
          borderSubtle: '#374151',
          accent: '#3B82F6',
          accentGlow: 'rgba(59, 130, 246, 0.15)',
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          muted: '#9CA3AF',
          highlight: '#6366F1'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
