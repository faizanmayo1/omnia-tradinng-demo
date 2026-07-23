/** @type {import('tailwindcss').Config} */
// Forged Steel — a premium, warm-industrial identity for Omnia's used-machinery
// trading desk. Warm off-white canvas, graphite ink, a single molten-copper
// brand accent (forged metal), and teal as the AI ("Anvil") signal.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Warm neutral canvas + pure surfaces
        canvas: '#F5F3F0',
        surface: '#FFFFFF',
        // Ink — graphite, for text + structure
        ink: {
          DEFAULT: '#1C1F24',
          soft: '#4B4F57',
          faint: '#8A8E97',
        },
        line: '#E7E3DD',
        mist: '#EFEBE5',
        // Copper — molten forged metal, the brand accent
        copper: {
          DEFAULT: '#B4622E',
          deep: '#8A4519',
          soft: '#D08A56',
          tint: '#F2E1D2',
          wash: '#FAF3EC',
        },
        // Anvil — teal, the AI signal
        anvil: {
          DEFAULT: '#0E8C8C',
          deep: '#0A6A6A',
          soft: '#4FB3B3',
          tint: '#D6EEEE',
          wash: '#ECF7F7',
        },
        // Steel — cool structural secondary
        steel: { DEFAULT: '#5C6B7A', tint: '#E6E9ED', deep: '#3A4551' },
        // Status ladder (reserved; always paired with icon + label)
        ok: { DEFAULT: '#2E8B57', tint: '#E2F1E9', deep: '#1E6B41' }, // healthy margin / delivered
        risk: { DEFAULT: '#D98A1F', tint: '#FBEFD9', deep: '#A5650F' }, // watch / aging
        late: { DEFAULT: '#C43D2E', tint: '#F9E2DE', deep: '#98291D' }, // stalled / low margin
        // Categorical series (dataviz-validated, tuned to sit beside copper/teal)
        c1: '#B4622E', // copper
        c2: '#0E8C8C', // teal
        c3: '#5C6B7A', // steel
        c4: '#C99A3E', // brass
        c5: '#6D5CE0', // violet
        c6: '#2E8B57', // green
      },
      fontFamily: {
        display: ['Familjen Grotesk', 'system-ui', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(28,31,36,0.04), 0 8px 24px -14px rgba(28,31,36,0.16)',
        rail: '0 1px 2px 0 rgba(28,31,36,0.04)',
        pop: '0 16px 48px -16px rgba(28,31,36,0.30)',
        glow: '0 0 0 1px rgba(14,140,140,0.16), 0 18px 44px -22px rgba(14,140,140,0.40)',
      },
      borderRadius: {
        card: '12px',
      },
      keyframes: {
        'pulse-soft': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
        rise: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        beacon: { '0%,100%': { opacity: '0.35', transform: 'scale(1)' }, '50%': { opacity: '1', transform: 'scale(1.15)' } },
        dash: { to: { strokeDashoffset: '0' } },
        travel: { '0%': { offsetDistance: '0%', opacity: '0' }, '12%': { opacity: '1' }, '88%': { opacity: '1' }, '100%': { offsetDistance: '100%', opacity: '0' } },
      },
      animation: {
        'pulse-soft': 'pulse-soft 2.4s ease-in-out infinite',
        rise: 'rise 0.5s cubic-bezier(0.22,1,0.36,1) both',
        beacon: 'beacon 1.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
