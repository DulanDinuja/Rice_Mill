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
        // Light mode - Traditional Inventory Colors
        light: {
          primary: '#2E7D32',      // Deep Green
          secondary: '#66BB6A',    // Paddy Green
          accent: '#F9A825',       // Rice Gold
          background: '#FDFBF6',   // Soft Cream
          card: '#FFFFFF',         // White
          textPrimary: '#263238',  // Dark Gray
          textMuted: '#607D8B',    // Gray
          danger: '#D32F2F'        // Soft Red
        },
        // Dark mode - Gaming Glass Colors
        primary: {
          50: '#e6fff4',
          100: '#ccffea',
          200: '#99ffd5',
          300: '#66ffc0',
          400: '#33ffab',
          500: '#00FF88',
          600: '#00cc6d',
          700: '#009952',
          800: '#006636',
          900: '#00331b'
        },
        secondary: {
          50: '#f5e6ff',
          100: '#ebccff',
          200: '#d699ff',
          300: '#c266ff',
          400: '#ad33ff',
          500: '#8A2BE2',
          600: '#6e22b5',
          700: '#521a88',
          800: '#37115a',
          900: '#1b092d'
        },
        accent: {
          50: '#e6f9ff',
          100: '#ccf3ff',
          200: '#99e8ff',
          300: '#66dcff',
          400: '#33d1ff',
          500: '#00D9FF',
          600: '#00add9',
          700: '#0082b3',
          800: '#00568c',
          900: '#002b66'
        },
        dark: {
          bg: '#0A0A0A',
          card: '#1A1A2E',
          surface: '#16213E',
          elevation: '#0F3460'
        },
        border: 'rgba(255, 255, 255, 0.1)'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        gaming: ['Orbitron', 'Rajdhani', 'sans-serif']
      },
      animation: {
        'neon-pulse': 'neon-pulse 2s ease-in-out infinite',
        'float': 'float 3s ease-in-out infinite',
        'hologram': 'hologram 3s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        'neon-pulse': {
          '0%, 100%': { boxShadow: '0 0 5px #00ff88, 0 0 10px #00ff88' },
          '50%': { boxShadow: '0 0 20px #00ff88, 0 0 30px #00ff88, 0 0 40px #00ff88' }
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        'hologram': {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '100% 50%' }
        },
        'glow': {
          'from': { textShadow: '0 0 10px #00ff88, 0 0 20px #00ff88' },
          'to': { textShadow: '0 0 20px #00ff88, 0 0 30px #00ff88, 0 0 40px #00ff88' }
        }
      },
      backdropBlur: {
        xs: '2px'
      }
    },
  },
  plugins: [],
}
