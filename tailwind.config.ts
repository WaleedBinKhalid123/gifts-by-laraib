import type { Config } from 'tailwindcss';

/**
 * Gifts by Laraib — design tokens.
 * Palette derived directly from the brand mark: blush field, hot-pink rule,
 * burgundy wordmark, with warm cream + champagne introduced for depth.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          DEFAULT: '#FFFCFA',
          50: '#FFFEFD',
          100: '#FDF8F4',
          200: '#F7EDE5',
        },
        blush: {
          DEFAULT: '#FDF1F5',
          50: '#FFF8FB',
          100: '#FDF1F5',
          200: '#FAE3EC',
          300: '#F5CFDE',
          400: '#EDB2C9',
        },
        rose: {
          DEFAULT: '#E4578F',
          300: '#F19CBE',
          400: '#EA789F',
          500: '#E4578F',
          600: '#D23A78',
          700: '#B22462',
        },
        wine: {
          DEFAULT: '#7A0F3C',
          600: '#8E1A4B',
          700: '#7A0F3C',
          800: '#5C0A2C',
          900: '#40071E',
        },
        gold: {
          DEFAULT: '#C6A15B',
          200: '#EEDCB8',
          300: '#DFC48D',
          400: '#C6A15B',
          500: '#A98543',
        },
        ink: {
          DEFAULT: '#2A1620',
          soft: '#4A3540',
          muted: '#7C6772',
          faint: '#A99AA2',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Jost', 'system-ui', 'sans-serif'],
        script: ['var(--font-script)', 'Parisienne', 'cursive'],
      },
      fontSize: {
        'display-xs': ['clamp(1.75rem, 1.4rem + 1.6vw, 2.5rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
        'display-sm': ['clamp(2.1rem, 1.6rem + 2.3vw, 3.25rem)', { lineHeight: '1.06', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(2.6rem, 1.8rem + 3.4vw, 4.5rem)', { lineHeight: '1.02', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(3rem, 1.9rem + 4.8vw, 6.25rem)', { lineHeight: '0.98', letterSpacing: '-0.025em' }],
        'label': ['0.6875rem', { lineHeight: '1', letterSpacing: '0.22em' }],
        'label-lg': ['0.75rem', { lineHeight: '1', letterSpacing: '0.24em' }],
      },
      borderRadius: {
        xs: '0.375rem',
        sm: '0.625rem',
        md: '0.875rem',
        lg: '1.25rem',
        xl: '1.75rem',
        '2xl': '2.25rem',
        '3xl': '3rem',
      },
      boxShadow: {
        petal: '0 1px 2px rgba(122,15,60,0.04), 0 8px 24px -12px rgba(122,15,60,0.10)',
        lift: '0 2px 6px rgba(122,15,60,0.05), 0 24px 48px -24px rgba(122,15,60,0.20)',
        float: '0 32px 80px -32px rgba(122,15,60,0.30)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.6)',
      },
      spacing: {
        section: 'clamp(3.25rem, 2.25rem + 3.4vw, 6rem)',
        gutter: 'clamp(1.25rem, 0.75rem + 2.2vw, 3rem)',
      },
      maxWidth: {
        shell: '90rem',
        prose: '38rem',
      },
      transitionTimingFunction: {
        expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
        soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      keyframes: {
        'marquee-x': {
          from: { transform: 'translate3d(0,0,0)' },
          to: { transform: 'translate3d(-50%,0,0)' },
        },
        'drift': {
          '0%,100%': { transform: 'translate3d(0,0,0)' },
          '50%': { transform: 'translate3d(0,-10px,0)' },
        },
        'sheen': {
          from: { transform: 'translateX(-120%) skewX(-18deg)' },
          to: { transform: 'translateX(220%) skewX(-18deg)' },
        },
      },
      animation: {
        'marquee-x': 'marquee-x 46s linear infinite',
        drift: 'drift 7s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
