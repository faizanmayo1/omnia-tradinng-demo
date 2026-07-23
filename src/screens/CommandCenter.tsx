import { useNavigate } from 'react-router-dom'
import {
  TrendingUp, Boxes, Flame, Ship, ArrowRight, Sparkles, Clock, MapPin, ChevronRight,
} from 'lucide-react'
import { Card, StatTile, Badge, AIBadge, SectionTitle, Meter, MachineGlyph, cn } from '../components/ui'
import { TradeFlowMap } from '../components/TradeFlowMap'
import { CLIENT, eurC, eur, num, pctDelta } from '../data/omnia'
import { INV_STATS, MACHINES, margin, marginPct } from '../data/machines'
import { OPPORTUNITIES, OPP_STATS, KIND_LABEL, type OppKind } from '../data/opportunities'
import { SHIPMENTS, SHIP_STATS, SHIP_STATUS_LABEL } from '../data/shipments'
import { REGIONS } from '../data/demand'

const kindTone: Record<OppKind, 'copper' | 'anvil' | 'risk' | 'steel'> = {
  resale: 'copper', procure: 'anvil', reprice: 'risk', reroute: 'steel',
}

export function CommandCenter() {
  const nav = useNavigate()
  const hero = OPPORTUNITIES.find((o) => o.hero)!
  const feed = OPPORTUNITIES.filter((o) => !o.hero).slice(0, 3)
  const uplift = INV_STATS.predictedValue - INV_STATS.bookValue
  const topRegions = [...REGIONS].sort((a, b) => b.index - a.index).slice(0, 4)
  const transit = SHIPMENTS.filter((s) => ['on-water', 'at-port', 'inland'].includes(s.status))

  return (
    <div className="mx-auto max-w-[1240px] space-y-5">
      {/* Greeting + hero banner */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2 text-[12px] text-ink-faint">
          <span>{CLIENT.today}</span>
          <span className="h-1 w-1 rounded-full bg-ink-faint/50" />
          <span>{CLIENT.hqCity}</span>
        </div>
        <h1 className="font-display text-[22px] font-700 tracking-tight text-ink">Good afternoon, {CLIENT.desk.split('.')[1]?.trim() || 'team'} — the desk is running warm.</h1>
      </div>

      {/* Hero opportunity banner */}
      <button
        onClick={() => nav('/opportunities')}
        className="lift group relative block w-full overflow-hidden rounded-card border border-copper/30 bg-gradient-to-br from-[#2A2E35] to-[#15171C] p-5 text-left shadow-card"
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(560px_240px_at_88%_-30%,rgba(180,98,46,0.30),transparent_70%)]" />
        <div className="relative flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-copper/40 bg-copper/15 px-2 py-0.5 text-[11px] font-600 text-copper-soft">
                <Sparkles className="h-3 w-3" /> Anvil · top call today
              </span>
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10.5px] font-600 text-white/70">{hero.confidence}% confidence</span>
            </div>
            <div className="font-display text-[19px] font-700 leading-tight text-white">{hero.title}</div>
            <p className="mt-1.5 max-w-2xl text-[13px] leading-relaxed text-white/65">{hero.summary}</p>
          </div>
          <div className="flex shrink-0 items-center gap-5 md:flex-col md:items-end md:gap-2">
            <div className="text-right">
              <div className="text-[10.5px] font-600 uppercase tracking-wide text-white/50">Margin uplift</div>
              <div className="font-display text-[30px] font-700 leading-none text-copper-soft">{eurC(hero.marginUplift)}</div>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-copper px-3.5 py-2 text-[13px] font-600 text-[#fdf4ee] transition group-hover:brightness-110">
              Open opportunity <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </button>

      {/* KPI row */}
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Predicted margin (open stock)" value={eurC(uplift)} accent="copper" icon={<TrendingUp className="h-4 w-4" />} sub={<span className="text-ok-deep">{pctDelta((uplift / INV_STATS.bookValue) * 100)} over book</span>} />
        <StatTile label="Units in stock" value={num(INV_STATS.units)} accent="ink" icon={<Boxes className="h-4 w-4" />} sub={`${CLIENT.yards} yards · ${num(CLIENT.liveListings)} listed`} />
        <StatTile label="Hot-demand units" value={INV_STATS.hotUnits} accent="anvil" icon={<Flame className="h-4 w-4" />} sub="Matched to surging markets" />
        <StatTile label="Value in transit" value={eurC(SHIP_STATS.valueInTransit)} accent="steel" icon={<Ship className="h-4 w-4" />} sub={`${SHIP_STATS.inTransit} shipments · ${SHIP_STATS.onWater} on water`} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.55fr_1fr]">
        {/* Anvil opportunity feed */}
        <Card>
          <SectionTitle
            eyebrow="Anvil intelligence"
            title="Opportunity feed"
            right={
              <button onClick={() => nav('/opportunities')} className="inline-flex items-center gap-1 text-[12px] font-600 text-anvil-deep hover:text-anvil">
                View all {OPP_STATS.open} <ChevronRight className="h-3.5 w-3.5" />
              </button>
            }
          />
          <div className="space-y-2.5">
            {feed.map((o) => (
              <button
                key={o.id}
                onClick={() => nav('/opportunities')}
                className="lift flex w-full items-center gap-3 rounded-xl border border-line bg-gradient-to-b from-surface to-canvas/40 p-3.5 text-left"
              >
                <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-lg', o.marginUplift >= 0 ? 'bg-copper-wash text-copper-deep' : 'bg-risk-tint text-risk-deep')}>
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge tone={kindTone[o.kind]}>{KIND_LABEL[o.kind]}</Badge>
                    <span className="truncate text-[11px] text-ink-faint">{o.region}</span>
                  </div>
                  <div className="mt-0.5 truncate text-[13.5px] font-600 text-ink">{o.title}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className={cn('font-display text-[15px] font-700 tabular', o.marginUplift >= 0 ? 'text-copper-deep' : 'text-risk-deep')}>
                    {o.marginUplift >= 0 ? '+' : ''}{eurC(o.marginUplift)}
                  </div>
                  <div className="text-[10.5px] text-ink-faint">{o.confidence}% conf.</div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-ink-faint" />
              </button>
            ))}
          </div>
        </Card>

        {/* Global demand map + top markets */}
        <Card>
          <SectionTitle eyebrow="Global desk" title="Live trade flow" right={<AIBadge />} />
          <TradeFlowMap className="mb-3" />
          <div className="space-y-1.5">
            {topRegions.map((r) => (
              <div key={r.hub} className="flex items-center gap-2.5">
                <span className="text-[14px]">{r.flag}</span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <span className="truncate text-[12.5px] font-550 text-ink">{r.hub}, {r.country}</span>
                    <span className={cn('text-[11px] font-600', r.trend >= 0 ? 'text-ok-deep' : 'text-late-deep')}>{pctDelta(r.trend)}</span>
                  </div>
                  <Meter value={r.index} tone={r.index >= 88 ? 'copper' : 'anvil'} className="mt-1" />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom: transit + aging */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.55fr_1fr]">
        <Card>
          <SectionTitle
            eyebrow="Logistics"
            title="In transit now"
            right={<button onClick={() => nav('/logistics')} className="inline-flex items-center gap-1 text-[12px] font-600 text-anvil-deep hover:text-anvil">Track all <ChevronRight className="h-3.5 w-3.5" /></button>}
          />
          <div className="space-y-2">
            {transit.map((s) => (
              <div key={s.id} className="flex items-center gap-3 rounded-xl border border-line bg-surface p-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-steel-tint text-steel-deep"><Ship className="h-4.5 w-4.5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-600 text-ink">{s.machineSummary}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-ink-faint">
                    <span>{s.origin}</span><ArrowRight className="h-3 w-3" /><span>{s.dest}</span>
                    <span className="text-[13px]">{s.flag}</span>
                  </div>
                </div>
                <div className="w-28 shrink-0">
                  <Meter value={s.progress} tone={s.etaRisk === 'on-track' ? 'anvil' : 'risk'} />
                  <div className="mt-1 flex items-center justify-between text-[10px] text-ink-faint">
                    <span>{SHIP_STATUS_LABEL[s.status]}</span><span className="tabular">ETA {s.eta}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow="Attention" title="Aging & watch" />
          <div className="space-y-2">
            {MACHINES.filter((m) => m.daysInYard >= 40).sort((a, b) => b.daysInYard - a.daysInYard).slice(0, 4).map((m) => (
              <button key={m.id} onClick={() => nav('/inventory')} className="lift flex w-full items-center gap-3 rounded-xl border border-line bg-surface p-3 text-left">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-risk-tint text-risk-deep"><Clock className="h-4.5 w-4.5" /></div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[12.5px] font-600 text-ink flex items-center gap-1.5"><MachineGlyph category={m.category} size={15} className="text-ink-soft" /> {m.make} {m.model}</div>
                  <div className="flex items-center gap-1 text-[11px] text-ink-faint"><MapPin className="h-3 w-3" />{m.yard} · margin {eur(margin(m))} ({marginPct(m).toFixed(0)}%)</div>
                </div>
                <Badge tone="risk">{m.daysInYard}d</Badge>
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
