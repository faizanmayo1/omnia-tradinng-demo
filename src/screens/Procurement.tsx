import { Gavel, TrendingUp, PackageCheck, ShieldCheck, ArrowRight, Timer } from 'lucide-react'
import { Card, StatTile, Badge, AIBadge, Meter, SectionTitle } from '../components/ui'
import { useToast } from '../components/Toast'
import { SUPPLIERS, LOTS } from '../data/suppliers'

export function Procurement() {
  const toast = useToast()
  const unitsYtd = SUPPLIERS.reduce((s, x) => s + x.unitsYtd, 0)
  const activeLots = SUPPLIERS.reduce((s, x) => s + x.activeLots, 0)
  const avgRel = Math.round(SUPPLIERS.reduce((s, x) => s + x.reliability, 0) / SUPPLIERS.length)
  const bestRoi = [...LOTS].sort((a, b) => b.roi - a.roi)[0]

  return (
    <div className="mx-auto max-w-[1240px] space-y-5">
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Units sourced YTD" value={unitsYtd} accent="ink" icon={<PackageCheck className="h-4 w-4" />} sub="From 6 core sources" />
        <StatTile label="Active lots watched" value={activeLots} accent="anvil" icon={<Gavel className="h-4 w-4" />} sub="Auctions & disposals" />
        <StatTile label="Avg source reliability" value={`${avgRel}%`} accent="ok" icon={<ShieldCheck className="h-4 w-4" />} sub="Title & condition accuracy" />
        <StatTile label="Best ROI on radar" value={`${bestRoi.roi}%`} accent="copper" icon={<TrendingUp className="h-4 w-4" />} sub={`${bestRoi.make} ${bestRoi.model}`} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.4fr_1fr]">
        {/* Procurement radar */}
        <Card pad={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line p-4">
            <SectionTitle eyebrow="Procurement radar" title="Incoming lots worth bidding" />
            <AIBadge label="Anvil buy-score" />
          </div>
          <div className="divide-y divide-line">
            {LOTS.sort((a, b) => b.score - a.score).map((l) => (
              <div key={l.id} className="flex items-center gap-3 p-3.5 transition hover:bg-canvas/50">
                <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-lg bg-gradient-to-b from-copper-wash to-surface">
                  <span className="font-display text-[15px] font-700 leading-none text-copper-deep">{l.score}</span>
                  <span className="text-[8px] font-600 uppercase text-ink-faint">score</span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-600 text-ink">{l.flag} {l.make} {l.model}</span>
                    <Badge tone="copper">ROI {l.roi}%</Badge>
                  </div>
                  <div className="mt-0.5 text-[11.5px] text-ink-faint">{l.source} · hammer {l.estHammer} → resale {l.predResale}</div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="inline-flex items-center gap-1 text-[11px] font-600 text-risk-deep"><Timer className="h-3.5 w-3.5" /> {l.closes}</div>
                  <button onClick={() => toast(`${l.id} added to bid plan — Anvil set a max bid at ${l.estHammer.split('-')[0]}`, 'anvil')} className="mt-1 inline-flex items-center gap-1 rounded-md bg-ink px-2.5 py-1 text-[11px] font-600 text-white transition hover:brightness-110">
                    Add to bid <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Supplier network */}
        <Card>
          <SectionTitle eyebrow="Source network" title="Supplier scorecards" />
          <div className="space-y-2.5">
            {SUPPLIERS.sort((a, b) => b.reliability - a.reliability).map((s) => (
              <div key={s.id} className="rounded-xl border border-line bg-gradient-to-b from-surface to-canvas/40 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[14px]">{s.flag}</span>
                    <div>
                      <div className="text-[13px] font-600 text-ink">{s.name}</div>
                      <div className="text-[10.5px] text-ink-faint">{s.type} · {s.country}</div>
                    </div>
                  </div>
                  <Badge tone={s.activeLots > 0 ? 'anvil' : 'neutral'}>{s.activeLots} lots</Badge>
                </div>
                <div className="mt-2.5 flex items-center gap-3">
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-[10.5px] text-ink-faint"><span>Reliability</span><span className="font-600 text-ink">{s.reliability}%</span></div>
                    <Meter value={s.reliability} tone={s.reliability >= 90 ? 'ok' : 'copper'} className="mt-1" />
                  </div>
                  <div className="text-center">
                    <div className="font-display text-[15px] font-700 tabular text-ink">{s.unitsYtd}</div>
                    <div className="text-[9px] text-ink-faint">units YTD</div>
                  </div>
                  <div className="text-center">
                    <div className="font-display text-[15px] font-700 tabular text-ink">{s.avgLeadDays}d</div>
                    <div className="text-[9px] text-ink-faint">avg lead</div>
                  </div>
                </div>
                <div className="mt-2 text-[11px] leading-snug text-ink-soft">{s.note}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
