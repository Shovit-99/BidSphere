/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        heritage: {
          ivory: '#FBF9F5',        // Warm ivory background
          cream: '#F4EFE6',        // Warm cream panel & surfaces
          sand: '#EBE4D5',         // Muted sand border / accent
          border: '#E2D9C8',       // Refined hairline border
          'border-dark': '#2A2E38',// Border for charcoal dark surfaces
          charcoal: '#14171A',     // Primary charcoal black
          'charcoal-surface': '#1C2025', // Content panel charcoal
          'charcoal-elevated': '#232830',// Elevated cards/modals
          burnt: '#D95A2B',        // Primary signature burnt orange
          'burnt-hover': '#C04B1F',// Burnt orange hover state
          'burnt-light': '#FAF0EB',// Soft burnt orange tint badge
          gold: '#C5A059',         // Refined antique gold
          'gold-light': '#FDF9F0', // Antique gold tint
          muted: '#7C828D',        // Editorial subtitle/label color
        },
        obsidian: {
          950: '#06080D',
          900: '#0B0F17',
          800: '#101622',
          700: '#161E2E',
        },
        gold: {
          200: '#F5E6B3',
          300: '#EBD17D',
          400: '#D4AF37',
          500: '#B89225',
        }
      },
      boxShadow: {
        'editorial-card': '0 4px 20px -2px rgba(20, 23, 26, 0.05), 0 2px 6px -1px rgba(20, 23, 26, 0.03)',
        'editorial-hover': '0 12px 32px -4px rgba(20, 23, 26, 0.08), 0 4px 12px -2px rgba(20, 23, 26, 0.04)',
        'burnt-glow': '0 6px 20px -2px rgba(217, 90, 43, 0.35)',
        'charcoal-card': '0 20px 40px -15px rgba(0, 0, 0, 0.5), inset 0 1px 0 0 rgba(255, 255, 255, 0.06)',
      }
    },
  },
  plugins: [],
};
