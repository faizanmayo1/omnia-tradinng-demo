import { useState } from 'react'
import {
  Mail,
  MailCheck,
  AlertTriangle,
  Filter,
  Sparkles,
  Timer,
  ArrowRight,
  CornerUpLeft,
  ShieldAlert,
  Paperclip,
  Quote,
} from 'lucide-react'
import { Card, SectionTitle, StatTile, Badge, AIBadge, Meter, ScoreRing, MachineGlyph, Divider, Plate, cn } from '../components/ui'
import { MachinePack } from '../components/MachinePack'
import { useToast } from '../components/Toast'
import { useAuth } from '../components/AuthContext'
import { eur, hrs, pct } from '../data/omnia'
import { MACHINES } from '../data/machines'
import {
  THREADS,
  HANDLING_LABEL,
  CHANNEL_MIX,
  INBOX_STATS,
  type Thread,
  type Handling,
} from '../data/inbox'

const handlingTone: Record<Handling, 'ok' | 'anvil' | 'copper' | 'risk' | 'neutral'> = {
  'auto-replied': 'ok',
  drafted: 'anvil',
  quoted: 'copper',
  escalated: 'risk',
  filtered: 'neutral',
}

const CHANNEL_LABEL: Record<Thread['channel'], string> = {
  campaign: 'Email campaign',
  website: 'Website',
  advertising: 'Advertising',
  direct: 'Direct',
}

type Tab = 'all' | 'escalated' | 'auto' | 'filtered'

const TABS: { id: Tab; label: string; match: (t: Thread) => boolean }[] = [
  { id: 'all', label: 'All', match: (t) => t.handling !== 'filtered' },
  { id: 'escalated', label: 'Needs you', match: (t) => t.handling === 'escalated' || t.handling === 'drafted' },
  { id: 'auto', label: 'Handled by Anvil', match: (t) => t.handling === 'auto-replied' || t.handling === 'quoted' },
  { id: 'filtered', label: 'Filtered', match: (t) => t.handling === 'filtered' },
]

