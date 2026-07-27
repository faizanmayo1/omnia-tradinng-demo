import { useState, useEffect, useRef } from 'react'
import {
  Sparkles, ArrowRight, MapPin, Ship, Clock, CheckCircle2, Loader2, FileText,
  Anchor, UserCheck, PackageCheck, Download, AlertTriangle, ChevronRight,
} from 'lucide-react'
import { Card, Badge, AIBadge, Meter, ScoreRing, MachineGlyph, Plate, cn } from '../components/ui'
import { useToast } from '../components/Toast'
import { eur, eurC } from '../data/omnia'
import { OPPORTUNITIES, KIND_LABEL, type Opportunity, type OppKind } from '../data/opportunities'
import { MACHINES, margin, marginPct } from '../data/machines'
import { INQUIRIES } from '../data/demand'

const kindTone: Record<OppKind, 'copper' | 'anvil' | 'risk' | 'steel'> = {
  resale: 'copper', procure: 'anvil', reprice: 'risk', reroute: 'steel',
}

const BUILD_STEPS = [
  { icon: PackageCheck, label: 'Reserve 3 units', detail: 'OM-4471 / 4472 / 4473 held from open stock' },
  { icon: FileText, label: 'Generate quote pack', detail: 'Inspection reports + pricing to Adinkra Civil Works' },
  { icon: Anchor, label: 'Book RoRo · Antwerp → Tema', detail: 'Grande vessel, 19-day transit, door-to-door' },
  { icon: UserCheck, label: 'Notify buyer & desk', detail: 'INQ-2207 advanced to negotiating' },
]

