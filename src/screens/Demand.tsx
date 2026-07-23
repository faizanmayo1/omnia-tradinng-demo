import { useState } from 'react'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { Globe2, TrendingUp, Inbox, ArrowRight, Flame } from 'lucide-react'
import { Card, StatTile, Badge, AIBadge, Meter, SectionTitle, cn } from '../components/ui'
import { useToast } from '../components/Toast'
import { pctDelta, num } from '../data/omnia'
import { REGIONS, INQUIRIES, CATEGORY_TREND, type Inquiry } from '../data/demand'
import { TradeFlowMap } from '../components/TradeFlowMap'

const inqTone: Record<Inquiry['status'], 'anvil' | 'copper' | 'steel' | 'ok'> = {
  new: 'steel', matched: 'anvil', quoted: 'copper', negotiating: 'ok',
}

export function Demand() {
  const toast = useToast()
  const [hub, setHub] = useState(REGIONS[0].hub)
  const sel = REGIONS.find((r) => r.hub === hub)!
  const totalInq = REGIONS.reduce((s, r) => s + r.inquiries, 0)

  return (
    <div className="mx-auto max-w-[1240px] space-y-5">
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="Active markets" value={REGIONS.length} accent="anvil" icon={<Globe2 className="h-4 w-4" />} sub="4 continents live" />
        <StatTile label="Buyer inquiries (30d)" value={num(totalInq)} accent="copper" icon={<Inbox className="h-4 w-4" />} sub="Across all corridors" />
        <StatTile label="Hottest market" value={REGIONS[0].hub} accent="copper" icon={<Flame className="h-4 w-4" />} sub={`Index ${REGIONS[0].index} · ${pctDelta(REGIONS[0].trend)}`} />
        <StatTile label="Excavator demand" value="93" accent="ok" icon={<TrendingUp className="h-4 w-4" />} sub="+7 index MoM · leads all" />
      </div>

      {/* Map + region detail */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <SectionTitle eyebrow="Global demand" title="Trade-flow map" right={<AIBadge />} />
          <TradeFlowMap highlight={hub} />
          <div className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
            {REGIONS.map((r) => (
              <button key={r.hub} onClick={() => setHub(r.hub)} className={cn('rounded-lg border px-2 py-1.5 text-left text-[11px] transition', r.hub === hub ? 'border-copper/50 bg-copper-wash' : 'border-line bg-surface hover:border-ink/20')}>
                <div className="flex items-center gap-1 font-600 text-ink">{r.flag} {r.hub}</div>
                <div className="text-ink-faint">idx {r.index} · {pctDelta(r.trend)}</div>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <SectionTitle eyebrow={`${sel.flag} ${sel.continent}`} title={`${sel.hub}, ${sel.country}`} />
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="font-display text-[38px] font-700 leading-none text-copper-deep">{sel.index}</div>
              <div className="text-[10.5px] font-600 uppercase tracking-wide text-ink-faint">demand index</div>
            </div>
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between text-[12px]"><span className="text-ink-soft">30-day trend</span><span className={cn('font-700', sel.trend >= 0 ? 'text-ok-deep' : 'text-late-deep')}>{pctDelta(sel.trend)}</span></div>
              <Meter value={sel.index} tone="copper" />
              <div className="flex items-center justify-between text-[12px]"><span className="text-ink-soft">Inquiries (30d)</span><span className="font-700 tabular text-ink">{sel.inquiries}</span></div>
            </div>
          </div>
          <div className="mt-4 rounded-lg border border-line bg-canvas/50 p-3">
            <div className="text-[10.5px] font-600 uppercase tracking-wide text-ink-faint">Anvil read</div>
            <p className="mt-1 text-[12.5px] leading-relaxed text-ink-soft">{sel.note}.</p>
          </div>
          <div className="mt-3">
            <div className="mb-1.5 text-[11px] font-600 uppercase tracking-wide text-ink-faint">Top categories in demand</div>
            <div className="flex flex-wrap gap-1.5">
              {sel.topCategories.map((c) => <Badge key={c} tone="anvil">{c}</Badge>)}
            </div>
          </div>
          <button onClick={() => toast(`Matching ${sel.hub} demand against open stock — 3 candidates found`, 'anvil')} className="btn-ink mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-600 text-white transition hover:brightness-110">
            Match stock to this market <ArrowRight className="h-4 w-4" />
          </button>
        </Card>
      </div>

      {/* Category trend + inquiry queue */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.35fr]">
        <Card>
          <SectionTitle eyebrow="6-month view" title="Category demand index" />
          <div className="h-[228px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={CATEGORY_TREND} margin={{ top: 6, right: 8, bottom: 0, left: -18 }}>
                <CartesianGrid stroke="#E7E3DD" vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 11, fill: '#8A8E97' }} axisLine={{ stroke: '#E7E3DD' }} tickLine={false} />
                <YAxis domain={[55, 100]} tick={{ fontSize: 11, fill: '#8A8E97' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #E7E3DD', fontSize: 12, boxShadow: '0 8px 24px -14px rgba(28,31,36,0.3)' }} />
                <Legend wrapperStyle={{ fontSize: 11 }} iconType="plainline" />
                <Line type="monotone" dataKey="Excavator" stroke="#B4622E" strokeWidth={2.4} dot={false} />
                <Line type="monotone" dataKey="Dozer" stroke="#0E8C8C" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Crane" stroke="#5C6B7A" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="Loader" stroke="#C99A3E" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card pad={false} className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-line p-4">
            <SectionTitle eyebrow="Inbound" title="Buyer inquiry queue" />
            <Badge tone="anvil"><AIBadge label="auto-matched" /></Badge>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            <table className="w-full text-left text-[12px]">
              <thead className="sticky top-0 bg-surface/95 backdrop-blur">
                <tr className="border-b border-line text-[10px] font-600 uppercase tracking-wide text-ink-faint">
                  <th className="py-2 pl-4 pr-2">Buyer / need</th>
                  <th className="px-2">Match</th>
                  <th className="px-2">Status</th>
                  <th className="py-2 pl-2 pr-4 text-right">Received</th>
                </tr>
              </thead>
              <tbody>
                {INQUIRIES.map((i) => (
                  <tr key={i.id} className="border-b border-line/70 transition hover:bg-canvas/60">
                    <td className="py-2.5 pl-4 pr-2">
                      <div className="flex items-center gap-1.5 font-600 text-ink">{i.flag} {i.buyer}</div>
                      <div className="text-[11px] text-ink-faint">{i.wants} · {i.budget}</div>
                    </td>
                    <td className="px-2">
                      {i.matchId ? (
                        <div className="flex items-center gap-1.5">
                          <span className={cn('inline-flex h-5 min-w-[30px] items-center justify-center rounded px-1 text-[10px] font-700 tabular', i.matchScore >= 90 ? 'bg-ok-tint text-ok-deep' : 'bg-anvil-tint text-anvil-deep')}>{i.matchScore}%</span>
                          <span className="text-[11px] text-ink-soft">{i.matchId}</span>
                        </div>
                      ) : <span className="text-[11px] text-ink-faint">—</span>}
                    </td>
                    <td className="px-2"><Badge tone={inqTone[i.status]}>{i.status}</Badge></td>
                    <td className="py-2.5 pl-2 pr-4 text-right text-[11px] text-ink-faint">{i.received}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