export function InquiryDesk() {
  const toast = useToast()
  const { log } = useAuth()
  const [tab, setTab] = useState<Tab>('all')
  const [selId, setSelId] = useState(THREADS[0].id)
  const [packFor, setPackFor] = useState<string | null>(null)

  const list = THREADS.filter(TABS.find((t) => t.id === tab)!.match)
  // Keep the detail panel in step with the visible list: if the selected thread
  // is filtered out by the active tab, fall through to the first one shown.
  const sel = list.find((t) => t.id === selId) ?? list[0] ?? THREADS[0]
  const packMachine = MACHINES.find((m) => m.id === packFor)

  return (
    <div className="mx-auto max-w-[1240px] space-y-5">
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile
          label="Inquiries received"
          value={INBOX_STATS.received30d}
          accent="ink"
          icon={<Mail className="h-4 w-4" />}
          sub="Last 30 days, all channels"
        />
        <StatTile
          label="Handled by Anvil"
          value={pct(INBOX_STATS.autoHandledPct)}
          accent="anvil"
          icon={<Sparkles className="h-4 w-4" />}
          sub="Answered without the desk"
        />
        <StatTile
          label="Escalated to desk"
          value={INBOX_STATS.escalated30d}
          accent="risk"
          icon={<AlertTriangle className="h-4 w-4" />}
          sub="Terms, finance or judgement"
        />
        <StatTile
          label="Median first reply"
          value={INBOX_STATS.medianReply}
          accent="ok"
          icon={<Timer className="h-4 w-4" />}
          sub={`Was ${INBOX_STATS.manualBaseline} on email + spreadsheet`}
        />
      </div>

      {/* Where the inquiries come from */}
      <Card>
        <SectionTitle
          eyebrow="Origin of inbound"
          title="Half of everything arrives by email"
          right={<span className="text-[11.5px] text-ink-faint">Share of inquiries, last 30 days</span>}
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {CHANNEL_MIX.map((c) => (
            <div key={c.label}>
              <div className="flex items-baseline justify-between">
                <span className="text-[12.5px] font-600 text-ink">{c.label}</span>
                <span className="font-display text-[15px] font-700 tabular text-ink">{pct(c.share)}</span>
              </div>
              <Meter value={c.share} tone={c.tone} className="mt-1.5" />
            </div>
          ))}
        </div>
        <p className="mt-3 text-[12px] text-ink-soft">
          Direct email campaigns to existing contacts drive roughly half of all sales — which is why the inquiry desk sits
          inside the platform rather than in a separate mailbox.
        </p>
      </Card>

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-1.5">
        {TABS.map((t) => {
          const count = THREADS.filter(t.match).length
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[12.5px] font-600 transition',
                tab === t.id ? 'border-ink bg-ink text-white' : 'border-line bg-surface text-ink-soft hover:border-ink/30',
              )}
            >
              {t.label}
              <span className={cn('ml-1.5 tabular', tab === t.id ? 'text-white/60' : 'text-ink-faint')}>{count}</span>
            </button>
          )
        })}
        <div className="ml-auto"><AIBadge label="Anvil reading inbound" /></div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_1.25fr]">
        {/* Thread list */}
        <div className="space-y-2.5">
          {list.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelId(t.id)}
              className={cn(
                'lift w-full rounded-xl border p-3.5 text-left transition',
                t.id === sel.id ? 'border-copper/50 bg-copper-wash shadow-card' : 'border-line bg-surface',
                t.handling === 'filtered' && t.id !== sel.id && 'opacity-70',
              )}
            >
              <div className="flex items-center gap-2">
                <Plate tone={t.id === sel.id ? "live" : "default"}>{t.id}</Plate>
                <Badge tone={handlingTone[t.handling]}>{HANDLING_LABEL[t.handling]}</Badge>
                <span className="ml-auto text-[11px] text-ink-faint">{t.received}</span>
              </div>
              <div className="mt-1 truncate text-[13.5px] font-600 text-ink">{t.subject}</div>
              <div className="mt-0.5 flex items-center gap-1.5 text-[11.5px] text-ink-faint">
                <span>{t.flag}</span>
                <span className="truncate">{t.company}</span>
                <span className="h-2.5 w-px bg-line" />
                <span className="shrink-0">{CHANNEL_LABEL[t.channel]}</span>
                {t.matchId && (
                  <>
                    <span className="h-2.5 w-px bg-line" />
                    <Plate>{t.matchId}</Plate>
                  </>
                )}
              </div>
            </button>
          ))}
          {!list.length && (
            <Card className="text-center text-[12.5px] text-ink-faint">Nothing in this view.</Card>
          )}
        </div>

        <ThreadDetail
          thread={sel}
          onSendPack={(id) => setPackFor(id)}
          onApprove={() => {
            toast(`Draft reply for ${sel.id} approved and sent to ${sel.company}`, 'ink')
            log('Approved and sent Anvil draft reply', `${sel.id} · ${sel.company}`)
          }}
          onClaim={() => {
            toast(`${sel.id} claimed — ${sel.escalation?.owner ?? 'desk'} notified`, 'copper')
            log('Claimed escalated inquiry', `${sel.id} · ${sel.company}`)
          }}
        />
      </div>

      {packMachine && (
        <MachinePack
          machine={packMachine}
          open={!!packFor}
          onClose={() => setPackFor(null)}
          onSent={(msg) => {
            toast(msg, 'anvil')
            log('Sent machine pack to buyer', `${packMachine.id} → ${sel.company}`)
          }}
          recipient={{ name: sel.from, company: sel.company, email: sel.email, flag: sel.flag, dest: sel.country }}
        />
      )}
    </div>
  )
}

