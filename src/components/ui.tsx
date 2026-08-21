import { type ReactNode } from 'react'

export function cn(...v: (string | false | null | undefined)[]) {
  return v.filter(Boolean).join(' ')
}

export function Card({
  children,
  className,
  pad = true,
}: {
  children: ReactNode
  className?: string
  pad?: boolean
}) {
  return (
    <div className={cn('rounded-card border border-line bg-surface shadow-card', pad && 'p-5', className)}>
      {children}
    </div>
  )
}

export function SectionTitle({
  eyebrow,
  title,
  right,
}: {
  eyebrow?: string
  title: ReactNode
  right?: ReactNode
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          // Eyebrows are utility labels, so they carry the machine face
          <div className="mb-1.5 font-mono text-[9.5px] font-500 uppercase tracking-[0.2em] text-ink-faint">{eyebrow}</div>
        )}
        <h2 className="font-display text-[18px] font-600 leading-tight tracking-[-0.01em] text-ink">{title}</h2>
      </div>
      {right}
    </div>
  )
}

/**
 * Stamped identifier plate — the signature device.
 *
 * Every object on this desk carries a code: OM-4471 on a machine, SH-8841 on a
 * shipment, THR-5512 on an inquiry. Setting them as milled plates rather than
 * faint grey text is what makes the platform read as instrumentation.
 */
export function Plate({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode
  tone?: 'default' | 'live'
  className?: string
}) {
  return <span className={cn('plate', tone === 'live' && 'plate-live', className)}>{children}</span>
}

type Accent = 'ink' | 'copper' | 'anvil' | 'ok' | 'risk' | 'late' | 'steel'

export function StatTile({
  label,
  value,
  sub,
  accent = 'ink',
  icon,
}: {
  label: string
  value: ReactNode
  sub?: ReactNode
  accent?: Accent
  icon?: ReactNode
}) {
  const accentText: Record<Accent, string> = {
    ink: 'text-ink',
    copper: 'text-copper-deep',
    anvil: 'text-anvil-deep',
    ok: 'text-ok-deep',
    risk: 'text-risk-deep',
    late: 'text-late-deep',
    steel: 'text-steel-deep',
  }
  const accentBar: Record<Accent, string> = {
    ink: 'bg-ink/30',
    copper: 'bg-copper',
    anvil: 'bg-anvil',
    ok: 'bg-ok',
    risk: 'bg-risk',
    late: 'bg-late',
    steel: 'bg-steel',
  }
  return (
    // Read as a gauge: a marker rule down the left edge — the same device the
    // sidebar uses for the active screen — then the reading, then its caption.
    <Card className="lift relative flex flex-col gap-1.5 overflow-hidden bg-gradient-to-b from-surface to-canvas/50 pl-[18px]">
      <span className={cn('absolute inset-y-0 left-0 w-[3px]', accentBar[accent])} />
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[9.5px] font-500 uppercase tracking-[0.14em] text-ink-faint">{label}</span>
        {icon && <span className="shrink-0 text-ink-faint/70">{icon}</span>}
      </div>
      <div className={cn('font-display text-[29px] font-700 leading-none tracking-[-0.02em] tabular', accentText[accent])}>
        {value}
      </div>
      {sub && <div className="text-[12px] leading-snug text-ink-soft">{sub}</div>}
    </Card>
  )
}

type Tone = 'ink' | 'copper' | 'anvil' | 'ok' | 'risk' | 'late' | 'steel' | 'neutral'

export function Badge({
  children,
  tone = 'neutral',
  solid = false,
  className,
}: {
  children: ReactNode
  tone?: Tone
  solid?: boolean
  className?: string
}) {
  const map: Record<Tone, string> = {
    neutral: 'bg-mist text-ink-soft',
    ink: 'bg-ink/8 text-ink',
    copper: solid ? 'bg-copper text-[#fdf4ee]' : 'bg-copper-tint text-copper-deep',
    anvil: solid ? 'bg-anvil text-[#eafafa]' : 'bg-anvil-tint text-anvil-deep',
    ok: solid ? 'bg-ok text-white' : 'bg-ok-tint text-ok-deep',
    risk: solid ? 'bg-risk text-white' : 'bg-risk-tint text-risk-deep',
    late: solid ? 'bg-late text-white' : 'bg-late-tint text-late-deep',
    steel: solid ? 'bg-steel text-white' : 'bg-steel-tint text-steel-deep',
  }
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-550', map[tone], className)}>
      {children}
    </span>
  )
}

/** The AI signature chip, Anvil, carried in teal. */
export function AIBadge({ label = 'Anvil' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-anvil/40 bg-anvil-wash px-2 py-0.5 text-[11px] font-600 text-anvil-deep">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-anvil opacity-50" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-anvil" />
      </span>
      {label}
    </span>
  )
}

