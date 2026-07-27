/** @type {import('tailwindcss').Config} */
// Forged Steel — an industrial identity for Omnia's used-machinery trading desk.
//
// The ground is cool milled steel, not warm paper: that is what makes the copper
// read as heat coming off a forge rather than as a decorative terracotta. Copper
// is the brand, teal is the AI ("Anvil") signal, graphite carries structure.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Cool milled-steel canvas + pure surfaces
        canvas: '#EEF0F1',
        surface: '#FFFFFF',
        // Ink — graphite, for text + structure
        ink: {
          DEFAULT: '#1A1D22',
          soft: '#474C55',
          // Tertiary text sits at ~4.2:1 on the canvas rather than the ~3:1 it
          // had before — the eyebrows are smaller and tracked now, so they
          // need the contrast back.
          faint: '#70767F',
        },
        line: '#DDE1E4',
        mist: '#E5E8EA',
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
        // Third role: instrumentation. IBM Plex Mono was drawn for an
        // engineering company and reads as a stamped machine plate rather than
        // as code. Reserved for identifiers and small data readings.
        mono: ['IBM Plex Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      // The design is authored against a numeric weight scale (font-450 …
      // font-700). Tailwind ships no numeric fontWeight keys, so every one of
      // those classes was silently generating nothing and the whole app
      // rendered at 400 — flat. These keys are what give it its hierarchy.
      fontWeight: {
        400: '400',
        450: '450',
        500: '500',
        550: '550',
        600: '600',
        700: '700',
      },
      boxShadow: {
        card: '0 1px 2px 0 rgba(26,29,34,0.05), 0 10px 28px -18px rgba(26,29,34,0.28)',
        rail: '0 1px 2px 0 rgba(26,29,34,0.05)',
        pop: '0 18px 52px -18px rgba(26,29,34,0.34)',
        plate: 'inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(26,29,34,0.05)',
      },
      borderRadius: {
        card: '10px',
      },
      keyframes: {
        'pulse-soft': { '0%,100%': { opacity: '1' }, '50%': { opacity: '0.35' } },
        rise: { from: { opacity: '0', transform: 'translateY(8px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        beacon: { '0%,100%': { opacity: '0.35', transform: 'scale(1)' }, '50%': { opacity: '1', transform: 'scale(1.15)' } },
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
