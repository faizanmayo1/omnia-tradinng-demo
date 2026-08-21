import { useState, useMemo, useRef } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Boxes, Clock, MapPin, Gauge, Calendar, ArrowRight, Search, Paperclip, History, Handshake, Warehouse } from 'lucide-react'
import { Card, StatTile, Badge, AIBadge, ScoreRing, MachineGlyph, Meter, Plate, cn } from '../components/ui'
import { MachinePack } from '../components/MachinePack'
import { useToast } from '../components/Toast'
import { useAuth } from '../components/AuthContext'
import { eur, eurC, num, pct } from '../data/omnia'
import {
  MACHINES, CATEGORIES, INV_STATS, STATUS_LABEL, margin, marginPct,
  costLabel, costValue, earnLabel, OWNERSHIP_LABEL,
  type Machine, type Category, type Tier, type MStatus, type Ownership,
} from '../data/machines'
import { compsFor, SALES_STATS } from '../data/sales'
import { threadForMachine } from '../data/inbox'

const tierTone: Record<Tier, 'copper' | 'risk' | 'steel'> = { hot: 'copper', warm: 'risk', cool: 'steel' }
const tierLabel: Record<Tier, string> = { hot: 'Hot demand', warm: 'Warm', cool: 'Cool' }
const statusTone: Record<MStatus, 'ok' | 'anvil' | 'steel' | 'copper'> = {
  ready: 'ok', inspection: 'anvil', reserved: 'copper', 'in-transit': 'steel',
}

type SortKey = 'margin' | 'price' | 'age' | 'hours' | 'inspection'
const SORTS: { id: SortKey; label: string; cmp: (a: Machine, b: Machine) => number }[] = [
  { id: 'age', label: 'Days listed', cmp: (a, b) => b.daysListed - a.daysListed },
  { id: 'margin', label: 'Return to Omnia', cmp: (a, b) => margin(b) - margin(a) },
  { id: 'price', label: 'Price', cmp: (a, b) => b.askPrice - a.askPrice },
  { id: 'hours', label: 'Hours', cmp: (a, b) => a.hours - b.hours },
  { id: 'inspection', label: 'Inspection', cmp: (a, b) => b.inspection - a.inspection },
]

/**
 * Saved views. At 18 machines a filter bar was enough; at ~1,800 the useful unit of work is
 * a question the desk asks repeatedly — stale brokered stock, fresh listings worth a
 * campaign, high-value lifting gear.
 */
const VIEWS: { label: string; apply: (m: Machine) => boolean }[] = [
  { label: 'Aging brokered stock 90d+', apply: (m) => m.ownership === 'brokered' && m.daysListed >= 90 },
  { label: 'New this week', apply: (m) => m.daysListed <= 7 },
  { label: 'Omnia stock, ready to sell', apply: (m) => m.ownership === 'owned' && m.status === 'ready' },
  { label: 'Hot demand, low hours', apply: (m) => m.tier === 'hot' && m.hours < 6000 },
]

const ROW_HEIGHT = 53

