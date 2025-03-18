import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'from-gold-primary/20',
    'via-transparent',
    'to-transparent',
    'from-gold-primary/30',
    'from-gold-secondary/30',
    'from-gold-accent/30',
  ],
  theme: {
    extend: {
      colors: {
        'gold-primary': '#D4AF37',    // Classic gold
        'gold-secondary': '#CFB53B',   // Rich gold
        'gold-accent': '#C5A028',      // Deep gold
        'gold-highlight': '#E6C640',   // Bright gold
        'gold-glow': '#FFD700',        // Metallic gold
        'dark-primary': '#FFFFFF',     // White
        'dark-secondary': '#FAFAFA',   // Very light grey
        'dark-tertiary': '#F5F5F5',    // Light background
        'text-primary': '#0F1111',     // Dark text
        'text-secondary': '#565959',   // Secondary text
      },
      backgroundColor: {
        'amazon-light': '#FFFFFF',
        'amazon-white': '#FFFFFF',
      },
      borderColor: {
        'amazon-border': '#DDD',
      },
      boxShadow: {
        'amazon': '0 2px 5px 0 rgba(213,217,217,.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      opacity: {
        '15': '0.15',
        '35': '0.35',
      },
      animation: {
        'flow-background': 'flow-background 20s linear infinite',
        'pulse-opacity': 'pulse-opacity 15s ease-in-out infinite',
        'ambient-glow': 'ambient-glow 15s ease infinite',
        'rotate-slow': 'rotate-slow 30s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.5s ease-out',
        'slide-in-right': 'slide-in-right 0.5s ease-out',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'gradient-x': 'gradient-x 15s ease infinite',
        'gradient-y': 'gradient-y 15s ease infinite',
        'gradient-xy': 'gradient-xy 15s ease infinite',
      },
      keyframes: {
        'flow-background': {
          '0%': { transform: 'translate(-50%, -50%) rotate(0deg) scale(1)' },
          '50%': { transform: 'translate(-50%, -50%) rotate(180deg) scale(1.2)' },
          '100%': { transform: 'translate(-50%, -50%) rotate(360deg) scale(1)' },
        },
        'shimmer': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        'glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'slide-in-right': {
          '0%': {
            opacity: '0',
            transform: 'translateX(20px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateX(0)',
          },
        },
        'bounce-subtle': {
          '0%, 100%': {
            transform: 'translateY(0)',
          },
          '50%': {
            transform: 'translateY(-5px)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'gradient-y': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'center top'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'center center'
          }
        },
        'gradient-x': {
          '0%, 100%': {
            'background-size': '200% 200%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        },
        'gradient-xy': {
          '0%, 100%': {
            'background-size': '400% 400%',
            'background-position': 'left center'
          },
          '50%': {
            'background-size': '200% 200%',
            'background-position': 'right center'
          }
        }
      },
      fontSize: {
        'display-large': ['4.5rem', { lineHeight: '1.1' }],
        'display-medium': ['3.75rem', { lineHeight: '1.2' }],
        'display-small': ['3rem', { lineHeight: '1.2' }],
        'hero-title': ['5rem', { lineHeight: '1' }],
        'hero-subtitle': ['1.5rem', { lineHeight: '1.5' }],
      },
    },
  },
  plugins: [],
}

export default config;