export function Meter({
  value,
  tone = 'copper',
  className,
}: {
  value: number
  tone?: 'copper' | 'anvil' | 'ok' | 'risk' | 'late' | 'steel'
  className?: string
}) {
  const bar: Record<string, string> = {
    copper: 'bg-copper',
    anvil: 'bg-anvil',
    ok: 'bg-ok',
    risk: 'bg-risk',
    late: 'bg-late',
    steel: 'bg-steel',
  }
  return (
    <div className={cn('h-1.5 w-full overflow-hidden rounded-full bg-mist', className)}>
      <div className={cn('h-full rounded-full transition-all', bar[tone])} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  )
}

/** Small circular score dial for inspection / confidence readings. */
export function ScoreRing({
  value,
  size = 44,
  tone = 'anvil',
  label,
}: {
  value: number
  size?: number
  tone?: 'anvil' | 'copper' | 'ok'
  label?: string
}) {
  const stroke = 4
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const off = c * (1 - value / 100)
  const col = tone === 'copper' ? '#B4622E' : tone === 'ok' ? '#2E8B57' : '#0E8C8C'
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E8EA" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={col} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off} />
      </svg>
      {/* A dial is an instrument, so its reading is set in the machine face */}
      <div className="absolute flex flex-col items-center leading-none">
        <span className="readout text-[12.5px] font-600 text-ink">{value}</span>
        {label && <span className="font-mono text-[7px] font-500 uppercase tracking-[0.12em] text-ink-faint">{label}</span>}
      </div>
    </div>
  )
}

/**
 * Signature mark — an anvil rendered from a forge chevron. The upward wedge is
 * the "deal" being struck; the base is the anvil. Doubles as the Anvil AI glyph.
 */
export function AnvilMark({ size = 24, tone = 'copper' }: { size?: number; tone?: 'copper' | 'white' | 'ink' | 'anvil' }) {
  const c = tone === 'white' ? '#FFFFFF' : tone === 'ink' ? '#1A1D22' : tone === 'anvil' ? '#0E8C8C' : '#B4622E'
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      {/* anvil body */}
      <path d="M6 13 H26 L23 17 H14 L12.5 20 H9 L11 17 H9 Z" fill={c} />
      {/* base */}
      <rect x="11" y="22" width="10" height="3" rx="1" fill={c} opacity="0.55" />
      {/* struck spark */}
      <path d="M16 4 L18 9 H14 Z" fill={c} />
    </svg>
  )
}

/** Category glyph — a compact machine silhouette per equipment type. */
export function MachineGlyph({ category, size = 18, className }: { category: string; size?: number; className?: string }) {
  const s = { width: size, height: size } as const
  const stroke = 'currentColor'
  switch (category) {
    // --- Lifting ---
    case 'Crane':
    case 'Mobile Crane':
    case 'Crawler Crane':
    case 'Tower Crane':
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4 21h6M6 21V8l11 2M6 8l2-3M17 10V6M15 6h5" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )

    // --- Aggregate: a hopper feeding an inclined screen deck onto a stockpile ---
    case 'Screener':
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M3 6h8l-2 4H5L3 6ZM6 10v3M8 13h11M8 13l-3 6M19 13l2 6M4 19h18M10 15h7M12 17h5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    // --- Aggregate: jaw box with feed hopper and discharge conveyor ---
    case 'Crusher':
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4 5h9l-2 4H6L4 5ZM6 9h6v5H6zM12 12l7-3M19 9v4M4 18h16M7 14v4M17 13v5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    // --- Aggregate: a stacking conveyor ---
    case 'Conveyor':
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M3 17l14-8M3 17h4M17 9h3M5 20a2 2 0 1 0 0 .01M15 20a2 2 0 1 0 0 .01M5 20h10M8 15l2-1M11 13l2-1" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )

    // --- Road: paver laying a mat behind a hopper ---
    case 'Asphalt Paver':
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4 9h8l2 3h5v4H4V9ZM3 19h18M6 16v3M17 16v3M8 9V6h3v3" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    // --- Road: cold planer with a cutting drum ---
    case 'Cold Planer':
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M5 8h11v6H5V8ZM16 10h3v4M4 18h17M7 14v4M18 14v4M9 14v-2M12 14v-2M8 8V5h4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )

    case 'Wheel Loader':
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M3 15l4-2 3 1v3M2 18h9M13 12h5v6M13 18h8M6 9h3v2" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'Drill Rig':
    case 'Motor Grader':
    case 'Roller':
    case 'Material Handler':
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M4 17a3 3 0 1 0 0 .01M17 17a3 3 0 1 0 0 .01M4 17h13M6 10h9l3 4M9 10V6h4l2 4" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    default: // Excavator
      return (
        <svg {...s} viewBox="0 0 24 24" fill="none" className={className}>
          <path d="M3 20h8M4 20v-3h6v3M5 17v-3h4M9 14l6-6M15 8l3 2-1 3M6 11V8" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
  }
}

export function Divider() {
  return <div className="h-px w-full bg-line" />
}
