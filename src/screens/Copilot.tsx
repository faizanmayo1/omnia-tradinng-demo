import { useState, useRef, useEffect } from 'react'
import {
  Send, Sparkles, ArrowRight, FileText, Download, Ship, Globe2, Boxes, Gavel, CornerDownLeft, Inbox,
} from 'lucide-react'
import { Card, AnvilMark, Badge, cn } from '../components/ui'
import { useToast } from '../components/Toast'
import { useAuth } from '../components/AuthContext'
import { canAccess } from '../data/team'
import { CLIENT, eurC } from '../data/omnia'
import { MACHINES } from '../data/machines'
import { SHIP_STATS } from '../data/shipments'
import { INBOX_STATS, ESCALATIONS } from '../data/inbox'

// Kept in sync with INV_STATS.agingUnits rather than hard-coded prose. The threshold is
// 90 days now the book is ~1,800 listings rather than 18 units in a yard.
const AGING = MACHINES.filter((m) => m.daysListed >= 90)

type Action = { label: string; to: string; icon: typeof Ship }
type Msg = {
  role: 'user' | 'anvil'
  text: string
  bullets?: string[]
  action?: Action
  artifact?: boolean
}

type Canned = { q: string; a: Omit<Msg, 'role' | 'text'> & { text: string } }

const CANNED: Canned[] = [
  {
    q: 'What is the best deal I can make today?',
    a: {
      text: 'The strongest call on the desk is the Powerscreen Chieftain cluster into West Africa. Ghana and Nigeria demand for mobile screening plant is up 22% over 30 days, and you hold three Chieftain 2100X units in EU yards acquired at €67.8K average against a predicted €111K resale — with seven closed Chieftain sales behind that estimate.',
      bullets: [
        '3 units matched: OM-4471, OM-4472, OM-4473 (Rotterdam / Hamburg)',
        'Live buyer INQ-2207 · Adinkra Civil Works · 96% fit',
        'Predicted margin uplift €46.5K · route RoRo Antwerp → Tema, 19 days',
      ],
      action: { label: 'Open the opportunity', to: '/opportunities', icon: Sparkles },
    },
  },
  {
    q: 'Which stock is aging and needs attention?',
    a: {
      // Bound to INV_STATS so this cannot drift from the inventory data again.
      text: `${AGING.length} units have passed 40 days in yard. The Sandvik DD421 drill rig at Antwerp is the priority — 52 days, carrying roughly €140/day. UAE demand is firm, so Anvil suggests a €6K reprice to clear within ~12 days while still holding a 47% margin.`,
      bullets: [
        'OM-3980 Sandvik DD421 · 52d · reprice €178K → €172K',
        `${AGING.map((m) => m.id).join(', ')} all flagged`,
        'Aging carry across them ≈ €340/day',
      ],
      action: { label: 'Review inventory', to: '/inventory', icon: Boxes },
    },
  },
  {
    q: 'Where is demand growing fastest right now?',
    a: {
      text: 'Tema (Ghana) leads at index 94, up 22%, driven by road and port expansion favouring mid-size earthmoving. Apapa (Nigeria) follows at 91 on federal road contracts. Jebel Ali is the strongest re-export gateway at 88, paying a premium for low-hour, high-inspection units.',
      bullets: [
        'Africa corridor is the clear growth engine this quarter',
        'Excavators, dozers and rollers are the categories in demand',
        '61 inquiries from Ghana alone in the last 30 days',
      ],
      action: { label: 'See demand map', to: '/demand', icon: Globe2 },
    },
  },
  {
    q: 'Draft a West Africa deal brief for the desk.',
    a: {
      text: 'Here is a one-page brief consolidating the Chieftain opportunity, the matched buyer, routing and margin. Ready to share with the trading desk.',
      artifact: true,
      action: { label: 'Open in Opportunity Engine', to: '/opportunities', icon: ArrowRight },
    },
  },
  {
    q: 'What should I be buying at auction this week?',
    a: {
      text: 'Two lots stand out. The Bomag BW213 rollers (×3) at Boels return the best ROI on radar at 69% with Ghana demand behind them, and the pair of Cat 336DL at the Meppen sale on Aug 3 predict 58% net into Kenya and UAE.',
      bullets: [
        'LOT-758 · Bomag BW213 ×3 · closes Aug 4 · ROI 69%',
        'LOT-771 · Cat 336DL ×2 · closes Aug 3 · ROI 58%',
        'Both lots score 90+ on Anvil buy score',
      ],
      action: { label: 'Open procurement radar', to: '/procurement', icon: Gavel },
    },
  },
  {
    q: 'Where are my exports right now?',
    a: {
      text: `${SHIP_STATS.inTransit} shipments are moving and ${SHIP_STATS.booked} is booked but not yet collected, carrying ${eurC(SHIP_STATS.valueInTransit)} of value door to door. ${SHIP_STATS.onWater} are on water. ${SHIP_STATS.atRisk === 0 ? 'Nothing is flagged at risk.' : `${SHIP_STATS.atRisk} have ETA risk I am watching.`}`,
      bullets: [
        'SH-8841 · 2× dozers · Antwerp → Apapa · on water, ETA Aug 2',
        'SH-8848 · Volvo EC220DL · Miami → Callao · booked, collection Aug 3',
        `${CLIENT.countries} export countries YTD across ${CLIENT.continents} continents`,
      ],
      action: { label: 'Open logistics', to: '/logistics', icon: Ship },
    },
  },
  {
    q: 'How much of the inbox is Anvil handling on its own?',
    a: {
      text: `Anvil answered ${INBOX_STATS.autoHandledPct}% of the ${INBOX_STATS.received30d} inquiries that came in over the last 30 days without anyone on the desk touching them — median first reply ${INBOX_STATS.medianReply}, against ${INBOX_STATS.manualBaseline} when this ran through a shared mailbox and a spreadsheet. Everything else was escalated on purpose.`,
      bullets: [
        `${INBOX_STATS.escalated30d} escalated in 30 days — terms, finance or judgement calls`,
        `${ESCALATIONS.length} sitting with the desk right now, each with a stated reason`,
        'Spec sheets and photo packs go out from the platform, not from a mailbox',
      ],
      action: { label: 'Open the Inquiry Desk', to: '/inbox', icon: Inbox },
    },
  },
]

