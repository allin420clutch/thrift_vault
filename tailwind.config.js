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
        'tv-black':   '#0a0a0a',
        'tv-surface': '#111111',
        'tv-card':    '#1a1a1a',
        'tv-border':  '#2a2a2a',
        'tv-muted':   '#3a3a3a',
        'tv-text':    '#e8e8e8',
        'tv-subtle':  '#888888',
        'tv-green':   '#00ff41',
        'tv-green-d': '#00cc33',
        'tv-amber':   '#f59e0b',
        'tv-rose':    '#f43f5e',
        'tv-blue':    '#3b82f6',
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Roboto Mono"', 'monospace'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hero-gradient': 'radial-gradient(ellipse at 20% 50%, rgba(0,255,65,0.08) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(0,255,65,0.04) 0%, transparent 50%)',
        'card-gradient': 'linear-gradient(135deg, #1a1a1a 0%, #111111 100%)',
        'green-glow':    'radial-gradient(circle at center, rgba(0,255,65,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'green-sm': '0 0 10px rgba(0,255,65,0.15)',
        'green-md': '0 0 20px rgba(0,255,65,0.2)',
        'green-lg': '0 0 40px rgba(0,255,65,0.25)',
        'card':     '0 4px 24px rgba(0,0,0,0.6)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.8)',
      },
      animation: {
        'fade-in':    'fadeIn 0.5s ease-out',
        'slide-up':   'slideUp 0.6s ease-out',
        'pulse-green':'pulseGreen 2s ease-in-out infinite',
        'float':      'float 3s ease-in-out infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
        'ticker':     'ticker 30s linear infinite',
      },
      keyframes: {
        fadeIn:     { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp:    { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        pulseGreen: { '0%,100%': { boxShadow: '0 0 10px rgba(0,255,65,0.2)' }, '50%': { boxShadow: '0 0 30px rgba(0,255,65,0.5)' } },
        float:      { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-8px)' } },
        glowPulse:  { '0%,100%': { opacity: '0.6' }, '50%': { opacity: '1' } },
        ticker:     { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
}
