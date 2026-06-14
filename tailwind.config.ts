import type { Config } from 'tailwindcss';

/**
 * Sonali Badani — The Marriage Pattern Self-Reset
 * Locked brand palette (no additions without explicit approval):
 *   Deep Navy  #203F5C  — primary: text, wordmark, dark backgrounds, structure
 *   Coral      #F59075  — accent only: CTAs, keyword highlights (never a large bg block)
 *   White      #FFFFFF  — base: background, text-on-dark, active white space
 *   Black      #000000  — utility only: body copy on white, used sparingly
 * Only tints/alphas of these four are permitted — no new hues.
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#203F5C',
          deep: '#15293C', // darker navy for hover/dark sections (tint of navy)
        },
        coral: {
          DEFAULT: '#F59075',
          dark: '#E5795C', // hover state (tint of coral)
        },
        ink: '#000000',
      },
      fontFamily: {
        // Serif — wordmark + display headlines only (never body).
        serif: ['var(--font-serif)', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        // Brand body — Gangjiem if present in /public/fonts, else humanist fallback.
        body: ['Gangjiem', 'var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        reading: '46rem', // ~736px — comfortable single-column reading measure
        wide: '72rem',
      },
      boxShadow: {
        soft: '0 10px 40px -18px rgba(32, 63, 92, 0.28)',
        card: '0 18px 60px -28px rgba(32, 63, 92, 0.30)',
        cta: '0 14px 38px -14px rgba(245, 144, 117, 0.55)',
      },
      borderRadius: {
        pill: '999px',
      },
      keyframes: {
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(18px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-7px)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        float: 'float 5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

export default config;
