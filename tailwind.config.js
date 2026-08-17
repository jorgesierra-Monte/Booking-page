/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

// Grow spacing scale — base unit 2px, semantic key = px value (tokens/live).
const space = {
  50: '2px', 100: '4px', 125: '6px', 150: '8px', 175: '10px', 200: '12px',
  225: '14px', 250: '16px', 275: '18px', 300: '20px', 325: '22px', 350: '24px',
  375: '26px', 400: '28px', 425: '30px', 450: '32px', 475: '34px', 500: '36px',
  525: '38px', 550: '48px', 600: '56px', 650: '64px', 700: '72px', 750: '88px',
  800: '96px', 850: '116px', 900: '132px', 950: '156px',
}

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      spacing: space,
      colors: {
        surface: {
          default: 'var(--surface-default)',
          subtle: 'var(--surface-subtle)',
          emphasis: 'var(--surface-emphasis)',
          inverse: 'var(--surface-inverse)',
          'inverse-emphasis': 'var(--surface-inverse-emphasis)',
          brand: 'var(--surface-brand)',
          'hover-default': 'var(--surface-hover-default)',
          'state-hover-default': 'var(--surface-hover-default)',
          'state-inactive-emphasis': 'var(--surface-state-inactive-emphasis)',
          'state-selected-brand': 'var(--surface-selected-brand)',
        },
        text: {
          default: 'var(--text-default)',
          muted: 'var(--text-muted)',
          inverse: 'var(--text-inverse)',
          'inverse-muted': 'var(--text-inverse-muted)',
          brand: 'var(--text-brand)',
        },
        border: {
          DEFAULT: 'var(--border-default)',
          default: 'var(--border-default)',
          subtle: 'var(--border-subtle)',
          'state-selected-default': 'var(--border-selected-default)',
          'state-inactive': 'var(--border-inactive)',
        },
        action: {
          'primary-surface': 'var(--action-primary-surface)',
          'primary-text': 'var(--action-primary-text)',
          'primary-hover': 'var(--action-primary-hover)',
          'primary-pressed': 'var(--action-primary-pressed)',
          'secondary-surface': 'var(--action-secondary-surface)',
          'secondary-border': 'var(--action-secondary-border)',
          'secondary-text': 'var(--action-secondary-text)',
          'secondary-hover': 'var(--surface-hover-default)',
        },
        status: {
          'success-surface': 'var(--success)',
          'success-text': 'var(--status-success-text)',
        },
        progressActive: 'var(--progress-active)',
      },
      borderRadius: {
        '50-75': '4px',
        xsmall: '4px',
        small: '8px',
        '150-175': '10px',
        medium: '12px',
        '200-250': '14px',
        large: '16px',
        '275-300': '20px',
        '325-350': '24px',
        '425-450': '32px',
        rounded: '9999px',
      },
      fontFamily: {
        // Season VF variable font — "collection" cut reads as serif/display,
        // "sans" cut for body/label/subhead.
        season: 'var(--font-season)',
        'season-sans': 'var(--font-season-sans)',
      },
      boxShadow: {
        card: '0px 28px 18px 0px rgba(0,0,0,0.05), 0px 12px 12px 0px rgba(0,0,0,0.09), 0px 2px 6px 0px rgba(0,0,0,0.1)',
      },
      minHeight: {
        'component-mediumButtons': '54px',
      },
    },
  },
  plugins: [
    // Always-on rebrand/arc variants (single-brand prototype → identity match).
    plugin(({ addVariant, addComponents }) => {
      addVariant('rebrand', '&')
      addVariant('arc', '&')

      // Season VF type scale (tokens/live). Serif/display use the "collection"
      // family; sans styles use the sans family.
      const serif = 'var(--font-season)'
      const sans = 'var(--font-season-sans)'
      addComponents({
        '.typography-display-small': {
          fontFamily: serif, fontSize: '48px', lineHeight: '50px', fontWeight: '490',
        },
        '.typography-display-mobile-small': {
          fontFamily: serif, fontSize: '32px', lineHeight: '33px', fontWeight: '490',
        },
        '.typography-subhead-large': {
          fontFamily: sans, fontSize: '32px', lineHeight: '38px', fontWeight: '550',
        },
        '.typography-subhead-default': {
          fontFamily: sans, fontSize: '24px', lineHeight: '29px', fontWeight: '550',
        },
        '.typography-subhead-small': {
          fontFamily: sans, fontSize: '20px', lineHeight: '24px', fontWeight: '550',
        },
        '.typography-subhead-serif-default': {
          fontFamily: serif, fontSize: '24px', lineHeight: '29px', fontWeight: '570',
        },
        '.typography-label-large': {
          fontFamily: sans, fontSize: '20px', lineHeight: '20px', fontWeight: '450',
        },
        '.typography-label-default': {
          fontFamily: sans, fontSize: '16px', lineHeight: '16px', fontWeight: '450',
        },
        '.typography-label-emphasis-default': {
          fontFamily: sans, fontSize: '16px', lineHeight: '16px', fontWeight: '550',
        },
        '.typography-label-small': {
          fontFamily: sans, fontSize: '14px', lineHeight: '14px', fontWeight: '450',
        },
        '.typography-label-emphasis-xsmall': {
          fontFamily: sans, fontSize: '12px', lineHeight: '12px', fontWeight: '550',
        },
        '.typography-body-default': {
          fontFamily: sans, fontSize: '16px', lineHeight: '24px', fontWeight: '450',
        },
        '.typography-body-emphasis-default': {
          fontFamily: sans, fontSize: '16px', lineHeight: '24px', fontWeight: '550',
        },
        '.typography-body-small': {
          fontFamily: sans, fontSize: '14px', lineHeight: '20px', fontWeight: '450',
        },
        '.typography-body-xsmall': {
          fontFamily: sans, fontSize: '12px', lineHeight: '16px', fontWeight: '450',
        },
        '.typography-eyebrow-default': {
          fontFamily: sans, fontSize: '10px', lineHeight: '12px', fontWeight: '550',
          textTransform: 'uppercase', letterSpacing: '0.75px',
        },
      })
    }),
  ],
}