export function Opportunities() {
  const toast = useToast()
  const [selId, setSelId] = useState(OPPORTUNITIES.find((o) => o.hero)!.id)
  const sel = OPPORTUNITIES.find((o) => o.id === selId)!

  return (
    <div className="mx-auto max-w-[1240px]">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2 text-[10.5px] font-600 uppercase tracking-[0.16em] text-ink-faint">
            Opportunity Engine <AIBadge />
          </div>
          <h1 className="font-display text-[22px] font-700 tracking-tight text-ink">Where Anvil sees margin today</h1>
          <p className="mt-1 text-[13px] text-ink-soft">Ranked calls across resale, procurement, repricing and routing — each traced to the signals behind it.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[340px_1fr]">
        {/* Left rail: opportunity list */}
        <div className="space-y-2.5">
          {OPPORTUNITIES.map((o) => (
            <button
              key={o.id}
              onClick={() => setSelId(o.id)}
              className={cn(
                'lift w-full rounded-xl border p-3.5 text-left transition',
                o.id === selId ? 'border-copper/50 bg-copper-wash shadow-card' : 'border-line bg-surface',
              )}
            >
              <div className="flex items-center gap-2">
                <Badge tone={kindTone[o.kind]}>{KIND_LABEL[o.kind]}</Badge>
                {o.hero && <Badge tone="ink">Hero</Badge>}
                <span className="ml-auto text-[10.5px] tabular text-ink-faint">{o.confidence}%</span>
              </div>
              <div className="mt-1.5 text-[13.5px] font-600 leading-snug text-ink">{o.title}</div>
              <div className="mt-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-[11px] text-ink-faint"><MapPin className="h-3 w-3" />{o.region.split('·')[0]}</span>
                <span className={cn('font-display text-[14px] font-700 tabular', o.marginUplift >= 0 ? 'text-copper-deep' : 'text-risk-deep')}>
                  {o.marginUplift >= 0 ? '+' : ''}{eurC(o.marginUplift)}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <OpportunityDetail key={sel.id} opp={sel} onToast={toast} />
      </div>
    </div>
  )
}

function OpportunityDetail({ opp, onToast }: { opp: Opportunity; onToast: (m: string, t?: 'ok' | 'anvil' | 'copper' | 'ink') => void }) {
  const units = MACHINES.filter((m) => opp.units.includes(m.id))
  const matchedInq = INQUIRIES.find((i) => opp.units.includes(i.matchId ?? ''))
  const isResale = opp.kind === 'resale'
  const [build, setBuild] = useState<'idle' | 'running' | 'done'>('idle')
  const [step, setStep] = useState(-1)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach((t) => clearTimeout(t)), [])

  const doneToast: Record<OppKind, [string, 'copper' | 'anvil' | 'ink']> = {
    resale: ['Deal OMN-DL-2207 built — RoRo booked Antwerp → Tema, buyer notified', 'copper'],
    procure: [`${opp.id} added to bid plan — Anvil set max bids across the Meppen lots`, 'anvil'],
    reprice: ['Reprice applied — OM-3980 relisted at €172,000 for Jebel Ali', 'anvil'],
    reroute: ['Unit rerouted — OM-4351 retargeted from Dar es Salaam to Tema', 'anvil'],
  }

  function finish() {
    setBuild('done')
    const [msg, tone] = doneToast[opp.kind]
    onToast(msg, tone)
  }

  function runBuild() {
    if (build !== 'idle') return
    setBuild('running')
    // Only the hero resale flow runs the full reserve → quote → freight → notify
    // sequence and produces a deal ticket. Other kinds action in one step.
    if (!isResale) {
      timers.current.push(window.setTimeout(finish, 800))
      return
    }
    setStep(0)
    BUILD_STEPS.forEach((_, i) => {
      timers.current.push(
        window.setTimeout(() => {
          setStep(i + 1)
          if (i === BUILD_STEPS.length - 1) finish()
        }, 700 * (i + 1)),
      )
    })
  }

  return (
    <div className="space-y-4">
      <Card className="relative overflow-hidden">
        <div className="pointer-events-none absolute right-0 top-0 h-32 w-64 bg-[radial-gradient(220px_120px_at_80%_-20%,rgba(180,98,46,0.12),transparent_70%)]" />
        <div className="relative flex flex-wrap items-start justify-between gap-3">
          <div className="max-w-2xl">
            <div className="mb-2 flex items-center gap-2">
              <Badge tone={kindTone[opp.kind]} solid>{KIND_LABEL[opp.kind]}</Badge>
              <span className="inline-flex items-center gap-1 text-[12px] text-ink-faint"><MapPin className="h-3.5 w-3.5" />{opp.region}</span>
            </div>
            <h2 className="font-display text-[20px] font-700 leading-tight text-ink">{opp.title}</h2>
            <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">{opp.summary}</p>
          </div>
          <div className="shrink-0 rounded-xl border border-line bg-canvas/60 p-3 text-right">
            <div className="text-[10.5px] font-600 uppercase tracking-wide text-ink-faint">Margin uplift</div>
            <div className={cn('font-display text-[26px] font-700 leading-none', opp.marginUplift >= 0 ? 'text-copper-deep' : 'text-risk-deep')}>
              {opp.marginUplift >= 0 ? '+' : ''}{eurC(opp.marginUplift)}
            </div>
            <div className="mt-2 flex items-center justify-end gap-1.5">
              <span className="text-[11px] text-ink-faint">Confidence</span>
              <span className="text-[12px] font-700 tabular text-anvil-deep">{opp.confidence}%</span>
            </div>
            <Meter value={opp.confidence} tone="anvil" className="mt-1 w-28" />
          </div>
        </div>

        {/* acting window */}
        <div className="relative mt-4 flex items-center gap-2 rounded-lg border border-risk/30 bg-risk-tint/60 px-3 py-2 text-[12.5px] text-risk-deep">
          <AlertTriangle className="h-4 w-4 shrink-0" /> <span className="font-550">Timing:</span> {opp.window}
        </div>
      </Card>

      {/* Anvil reasoning */}
      <Card>
        <div className="mb-3 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-anvil-deep" />
          <h3 className="font-display text-[15px] font-600 text-ink">Anvil reasoning</h3>
          <span className="text-[11.5px] text-ink-faint">— the signals behind this call</span>
        </div>
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
          {opp.evidence.map((e) => (
            <div key={e.label} className="rounded-lg border border-line bg-gradient-to-b from-surface to-canvas/40 p-3">
              <div className="text-[10.5px] font-600 uppercase tracking-wide text-ink-faint">{e.label}</div>
              <div className="mt-1 font-display text-[15px] font-700 tabular text-ink">{e.value}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Matched units (for resale/reroute/reprice) */}
      {units.length > 0 && (
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-[15px] font-600 text-ink">{units.length > 1 ? `${units.length} matched units in stock` : 'Matched unit'}</h3>
            {matchedInq && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-anvil-wash px-2.5 py-1 text-[11.5px] font-600 text-anvil-deep">
                <UserCheck className="h-3.5 w-3.5" /> {matchedInq.id} · {matchedInq.buyer} · {matchedInq.matchScore}% fit
              </span>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {units.map((m) => (
              <div key={m.id} className="lift rounded-xl border border-line bg-surface p-3.5">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-600 text-ink-faint"><MachineGlyph category={m.category} size={16} className="text-copper-deep" /> <Plate>{m.id}</Plate></span>
                  <ScoreRing value={m.inspection} size={38} label="insp" />
                </div>
                <div className="mt-1.5 text-[14px] font-700 text-ink">{m.make} {m.model}</div>
                <div className="text-[11.5px] text-ink-faint">{m.year} · {m.hours.toLocaleString()} h · {m.yard}</div>
                <div className="mt-2.5 grid grid-cols-2 gap-2 border-t border-line pt-2.5">
                  <div>
                    <div className="text-[10px] text-ink-faint">Acquired</div>
                    <div className="text-[13px] font-600 tabular text-ink">{eur(m.acqCost)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-ink-faint">Pred. resale</div>
                    <div className="text-[13px] font-600 tabular text-copper-deep">{eur(m.predResale)}</div>
                  </div>
                </div>
                <div className="mt-1.5 flex items-center justify-between rounded-md bg-copper-wash px-2 py-1">
                  <span className="text-[10.5px] font-600 text-copper-deep">Margin</span>
                  <span className="text-[12px] font-700 tabular text-copper-deep">{eur(margin(m))} · {marginPct(m).toFixed(0)}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Action / build */}
      <Card className={cn('relative overflow-hidden transition', build === 'done' && 'border-ok/40')}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-copper-wash text-copper-deep">
              {opp.kind === 'resale' ? <Ship className="h-5.5 w-5.5" /> : <Sparkles className="h-5.5 w-5.5" />}
            </div>
            <div>
              <div className="text-[14.5px] font-700 text-ink">Recommended action</div>
              <div className="text-[12px] text-ink-soft">{isResale ? `${opp.action} — Anvil will sequence reserve, quote, freight and buyer comms.` : 'Anvil applies this call and updates the desk.'}</div>
            </div>
          </div>
          <button
            onClick={runBuild}
            disabled={build !== 'idle'}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13.5px] font-600 shadow-sm transition',
              build === 'idle' ? 'btn-copper text-[#fdf4ee] hover:brightness-105' : 'cursor-default bg-mist text-ink-faint',
            )}
          >
            {build === 'idle' && <>{opp.action} <ArrowRight className="h-4 w-4" /></>}
            {build === 'running' && <><Loader2 className="h-4 w-4 animate-spin" /> {isResale ? 'Building deal…' : 'Applying…'}</>}
            {build === 'done' && <><CheckCircle2 className="h-4 w-4 text-ok" /> {isResale ? 'Deal built' : 'Actioned'}</>}
          </button>
        </div>

        {/* Build stepper (hero resale flow only) */}
        {isResale && build !== 'idle' && (
          <div className="mt-4 space-y-2 border-t border-line pt-4">
            {BUILD_STEPS.map((s, i) => {
              const Icon = s.icon
              const active = step > i
              const current = step === i
              return (
                <div key={i} className={cn('flex items-center gap-3 rounded-lg px-2 py-1.5 transition', current && 'bg-canvas')}>
                  <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition', active ? 'bg-ok-tint text-ok-deep' : current ? 'bg-anvil-tint text-anvil-deep' : 'bg-mist text-ink-faint')}>
                    {active ? <CheckCircle2 className="h-4.5 w-4.5" /> : current ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Icon className="h-4.5 w-4.5" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className={cn('text-[13px] font-600', active || current ? 'text-ink' : 'text-ink-faint')}>{s.label}</div>
                    <div className="truncate text-[11px] text-ink-faint">{s.detail}</div>
                  </div>
                  {active && <span className="text-[11px] font-600 text-ok-deep">Done</span>}
                </div>
              )
            })}
          </div>
        )}

        {/* Non-resale confirmation */}
        {!isResale && build === 'done' && (
          <div className="mt-4 flex animate-rise items-start gap-2.5 rounded-xl border border-ok/30 bg-ok-tint/40 px-4 py-3">
            <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-ok-deep" />
            <div>
              <div className="text-[13px] font-700 text-ink">{opp.action} confirmed</div>
              <div className="mt-0.5 text-[12px] text-ink-soft">{doneToast[opp.kind][0]}. Desk and inventory updated; {eurC(Math.abs(opp.marginUplift))} margin impact logged against {opp.id}.</div>
            </div>
          </div>
        )}

        {/* Deal ticket artifact (hero resale flow only) */}
        {isResale && build === 'done' && (
          <div className="mt-4 animate-rise overflow-hidden rounded-xl border border-ok/30 bg-gradient-to-b from-ok-tint/40 to-surface">
            <div className="flex items-center justify-between border-b border-ok/20 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-ok-deep" />
                <span className="text-[13px] font-700 text-ink">Deal ticket</span>
                <Plate tone="live">OMN-DL-2207</Plate>
                <Badge tone="ok" solid>Confirmed</Badge>
              </div>
              <button onClick={() => onToast('Deal ticket exported to PDF', 'ink')} className="inline-flex items-center gap-1 text-[11.5px] font-600 text-ink-soft hover:text-ink">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 px-4 py-3.5 sm:grid-cols-4">
              {[
                ['Buyer', matchedInq?.buyer ?? 'Adinkra Civil Works'],
                ['Units', `${units.length} × ${units[0]?.model ?? 'PC210'}`],
                ['Route', 'RoRo Antwerp → Tema'],
                ['Transit', '19 days · door-to-door'],
                ['Deal value', eur(units.reduce((s, m) => s + m.predResale, 0))],
                ['Cost basis', eur(units.reduce((s, m) => s + m.acqCost, 0))],
                ['Gross margin', `${eurC(opp.marginUplift)} · ${(opp.marginUplift / units.reduce((s, m) => s + m.acqCost, 0) * 100).toFixed(0)}%`],
                ['Status', 'Buyer notified · negotiating'],
              ].map(([k, v]) => (
                <div key={k}>
                  <div className="text-[10px] font-600 uppercase tracking-wide text-ink-faint">{k}</div>
                  <div className="mt-0.5 text-[13px] font-600 text-ink">{v}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-ok/20 bg-ok-tint/30 px-4 py-2 text-[11.5px] text-ok-deep">
              <Clock className="h-3.5 w-3.5" /> Deal cycle compressed from ~14 days to under 48 hours by Anvil sequencing.
            </div>
          </div>
        )}
      </Card>

      {build === 'idle' && (
        <div className="flex items-center justify-center gap-1.5 text-[11.5px] text-ink-faint">
          <ChevronRight className="h-3.5 w-3.5" /> Select another opportunity from the left to trace its reasoning.
        </div>
      )}
    </div>
  )
}
