import { useMemo } from 'react'
import { REGIONS, SOURCES } from '../data/demand'
import { cn } from './ui'

// Signature motif — Omnia's global trade flow. Stylized (non-geographic) world:
// faint continent masses orient the eye; copper arcs run from EU/NA source
// yards to Africa / Middle East / Asia / South America destination markets,
// with a unit "in motion" travelling each active lane.

type Arc = { from: string; to: string; sx: number; sy: number; ex: number; ey: number; hot: boolean; hub: string }

// which EU/NA source feeds each destination hub (for the drawn lane)
const LANE_SOURCE: Record<string, string> = {
  Tema: 'Antwerp',
  Apapa: 'Antwerp',
  Mombasa: 'Hamburg',
  'Dar es Salaam': 'Hamburg',
  Durban: 'Southampton',
  'Jebel Ali': 'Rotterdam',
  'Nhava Sheva': 'Rotterdam',
  Callao: 'Miami',
}

function arcPath(sx: number, sy: number, ex: number, ey: number) {
  const mx = (sx + ex) / 2
  const my = (sy + ey) / 2
  const dx = ex - sx
  const dy = ey - sy
  const dist = Math.sqrt(dx * dx + dy * dy)
  const lift = Math.min(26, dist * 0.34)
  const cx = mx
  const cy = my - lift
  return `M ${sx} ${sy} Q ${cx} ${cy} ${ex} ${ey}`
}

export function TradeFlowMap({ highlight, className }: { highlight?: string; className?: string }) {
  const arcs = useMemo<Arc[]>(() => {
    return REGIONS.map((r) => {
      const src = SOURCES.find((s) => s.hub === LANE_SOURCE[r.hub]) ?? SOURCES[0]
      return { from: src.hub, to: r.hub, sx: src.x, sy: src.y, ex: r.x, ey: r.y, hot: r.index >= 88, hub: r.hub }
    })
  }, [])

  return (
    <div className={cn('relative w-full overflow-hidden rounded-xl border border-line bg-gradient-to-b from-[#FBF8F4] to-canvas', className)}>
      <svg viewBox="0 0 100 90" className="block w-full" style={{ height: 'auto' }}>
        {/* faint graticule */}
        <g stroke="#1C1F24" strokeOpacity="0.05" strokeWidth="0.15">
          {[15, 30, 45, 60, 75].map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} />
          ))}
          {[20, 40, 60, 80].map((x) => (
            <line key={x} x1={x} y1="0" x2={x} y2="90" />
          ))}
        </g>

        {/* stylized continent masses (abstract, for orientation only) */}
        <g fill="#1C1F24" fillOpacity="0.06">
          {/* North America */}
          <ellipse cx="20" cy="46" rx="11" ry="12" />
          <ellipse cx="26" cy="40" rx="7" ry="6" />
          {/* South America */}
          <ellipse cx="28" cy="70" rx="6" ry="11" />
          {/* Europe */}
          <ellipse cx="47" cy="40" rx="6" ry="5" />
          {/* Africa */}
          <ellipse cx="51" cy="64" rx="9" ry="14" />
          <ellipse cx="55" cy="55" rx="6" ry="6" />
          {/* Middle East */}
          <ellipse cx="63" cy="55" rx="5" ry="5" />
          {/* Asia / India */}
          <ellipse cx="72" cy="52" rx="10" ry="8" />
          <ellipse cx="70" cy="60" rx="5" ry="6" />
          <ellipse cx="82" cy="62" rx="7" ry="7" />
        </g>

        {/* arcs */}
        <g fill="none">
          {arcs.map((a, i) => {
            const d = arcPath(a.sx, a.sy, a.ex, a.ey)
            const emph = highlight ? a.hub === highlight : a.hot
            const col = emph ? '#B4622E' : '#8A8E97'
            return (
              <g key={i}>
                <path d={d} stroke={col} strokeOpacity={emph ? 0.9 : 0.4} strokeWidth={emph ? 0.7 : 0.4} strokeLinecap="round" strokeDasharray={emph ? '0' : '1.4 1.4'} />
                <circle r={emph ? 0.9 : 0.6} fill={emph ? '#B4622E' : '#5C6B7A'} className="arc-travel" style={{ offsetPath: `path('${d}')`, animationDelay: `${(i % 5) * 0.6}s`, animationDuration: emph ? '3.4s' : '4.6s' } as React.CSSProperties} />
              </g>
            )
          })}
        </g>

        {/* source nodes */}
        <g>
          {SOURCES.map((s) => (
            <g key={s.hub}>
              <circle cx={s.x} cy={s.y} r="0.9" fill="#1C1F24" />
              <circle cx={s.x} cy={s.y} r="1.9" fill="none" stroke="#1C1F24" strokeOpacity="0.25" strokeWidth="0.25" />
            </g>
          ))}
        </g>

        {/* destination nodes */}
        <g>
          {REGIONS.map((r) => {
            const emph = highlight ? r.hub === highlight : r.index >= 88
            return (
              <g key={r.hub}>
                {emph && <circle cx={r.x} cy={r.y} r="2.4" fill="#B4622E" fillOpacity="0.16" className="animate-pulse-soft" />}
                <circle cx={r.x} cy={r.y} r={emph ? 1.2 : 0.9} fill={emph ? '#B4622E' : '#0E8C8C'} />
              </g>
            )
          })}
        </g>
      </svg>

      {/* legend */}
      <div className="pointer-events-none absolute bottom-2.5 left-3 flex items-center gap-3 rounded-full border border-line bg-surface/85 px-2.5 py-1 text-[10px] text-ink-soft backdrop-blur">
        <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-ink" /> Source yards</span>
        <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-copper" /> Hot demand</span>
        <span className="inline-flex items-center gap-1"><span className="h-1.5 w-1.5 rounded-full bg-anvil" /> Active market</span>
      </div>
    </div>
  )
}
