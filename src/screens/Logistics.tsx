import { useState } from 'react'
import { Ship, Package, Anchor, AlertTriangle, ArrowRight, CheckCircle2, Circle, MapPin, Globe2 } from 'lucide-react'
import { Card, StatTile, Badge, AIBadge, Meter, cn } from '../components/ui'
import { useToast } from '../components/Toast'
import { eur, eurC } from '../data/omnia'
import { SHIPMENTS, SHIP_STATS, SHIP_STATUS_LABEL, type Shipment } from '../data/shipments'

const riskTone = { 'on-track': 'ok', watch: 'risk', delayed: 'late' } as const
const riskLabel = { 'on-track': 'On track', watch: 'Watch', delayed: 'Delayed' } as const
const modeIcon = { RoRo: Ship, FCL: Package, LCL: Package, 'Flat-rack': Anchor }

export function Logistics() {
  const toast = useToast()
  const [selId, setSelId] = useState(SHIPMENTS[0].id)
  const sel = SHIPMENTS.find((s) => s.id === selId)!

  return (
    <div className="mx-auto max-w-[1240px] space-y-5">
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Shipments in transit" value={SHIP_STATS.inTransit} accent="steel" icon={<Ship className="h-4 w-4" />} sub={`${SHIP_STATS.onWater} on water now`} />
        <StatTile label="Value in transit" value={eurC(SHIP_STATS.valueInTransit)} accent="copper" icon={<Globe2 className="h-4 w-4" />} sub="Door-to-door, insured" />
        <StatTile label="ETA at risk" value={SHIP_STATS.atRisk} accent="risk" icon={<AlertTriangle className="h-4 w-4" />} sub="Anvil watching closely" />
        <StatTile label="Export countries YTD" value={SHIP_STATS.countriesYTD} accent="anvil" icon={<Anchor className="h-4 w-4" />} sub="6 continents served" />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* Shipment list */}
        <div className="space-y-2.5">
          {SHIPMENTS.map((s) => {
            const Icon = modeIcon[s.mode]
            return (
              <button key={s.id} onClick={() => setSelId(s.id)} className={cn('lift w-full rounded-xl border p-3.5 text-left transition', s.id === selId ? 'border-copper/50 bg-copper-wash shadow-card' : 'border-line bg-surface')}>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-steel-tint text-steel-deep"><Icon className="h-5 w-5" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-600 text-ink-faint">{s.id}</span>
                      <Badge tone="steel">{s.mode}</Badge>
                      <Badge tone={riskTone[s.etaRisk]}>{riskLabel[s.etaRisk]}</Badge>
                    </div>
                    <div className="mt-0.5 truncate text-[13.5px] font-600 text-ink">{s.machineSummary}</div>
                    <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-faint">
                      <span>{s.origin}</span><ArrowRight className="h-3 w-3" /><span>{s.dest}</span><span>{s.flag}</span>
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <div className="text-[11px] text-ink-faint">ETA</div>
                    <div className="text-[13px] font-700 tabular text-ink">{s.eta}</div>
                  </div>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <Meter value={s.progress} tone={s.etaRisk === 'on-track' ? 'anvil' : 'risk'} />
                  <span className="w-10 shrink-0 text-right text-[10.5px] font-600 tabular text-ink-soft">{s.progress}%</span>
                </div>
              </button>
            )
          })}
        </div>

        {/* Detail: leg timeline */}
        <ShipmentDetail shipment={sel} onNotify={() => toast(`Buyer for ${sel.id} notified with live ETA ${sel.eta}`, 'ink')} />
      </div>
    </div>
  )
}

function ShipmentDetail({ shipment: s, onNotify }: { shipment: Shipment; onNotify: () => void }) {
  const Icon = modeIcon[s.mode]
  return (
    <Card className="h-fit">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-600 text-ink-faint"><Icon className="h-4 w-4 text-steel-deep" />{s.mode} · {s.id}</div>
          <h3 className="mt-1 font-display text-[18px] font-700 leading-tight text-ink">{s.machineSummary}</h3>
          <div className="mt-1 flex items-center gap-1.5 text-[12.5px] text-ink-soft">
            <MapPin className="h-3.5 w-3.5" /> {s.origin} <ArrowRight className="h-3.5 w-3.5" /> {s.dest} {s.flag}
          </div>
        </div>
        <Badge tone={riskTone[s.etaRisk]} solid>{riskLabel[s.etaRisk]}</Badge>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <Mini label="Vessel" value={s.vessel} />
        <Mini label="Units" value={String(s.units)} />
        <Mini label="Value" value={eur(s.value)} />
      </div>

      {s.etaRisk !== 'on-track' && (
        <div className="mt-3 flex items-start gap-2 rounded-lg border border-risk/30 bg-risk-tint/50 px-3 py-2 text-[12px] text-risk-deep">
          <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>Anvil flags transhipment risk on this lane. Buffer of 3-4 days recommended before quoting a firm handover date.</span>
        </div>
      )}

      {/* Timeline */}
      <div className="mt-4">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-600 uppercase tracking-wide text-ink-faint"><AIBadge label="live tracking" /></div>
        <ol className="relative space-y-0.5">
          {s.legs.map((l, i) => {
            const isCurrent = !l.done && (i === 0 || s.legs[i - 1].done)
            return (
              <li key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  {l.done ? <CheckCircle2 className="h-5 w-5 text-ok" /> : isCurrent ? <span className="flex h-5 w-5 items-center justify-center"><span className="h-2.5 w-2.5 animate-beacon rounded-full bg-anvil" /></span> : <Circle className="h-5 w-5 text-line" />}
                  {i < s.legs.length - 1 && <span className={cn('my-0.5 w-px flex-1', l.done ? 'bg-ok/40' : 'bg-line')} style={{ minHeight: 18 }} />}
                </div>
                <div className={cn('pb-2', !l.done && !isCurrent && 'opacity-55')}>
                  <div className={cn('text-[13px]', l.done || isCurrent ? 'font-600 text-ink' : 'text-ink-soft')}>{l.label}</div>
                  {l.date && <div className="text-[11px] text-ink-faint">{l.date}</div>}
                  {isCurrent && <div className="mt-0.5 text-[11px] font-600 text-anvil-deep">In progress · {SHIP_STATUS_LABEL[s.status]}</div>}
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      <button onClick={onNotify} className="btn-ink mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-600 text-white transition hover:brightness-110">
        Send buyer live ETA update <ArrowRight className="h-4 w-4" />
      </button>
    </Card>
  )
}

function Mini({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-canvas/50 p-2.5">
      <div className="text-[10px] font-600 uppercase tracking-wide text-ink-faint">{label}</div>
      <div className="mt-0.5 truncate text-[12.5px] font-600 text-ink">{value}</div>
    </div>
  )
}
