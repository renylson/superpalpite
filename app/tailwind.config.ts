import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sp: {
          black: '#0a0a0a',
          dark: '#1a1a1a',
          card: '#2a2a2a',
          gold: '#FFD700',
          'gold-dark': '#F5A623',
          white: '#ffffff',
          gray: '#888888',
          success: '#22c55e',
          error: '#ef4444',
          warning: '#f59e0b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Barlow Condensed', 'Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;

