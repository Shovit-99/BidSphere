/**
 * BIDSPHERE — Heritage Editorial Design System
 * Aesthetic: International Auction House meets Contemporary Editorial Marketplace
 * Palette: Warm Ivory, Cream, Charcoal Black, Burnt Orange, Antique Gold
 */

export const THEME = {
  colors: {
    bg: {
      ivory: '#FBF9F5',
      cream: '#F4EFE6',
      sand: '#EBE4D5',
      card: '#FFFFFF',
      charcoal: '#14171A',
      charcoalSurface: '#1C2025',
      charcoalElevated: '#232830'
    },
    text: {
      primary: '#14171A',
      secondary: '#4A505A',
      muted: '#7C828D',
      light: '#FBF9F5',
      burnt: '#D95A2B',
      gold: '#C5A059'
    },
    border: {
      editorial: '#E2D9C8',
      light: '#EFE9DF',
      dark: '#2A2E38'
    },
    accent: {
      burnt: '#D95A2B',
      burntHover: '#C04B1F',
      burntLight: '#FAF0EB',
      gold: '#C5A059',
      goldLight: '#FDF9F0'
    }
  },
  fonts: {
    serif: '"Playfair Display", Georgia, serif',
    cormorant: '"Cormorant Garamond", Georgia, serif',
    sans: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
  }
};

export const EDITORIAL_CLASSES = {
  pageBg: 'bg-[#FBF9F5] text-[#14171A] min-h-screen font-sans',
  card: 'bg-white rounded-2xl border border-[#E2D9C8] shadow-[0_4px_20px_-2px_rgba(20,23,26,0.05)] hover:shadow-[0_12px_32px_-4px_rgba(20,23,26,0.08)] transition-all duration-300',
  charcoalCard: 'bg-[#14171A] text-white rounded-2xl border border-[#2A2E38] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)]',
  btnBurnt: 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#D95A2B] hover:bg-[#C04B1F] active:bg-[#A83F17] text-white font-bold text-xs sm:text-sm shadow-[0_4px_14px_rgba(217,90,43,0.3)] hover:shadow-[0_6px_20px_rgba(217,90,43,0.4)] transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer',
  btnCharcoal: 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#14171A] hover:bg-[#232830] text-white font-bold text-xs sm:text-sm transition-all duration-200 cursor-pointer border border-[#2A2E38]',
  btnOutline: 'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-[#F4EFE6] text-[#14171A] font-bold text-xs sm:text-sm border border-[#E2D9C8] transition-all duration-200 cursor-pointer',
  chip: 'px-4 py-2 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer whitespace-nowrap',
  chipActive: 'bg-[#14171A] text-white shadow-xs',
  chipInactive: 'bg-white text-[#4A505A] border border-[#E2D9C8] hover:bg-[#F4EFE6] hover:text-[#14171A]',
  headingSerif: 'font-serif tracking-tight text-[#14171A]'
};