function ThreadDetail({
  thread: t,
  onSendPack,
  onApprove,
  onClaim,
}: {
  thread: Thread
  onSendPack: (machineId: string) => void
  onApprove: () => void
  onClaim: () => void
}) {
  const machine = MACHINES.find((m) => m.id === t.matchId)

  return (
    <Card className="h-fit">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[11px] font-600 text-ink-faint">
            <Mail className="h-3.5 w-3.5" /> <Plate tone="live">{t.id}</Plate> {CHANNEL_LABEL[t.channel]}
          </div>
          <h3 className="mt-1 font-display text-[18px] font-700 leading-tight text-ink">{t.subject}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12.5px] text-ink-soft">
            <span className="font-600 text-ink">{t.from}</span>
            <span>·</span>
            <span>{t.company} {t.flag}</span>
            <span className="text-ink-faint">{t.email}</span>
          </div>
        </div>
        <Badge tone={handlingTone[t.handling]} solid={t.handling === 'escalated'}>
          {HANDLING_LABEL[t.handling]}
        </Badge>
      </div>

      {/* Inbound message */}
      <div className="mt-3 rounded-xl border border-line bg-canvas/50 px-3.5 py-3">
        <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-600 uppercase tracking-wide text-ink-faint">
          <Quote className="h-3 w-3" /> Received {t.received}
        </div>
        <p className="text-[12.5px] leading-relaxed text-ink-soft">{t.body}</p>
      </div>

      {/* Anvil read */}
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-600 uppercase tracking-wide text-ink-faint">Anvil read</span>
          <AIBadge />
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-anvil/30 bg-anvil-wash px-3.5 py-3">
          <ScoreRing value={t.confidence} size={48} label="conf" />
          <div className="min-w-0 flex-1">
            <div className="text-[13px] font-600 text-anvil-deep">{t.intent}</div>
            <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1.5">
              {t.extracted.map((e) => (
                <div key={e.label} className="min-w-0">
                  <dt className="text-[10px] font-600 uppercase tracking-wide text-ink-faint">{e.label}</dt>
                  <dd className="truncate text-[12px] font-600 text-ink">{e.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Matched unit */}
      {machine && (
        <div className="mt-4">
          <div className="mb-2 text-[11px] font-600 uppercase tracking-wide text-ink-faint">Matched from stock</div>
          <div className="flex items-center gap-3 rounded-xl border border-line p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mist text-ink-soft">
              <MachineGlyph category={machine.category} size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-[13.5px] font-600 text-ink">
                {machine.make} {machine.model}
              </div>
              <div className="text-[11.5px] text-ink-faint">
                <Plate>{machine.id}</Plate> <span className="readout">{machine.year} · {hrs(machine.hours)}</span> · {machine.location.city}
              </div>
            </div>
            <div className="shrink-0 text-right">
              <div className="text-[11px] text-ink-faint">Landed</div>
              <div className="text-[13px] font-700 tabular text-copper-deep">{eur(machine.predResale)}</div>
            </div>
          </div>
          <button
            onClick={() => onSendPack(machine.id)}
            className="btn-anvil mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-600 text-white transition hover:brightness-110"
          >
            <Paperclip className="h-4 w-4" /> Send machine pack — spec &amp; photos
          </button>
        </div>
      )}

      {/* Escalation */}
      {t.escalation && (
        <>
          <div className="my-4"><Divider /></div>
          <div className="rounded-xl border border-risk/30 bg-risk-tint/50 px-3.5 py-3">
            <div className="flex items-center gap-1.5 text-[11px] font-600 uppercase tracking-wide text-risk-deep">
              <ShieldAlert className="h-3.5 w-3.5" /> Escalated to a human
            </div>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-risk-deep">{t.escalation.reason}</p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11.5px]">
              <Badge tone="risk" solid>{t.escalation.owner}</Badge>
              <span className="text-ink-soft">{t.escalation.policy}</span>
            </div>
          </div>
          <button
            onClick={onClaim}
            className="btn-ink mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-600 text-white transition hover:brightness-110"
          >
            Claim and reply personally <ArrowRight className="h-4 w-4" />
          </button>
        </>
      )}

      {/* Reply */}
      {t.reply && (
        <>
          <div className="my-4"><Divider /></div>
          <div className="mb-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-600 uppercase tracking-wide text-ink-faint">
              <CornerUpLeft className="h-3.5 w-3.5" />
              {t.handling === 'drafted' ? 'Draft reply — awaiting approval' : 'Reply sent by Anvil'}
            </span>
            {t.repliedIn && (
              <Badge tone="ok">
                <MailCheck className="h-3 w-3" /> {t.repliedIn}
              </Badge>
            )}
          </div>
          <div
            className={cn(
              'rounded-xl border px-3.5 py-3 text-[12.5px] leading-relaxed',
              t.handling === 'drafted' ? 'border-anvil/40 bg-anvil-wash text-ink' : 'border-ok/30 bg-ok-tint/40 text-ink',
            )}
          >
            {t.reply}
          </div>
          {t.handling === 'drafted' && (
            <button
              onClick={onApprove}
              className="btn-ink mt-2 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-600 text-white transition hover:brightness-110"
            >
              Approve and send <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </>
      )}

      {/* Filtered */}
      {t.handling === 'filtered' && (
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-line bg-canvas/60 px-3 py-2.5 text-[12.5px] text-ink-soft">
          <Filter className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          <span>
            Kept out of the buyer queue, not deleted. Anvil filtered {THREADS.filter((x) => x.handling === 'filtered').length} messages
            like this in the last 30 days.
          </span>
        </div>
      )}
    </Card>
  )
}