export function Copilot({ onNavigate }: { onNavigate: (to: string) => void }) {
  const toast = useToast()
  const { role } = useAuth()
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: 'anvil',
      text: `Afternoon. I have watched the desk since the weekend — demand shifted toward West Africa and one opportunity is worth acting on this week. Ask me anything, or start with a suggestion below.`,
    },
  ])
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const asked = useRef<Set<string>>(new Set())

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs, thinking])

  function ask(q: string) {
    const match = CANNED.find((c) => c.q === q) ?? CANNED.find((c) => q.toLowerCase().split(' ').some((w) => w.length > 3 && c.q.toLowerCase().includes(w)))
    setMsgs((m) => [...m, { role: 'user', text: q }])
    setInput('')
    setThinking(true)
    asked.current.add(q)
    window.setTimeout(() => {
      setThinking(false)
      if (match) {
        setMsgs((m) => [...m, { role: 'anvil', ...match.a }])
      } else {
        setMsgs((m) => [...m, { role: 'anvil', text: 'I can help across stock, demand, logistics and procurement. Try one of the suggested questions to see how I trace a call back to its signals.' }])
      }
    }, 850)
  }

  const suggestions = CANNED.filter((c) => !asked.current.has(c.q)).slice(0, 3)

  return (
    <div className="mx-auto flex h-[calc(100vh-6.5rem)] max-w-[900px] flex-col">
      {/* header */}
      <div className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#242830] to-[#12151A]">
          <AnvilMark size={22} tone="copper" />
        </div>
        <div>
          <div className="flex items-center gap-2 font-display text-[17px] font-700 text-ink">Anvil Copilot <Badge tone="anvil">grounded</Badge></div>
          <div className="text-[12px] text-ink-faint">Answers trace to Omnia stock, demand signals, shipments and lots.</div>
        </div>
      </div>

      {/* thread */}
      <Card pad={false} className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
          {msgs.map((m, i) => (
            <div key={i} className={cn('flex gap-3', m.role === 'user' && 'flex-row-reverse')}>
              <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', m.role === 'anvil' ? 'bg-anvil-wash' : 'bg-ink text-white')}>
                {m.role === 'anvil' ? <AnvilMark size={17} tone="anvil" /> : <span className="text-[11px] font-700">HO</span>}
              </div>
              <div className={cn('max-w-[78%] space-y-2', m.role === 'user' && 'items-end')}>
                <div className={cn('rounded-2xl px-4 py-2.5 text-[13.5px] leading-relaxed', m.role === 'anvil' ? 'rounded-tl-sm bg-canvas text-ink' : 'rounded-tr-sm bg-ink text-white')}>
                  {m.text}
                </div>
                {m.bullets && (
                  <div className="space-y-1.5 rounded-xl border border-line bg-surface p-3">
                    {m.bullets.map((b, j) => (
                      <div key={j} className="flex items-start gap-2 text-[12.5px] text-ink-soft">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-copper" />{b}
                      </div>
                    ))}
                  </div>
                )}
                {m.artifact && <DealBrief onExport={() => toast('West Africa deal brief exported to PDF', 'ink')} />}
                {/* Only offer the jump if this role can actually get there —
                    otherwise the Shell would bounce them straight back. */}
                {m.action && canAccess(role, m.action.to) && (
                  <button onClick={() => onNavigate(m.action!.to)} className="inline-flex items-center gap-1.5 rounded-lg border border-anvil/40 bg-anvil-wash px-3 py-1.5 text-[12.5px] font-600 text-anvil-deep transition hover:bg-anvil-tint">
                    <m.action.icon className="h-3.5 w-3.5" /> {m.action.label} <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-anvil-wash"><AnvilMark size={17} tone="anvil" /></div>
              <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-canvas px-4 py-3">
                {[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 animate-pulse-soft rounded-full bg-ink-faint" style={{ animationDelay: `${i * 0.2}s` }} />)}
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* suggestions */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-t border-line px-4 py-2.5">
            {suggestions.map((c) => (
              <button key={c.q} onClick={() => ask(c.q)} className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1.5 text-[12px] font-550 text-ink-soft transition hover:border-copper/40 hover:bg-copper-wash hover:text-copper-deep">
                <Sparkles className="h-3 w-3" /> {c.q}
              </button>
            ))}
          </div>
        )}

        {/* input */}
        <div className="border-t border-line p-3">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-canvas/60 px-3 py-2 focus-within:border-anvil/50 focus-within:bg-surface">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && input.trim()) ask(input.trim()) }}
              placeholder="Ask Anvil about stock, demand, shipments or lots…"
              className="flex-1 bg-transparent text-[13.5px] text-ink outline-none placeholder:text-ink-faint"
            />
            <span className="hidden items-center gap-1 text-[10px] text-ink-faint sm:inline-flex"><CornerDownLeft className="h-3 w-3" /> send</span>
            <button onClick={() => input.trim() && ask(input.trim())} disabled={!input.trim()} className="btn-anvil flex h-8 w-8 items-center justify-center rounded-lg text-white transition disabled:opacity-40">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>
    </div>
  )
}

function DealBrief({ onExport }: { onExport: () => void }) {
  return (
    <div className="animate-rise overflow-hidden rounded-xl border border-copper/30 bg-gradient-to-b from-copper-wash to-surface">
      <div className="flex items-center justify-between border-b border-copper/20 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-copper-deep" />
          <span className="text-[13px] font-700 text-ink">West Africa deal brief</span>
          <Badge tone="copper">Generated</Badge>
        </div>
        <button onClick={onExport} className="inline-flex items-center gap-1 text-[11.5px] font-600 text-ink-soft hover:text-ink"><Download className="h-3.5 w-3.5" /> Export</button>
      </div>
      <div className="space-y-3 px-4 py-3.5 text-[12.5px]">
        <div>
          <div className="text-[10px] font-600 uppercase tracking-wide text-ink-faint">Opportunity</div>
          <div className="mt-0.5 font-600 text-ink">3× Powerscreen Chieftain 2100X → Tema / Apapa, matched to Adinkra Civil Works (INQ-2207).</div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-4">
          {[
            ['Cost basis', '€77,600'],
            ['Predicted resale', '€124,100'],
            ['Margin uplift', '€46,500'],
            ['Route', 'RoRo Antwerp → Tema'],
            ['Transit', '19 days'],
            ['Demand index', 'Tema 94 · +22%'],
            ['Buyer fit', '96%'],
            ['Act by', 'Jul 29'],
          ].map(([k, v]) => (
            <div key={k}>
              <div className="text-[10px] font-600 uppercase tracking-wide text-ink-faint">{k}</div>
              <div className="mt-0.5 font-600 text-ink">{v}</div>
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-line bg-surface px-3 py-2 text-[11.5px] text-ink-soft">
          <span className="font-600 text-ink">Recommendation:</span> reserve all three, quote at €41K each, book freight now to hold the 19-day window ahead of two competing quotes. Prepared for {CLIENT.desk}, {CLIENT.today}.
        </div>
      </div>
    </div>
  )
}