export function Inventory() {
  const toast = useToast()
  const { log } = useAuth()
  const [cat, setCat] = useState<Category | 'All'>('All')
  const [tier, setTier] = useState<Tier | 'All'>('All')
  const [own, setOwn] = useState<Ownership | 'All'>('All')
  const [country, setCountry] = useState<string>('All')
  const [sort, setSort] = useState<SortKey>('age')
  const [view, setView] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [selId, setSelId] = useState(MACHINES[0].id)
  const [packOpen, setPackOpen] = useState(false)

  const countries = useMemo(
    () => [...new Set(MACHINES.map((m) => m.location.country))].sort(),
    [],
  )

  const rows = useMemo(() => {
    const s = q.trim().toLowerCase()
    const savedView = VIEWS.find((v) => v.label === view)
    const cmp = SORTS.find((x) => x.id === sort)!.cmp
    return MACHINES
      .filter((m) => cat === 'All' || m.category === cat)
      .filter((m) => tier === 'All' || m.tier === tier)
      .filter((m) => own === 'All' || m.ownership === own)
      .filter((m) => country === 'All' || m.location.country === country)
      .filter((m) => !savedView || savedView.apply(m))
      .filter((m) => !s || `${m.make} ${m.model} ${m.id} ${m.location.city} ${m.vendor ?? ''} ${m.predRegion}`.toLowerCase().includes(s))
      .sort(cmp)
  }, [cat, tier, own, country, view, sort, q])

  // ~1,800 rows cannot all be in the DOM. Virtualizing keeps filtering instant, which is
  // the whole point: the objection was that this looks like a tool for a yard of 100.
  const scrollRef = useRef<HTMLDivElement>(null)
  const virt = useVirtualizer({
    count: rows.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 12,
  })

  const sel = MACHINES.find((m) => m.id === selId) ?? MACHINES[0]

  const resetFilters = () => {
    setCat('All'); setTier('All'); setOwn('All'); setCountry('All'); setView(null); setQ('')
  }
  const filtered = rows.length !== MACHINES.length

  return (
    <div className="mx-auto max-w-[1240px] space-y-5">
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Machines available" value={num(INV_STATS.units)} accent="ink" icon={<Boxes className="h-4 w-4" />} sub={`${INV_STATS.locations} locations · ${INV_STATS.countries} countries`} />
        <StatTile label="Omnia stock" value={num(INV_STATS.ownedUnits)} accent="steel" icon={<Warehouse className="h-4 w-4" />} sub={`${eurC(INV_STATS.bookValue)} book value`} />
        <StatTile label="Listed for vendors" value={num(INV_STATS.brokeredUnits)} accent="copper" icon={<Handshake className="h-4 w-4" />} sub={`${eurC(INV_STATS.commissionPipeline)} commission pipeline`} />
        <StatTile label="Aging (90d+)" value={num(INV_STATS.agingUnits)} accent="risk" icon={<Clock className="h-4 w-4" />} sub="Flagged by Anvil for action" />
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
                  placeholder="Search make, model, ID, city, vendor…"
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

            {/* Ownership, origin and sort — the facets that matter once the book is this big */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1">
                {(['All', 'owned', 'brokered'] as const).map((o) => (
                  <button key={o} onClick={() => setOwn(o)} className={cn('rounded-md px-2.5 py-1.5 text-[11.5px] font-600 transition', own === o ? 'bg-ink text-white' : 'bg-canvas text-ink-soft hover:bg-mist')}>
                    {o === 'All' ? 'All machines' : OWNERSHIP_LABEL[o as Ownership]}
                  </button>
                ))}
              </div>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="rounded-md border border-line bg-canvas/60 px-2 py-1.5 text-[11.5px] font-600 text-ink-soft outline-none transition focus:border-anvil/50"
              >
                <option value="All">All countries</option>
                {countries.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className="rounded-md border border-line bg-canvas/60 px-2 py-1.5 text-[11.5px] font-600 text-ink-soft outline-none transition focus:border-anvil/50"
              >
                {SORTS.map((x) => <option key={x.id} value={x.id}>Sort: {x.label}</option>)}
              </select>
              {filtered && (
                <button onClick={resetFilters} className="rounded-md px-2 py-1.5 text-[11.5px] font-600 text-anvil-deep underline-offset-2 hover:underline">
                  Clear
                </button>
              )}
            </div>

            {/* Saved views — the questions the desk asks repeatedly */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10.5px] font-600 uppercase tracking-wide text-ink-faint">Views</span>
              {VIEWS.map((v) => (
                <button
                  key={v.label}
                  onClick={() => setView(view === v.label ? null : v.label)}
                  className={cn('rounded-full border px-2.5 py-1 text-[11.5px] font-550 transition', view === v.label ? 'border-anvil/50 bg-anvil-tint text-anvil-deep' : 'border-line bg-surface text-ink-soft hover:border-ink/20')}
                >
                  {v.label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {(['All', ...CATEGORIES] as const).map((c) => (
                <button key={c} onClick={() => setCat(c as Category | 'All')} className={cn('rounded-full border px-2.5 py-1 text-[11.5px] font-550 transition', cat === c ? 'border-copper/50 bg-copper-wash text-copper-deep' : 'border-line bg-surface text-ink-soft hover:border-ink/20')}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Column header — a grid, not a table, so rows can be virtualized */}
          <div className="grid grid-cols-[minmax(0,1fr)_54px_92px_104px_66px_128px] items-center gap-2 border-b border-line bg-surface/95 px-4 py-2.5 text-[10.5px] font-600 uppercase tracking-wide text-ink-faint">
            <span>Machine</span>
            <span className="text-center">Insp.</span>
            <span className="text-right">Cost / comm.</span>
            <span className="text-right">Pred. resale</span>
            <span className="text-right">To Omnia</span>
            <span>Location</span>
          </div>

          <div ref={scrollRef} className="h-[560px] overflow-y-auto">
            {rows.length === 0 ? (
              <div className="py-10 text-center text-[13px] text-ink-faint">No machines match those filters.</div>
            ) : (
              <div style={{ height: virt.getTotalSize(), position: 'relative', width: '100%' }}>
                {virt.getVirtualItems().map((v) => {
                  const m = rows[v.index]
                  return (
                    <div
                      key={m.id}
                      onClick={() => setSelId(m.id)}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: v.size, transform: `translateY(${v.start}px)` }}
                      className={cn(
                        'grid cursor-pointer grid-cols-[minmax(0,1fr)_54px_92px_104px_66px_128px] items-center gap-2 border-b border-line/70 px-4 text-[12.5px] transition hover:bg-canvas/60',
                        m.id === selId && 'bg-copper-wash/60',
                      )}
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-canvas text-ink-soft"><MachineGlyph category={m.category} size={17} /></div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 truncate font-600 text-ink">
                            {m.make} {m.model}
                            <span className={cn('h-1.5 w-1.5 shrink-0 rounded-full', m.tier === 'hot' ? 'bg-copper' : m.tier === 'warm' ? 'bg-risk' : 'bg-steel')} />
                          </div>
                          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-ink-faint">
                            <Plate tone={m.id === selId ? 'live' : 'default'}>{m.id}</Plate>
                            <span className="readout truncate">{m.year} · {num(m.hours)} h</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-center">
                        <span className={cn('inline-flex h-6 min-w-[26px] items-center justify-center rounded-md px-1 text-[11px] font-700 tabular', m.inspection >= 90 ? 'bg-ok-tint text-ok-deep' : m.inspection >= 82 ? 'bg-anvil-tint text-anvil-deep' : 'bg-risk-tint text-risk-deep')}>{m.inspection}</span>
                      </div>
                      <span className="truncate text-right tabular text-ink-soft">{costValue(m)}</span>
                      <span className="truncate text-right tabular font-600 text-copper-deep">{eur(m.predResale)}</span>
                      <div className="text-right">
                        <div className="tabular font-700 text-ink">{eurC(margin(m))}</div>
                        <div className="tabular text-[10.5px] text-ink-faint">{m.ownership === 'owned' ? `${marginPct(m).toFixed(0)}% mgn` : `${marginPct(m).toFixed(1)}% comm`}</div>
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-[11.5px] text-ink-soft">{m.location.flag} {m.location.city}</div>
                        <div className="truncate text-[10.5px] text-ink-faint">{m.ownership === 'owned' ? 'Omnia stock' : m.vendor}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-line px-4 py-2.5 text-[11.5px] text-ink-faint">
            <span>
              <span className="tabular font-700 text-ink">{num(rows.length)}</span>
              {filtered ? ` of ${num(MACHINES.length)} machines` : ' machines'}
            </span>
            <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-copper" /> hot <span className="h-1.5 w-1.5 rounded-full bg-risk" /> warm <span className="h-1.5 w-1.5 rounded-full bg-steel" /> cool</span>
          </div>
        </Card>

        {/* Detail panel */}
        <MachineDetail
          machine={sel}
          onAct={() => {
            toast(`${sel.id} added to a draft deal — Anvil matching buyers`, 'copper')
            log('Added unit to a draft deal', `${sel.id} · ${sel.make} ${sel.model}`)
          }}
          onSendPack={() => setPackOpen(true)}
        />
      </div>

      <MachinePack
        machine={sel}
        open={packOpen}
        onClose={() => setPackOpen(false)}
        onSent={(msg) => {
          toast(msg, 'anvil')
          log('Sent machine pack to buyer', `${sel.id} · spec, 6 photos, landed price`)
        }}
        recipient={(() => {
          const t = threadForMachine(sel.id)
          return t ? { name: t.from, company: t.company, email: t.email, flag: t.flag, dest: t.country } : undefined
        })()}
      />
    </div>
  )
}

function MachineDetail({ machine: m, onAct, onSendPack }: { machine: Machine; onAct: () => void; onSendPack: () => void }) {
  const mgn = margin(m)
  const c = compsFor(m)
  return (
    <Card className="sticky top-0 h-fit">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-1.5 text-[11px] font-600 text-ink-faint"><MachineGlyph category={m.category} size={16} className="text-copper-deep" />{m.category} <Plate tone="live">{m.id}</Plate></div>
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
        <Spec icon={<MapPin className="h-3.5 w-3.5" />} label={m.ownership === 'owned' ? 'Yard' : 'Vendor site'} value={`${m.location.city}, ${m.location.country}`} />
        <Spec icon={<Clock className="h-3.5 w-3.5" />} label="Days listed" value={`${m.daysListed}d`} />
      </div>

      <div className="mt-4 rounded-xl border border-line bg-gradient-to-b from-canvas/50 to-surface p-3.5">
        <div className="mb-2 flex items-center gap-1.5 text-[11px] font-600 uppercase tracking-wide text-anvil-deep"><AIBadge /> resale forecast</div>
        <div className="space-y-2">
          <Row label={costLabel(m)} value={costValue(m)} />
          <Row label="Current asking" value={eur(m.askPrice)} />
          <Row label="Predicted resale" value={eur(m.predResale)} strong />
          <div className="my-1 h-px bg-line" />
          <div className="flex items-center justify-between">
            <span className="text-[12px] font-600 text-copper-deep">{earnLabel(m)}</span>
            <span className="font-display text-[16px] font-700 tabular text-copper-deep">{eur(mgn)} · {pct(marginPct(m))}</span>
          </div>
          <Meter value={Math.min(100, marginPct(m))} tone="copper" />
          <div className="flex items-center gap-1.5 text-[11.5px] text-ink-soft"><ArrowRight className="h-3.5 w-3.5 text-copper-deep" /> Best market: <span className="font-600 text-ink">{m.predRegion}</span></div>
        </div>
      </div>

      {/* Comparable sales from Omnia's own book */}
      <div className="mt-3 rounded-xl border border-line p-3.5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-600 uppercase tracking-wide text-ink-faint">
            <History className="h-3.5 w-3.5" /> Est. value
          </span>
          <Badge tone={c.confidence === 'High' ? 'ok' : c.confidence === 'Medium' ? 'anvil' : 'steel'}>
            {c.confidence} confidence
          </Badge>
        </div>
        <div className="flex items-baseline justify-between gap-2">
          <span className="font-display text-[17px] font-700 tabular text-ink">{eur(c.low)} – {eur(c.high)}</span>
          <span className="shrink-0 text-[11px] text-ink-faint">
            {c.comps.length} {c.basis === 'model' ? 'same-model' : 'same-category'} sales
          </span>
        </div>
        <ul className="mt-2 space-y-1">
          {c.comps.map((s) => (
            <li key={s.id} className="flex items-center gap-1.5 text-[11.5px]">
              <span>{s.flag}</span>
              <span className="truncate text-ink-soft">
                {s.model} · {s.year} · {num(s.hours)} h → {s.dest.split(',')[0]}
              </span>
              <span className="ml-auto shrink-0 tabular font-600 text-ink">{eur(s.price)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-[11px] leading-relaxed text-ink-faint">
          From your book, not public auctions — {SALES_STATS.closed} closed sales over {SALES_STATS.window}, adjusted for hours
          and age.
        </p>
      </div>

      <button onClick={onAct} className="btn-copper mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-600 text-[#fdf4ee] transition hover:brightness-105">
        Add to deal & match buyer <ArrowRight className="h-4 w-4" />
      </button>
      <button onClick={onSendPack} className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-anvil/40 bg-anvil-wash px-4 py-2.5 text-[13px] font-600 text-anvil-deep transition hover:bg-anvil-tint">
        <Paperclip className="h-4 w-4" /> Send machine pack — spec &amp; photos
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
