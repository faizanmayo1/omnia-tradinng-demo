import { useState, useMemo } from 'react'
import { Boxes, TrendingUp, Clock, MapPin, Gauge, Calendar, ArrowRight, Search } from 'lucide-react'
import { Card, StatTile, Badge, AIBadge, ScoreRing, MachineGlyph, Meter, cn } from '../components/ui'
import { useToast } from '../components/Toast'
import { eur, eurC, num, pct } from '../data/omnia'
import {
  MACHINES, CATEGORIES, INV_STATS, STATUS_LABEL, margin, marginPct,
  type Machine, type Category, type Tier, type MStatus,
} from '../data/machines'

const tierTone: Record<Tier, 'copper' | 'risk' | 'steel'> = { hot: 'copper', warm: 'risk', cool: 'steel' }
const tierLabel: Record<Tier, string> = { hot: 'Hot demand', warm: 'Warm', cool: 'Cool' }
const statusTone: Record<MStatus, 'ok' | 'anvil' | 'steel' | 'copper'> = {
  ready: 'ok', inspection: 'anvil', reserved: 'copper', 'in-transit': 'steel',
}

export function Inventory() {
  const toast = useToast()
  const [cat, setCat] = useState<Category | 'All'>('All')
  const [tier, setTier] = useState<Tier | 'All'>('All')
  const [q, setQ] = useState('')
  const [selId, setSelId] = useState(MACHINES[0].id)

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    return MACHINES.filter((m) => (cat === 'All' || m.category === cat))
      .filter((m) => (tier === 'All' || m.tier === tier))
      .filter((m) => !s || (`${m.make} ${m.model} ${m.id} ${m.yard} ${m.predRegion}`.toLowerCase().includes(s)))
      .sort((a, b) => marginPct(b) - marginPct(a))
  }, [cat, tier, q])

  const sel = MACHINES.find((m) => m.id === selId)!

  return (
    <div className="mx-auto max-w-[1240px] space-y-5">
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Units in stock" value={num(INV_STATS.units)} accent="ink" icon={<Boxes className="h-4 w-4" />} sub="Across 5 yards" />
        <StatTile label="Book value" value={eurC(INV_STATS.bookValue)} accent="steel" icon={<Gauge className="h-4 w-4" />} sub="Total acquisition cost" />
        <StatTile label="Predicted resale value" value={eurC(INV_STATS.predictedValue)} accent="copper" icon={<TrendingUp className="h-4 w-4" />} sub={`+${eurC(INV_STATS.predictedValue - INV_STATS.bookValue)} uplift`} />
        <StatTile label="Aging (40d+)" value={INV_STATS.agingUnits} accent="risk" icon={<Clock className="h-4 w-4" />} sub="Flagged by Anvil for action" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
        {/* Table + filters */}
        <Card pad={false} className="overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-line p-4">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-ink-faint" />
                <input
                  value={q} onChange={(e) => setQ(e.target.value)}
                  placeholder="Search make, model, ID, yard…"
                  className="w-full rounded-lg border border-line bg-canvas/60 py-2 pl-9 pr-3 text-[13px] text-ink outline-none transition focus:border-anvil/50 focus:bg-surface"
                />
              </div>
              <div className="flex items-center gap-1">
                {(['All', 'hot', 'warm', 'cool'] as const).map((t) => (
                  <button key={t} onClick={() => setTier(t)} className={cn('rounded-md px-2.5 py-1.5 text-[11.5px] font-600 transition', tier === t ? 'bg-ink text-white' : 'bg-canvas text-ink-soft hover:bg-mist')}>
                    {t === 'All' ? 'All tiers' : tierLabel[t as Tier]}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', ...CATEGORIES] as const).map((c) => (
                <button key={c} onClick={() => setCat(c as Category | 'All')} className={cn('rounded-full border px-2.5 py-1 text-[11.5px] font-550 transition', cat === c ? 'border-copper/50 bg-copper-wash text-copper-deep' : 'border-line bg-surface text-ink-soft hover:border-ink/20')}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="max-h-[560px] overflow-y-auto">
            <table className="w-full text-left">
              <thead className="sticky top-0 z-10 bg-surface/95 backdrop-blur">
                <tr className="border-b border-line text-[10.5px] font-600 uppercase tracking-wide text-ink-faint">
                  <th className="py-2.5 pl-4 pr-2">Machine</th>
                  <th className="px-2">Insp.</th>
                  <th className="px-2 text-right">Acquired</th>
                  <th className="px-2 text-right">Pred. resale</th>
                  <th className="px-2 text-right">Margin</th>
                  <th className="py-2.5 pl-2 pr-4">Best market</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((m) => (
                  <tr
                    key={m.id}
                    onClick={() => setSelId(m.id)}
                    className={cn('cursor-pointer border-b border-line/70 text-[12.5px] transition hover:bg-canvas/60', m.id === selId && 'bg-copper-wash/60')}
                  >
                    <td className="py-2.5 pl-4 pr-2">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink-soft"><MachineGlyph category={m.category} size={17} /></div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 font-600 text-ink">{m.make} {m.model} <span className={cn('h-1.5 w-1.5 rounded-full', m.tier === 'hot' ? 'bg-copper' : m.tier === 'warm' ? 'bg-risk' : 'bg-steel')} /></div>
                          <div className="text-[11px] text-ink-faint">{m.id} · {m.year} · {num(m.hours)} h</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-2"><span className={cn('inline-flex h-6 min-w-[26px] items-center justify-center rounded-md px-1 text-[11px] font-700 tabular', m.inspection >= 90 ? 'bg-ok-tint text-ok-deep' : m.inspection >= 82 ? 'bg-anvil-tint text-anvil-deep' : 'bg-risk-tint text-risk-deep')}>{m.inspection}</span></td>
                    <td className="px-2 text-right tabular text-ink-soft">{eur(m.acqCost)}</td>
                    <td className="px-2 text-right tabular font-600 text-copper-deep">{eur(m.predResale)}</td>
                    <td className="px-2 text-right"><span className="tabular font-700 text-ink">{pct(marginPct(m))}</span></td>
                    <td className="py-2.5 pl-2 pr-4 text-[11.5px] text-ink-soft">{m.predRegion}</td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr><td colSpan={6} className="py-10 text-center text-[13px] text-ink-faint">No machines match those filters.</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[11.5px] text-ink-faint">
            <span>{rows.length} of {MACHINES.length} units</span>
            <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-copper" /> hot <span className="h-1.5 w-1.5 rounded-full bg-risk" /> warm <span className="h-1.5 w-1.5 rounded-full bg-steel" /> cool</span>
          </div>
        </Card>

        {/* Detail panel */}
        <MachineDetail machine={sel} onAct={() => toast(`${sel.id} added to a draft deal — Anvil matching buyers`, 'copper')} />
      </div>
    </div>
  )
}

function MachineDetail({ machine: m, onAct }: { machine: Machine; onAct: () => void }) {
  const mgn = margin(m)
  return (
    <Card className="sticky top-0 h-fit">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-600 text-ink-faint"><MachineGlyph category={m.category} size={16} className="text-copper-deep" />{m.category} · {m.id}</div>
          <h3 className="mt-1 font-display text-[19px] font-700 leading-tight text-ink">{m.make} {m.model}</h3>
          <div className="mt-0.5 text-[12px] text-ink-soft">{m.vertical}</div>
        </div>
        <ScoreRing value={m.inspection} size={52} label="Omnia" />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge tone={statusTone[m.status]} solid>{STATUS_LABEL[m.status]}</Badge>
        <Badge tone={tierTone[m.tier]}>{tierLabel[m.tier]}</Badge>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 text-[12.5px]">
        <Spec icon={<Calendar className="h-3.5 w-3.5" />} label="Year" value={String(m.year)} />
        <Spec icon={<Gauge className="h-3.5 w-3.5" />} label="Hours" value={`${num(m.hours)} h`} />
        <Spec icon={<MapPin className="h-3.5 w-3.5" />} label="Yard" value={`${m.yard} (${m.yardRegion})`} />
        <Spec icon={<Clock className="h-3.5 w-3.5" />} label="Days in yard" value={`${m.daysInYard}d`} />
      </div>

      <div className="mt-4 rounded-xl border border-line bg-gradient-to-b from-canvas/50 to-surface p-3.5">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-600 uppercase tracking-wide text-anvil-deep"><AIBadge /> resale forecast</div>
        <div className="space-y-2">
          <Row label="Acquisition cost" value={eur(m.acqCost)} />
          <Row label="Current asking" value={eur(m.listPrice)} />
          <Row label="Predicted resale" value={eur(m.predResale)} strong />
          <div className="my-1 h-px bg-line" />
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-600 text-copper-deep">Predicted margin</span>
            <span className="font-display text-[16px] font-700 tabular text-copper-deep">{eur(mgn)} · {pct(marginPct(m))}</span>
          </div>
          <Meter value={Math.min(100, marginPct(m))} tone="copper" />
          <div className="flex items-center gap-1.5 text-[11.5px] text-ink-soft"><ArrowRight className="h-3.5 w-3.5 text-copper-deep" /> Best market: <span className="font-600 text-ink">{m.predRegion}</span></div>
        </div>
      </div>

      <button onClick={onAct} className="btn-copper mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-600 text-[#fdf4ee] transition hover:brightness-105">
        Add to deal & match buyer <ArrowRight className="h-4 w-4" />
      </button>
    </Card>
  )
}

function Spec({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-surface p-2.5">
      <div className="flex items-center gap-1.5 text-[10.5px] font-600 uppercase tracking-wide text-ink-faint">{icon}{label}</div>
      <div className="mt-0.5 text-[13px] font-600 text-ink">{value}</div>
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-ink-soft">{label}</span>
      <span className={cn('tabular', strong ? 'text-[13px] font-700 text-ink' : 'text-[12.5px] font-600 text-ink-soft')}>{value}</span>
    </div>
  )
}
