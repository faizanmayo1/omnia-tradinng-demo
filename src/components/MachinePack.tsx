import { useEffect, useState } from 'react'
import { X, Paperclip, Camera, FileText, ClipboardCheck, Send, CheckCircle2, ArrowRight } from 'lucide-react'
import { Badge, AIBadge, MachineGlyph, ScoreRing, Divider, cn } from './ui'
import { eur, hrs } from '../data/omnia'
import { margin, type Machine } from '../data/machines'
import { compsFor } from '../data/sales'

/**
 * The outbound half of the email layer: assemble spec, photos and a landed
 * price for one machine and send it to a buyer without leaving the platform.
 * Photography is represented by placeholder plates here — real listing images
 * drop into the same slots.
 */

const ANGLES = [
  { angle: 'front-left', size: '4.2 MB' },
  { angle: 'right-side', size: '3.8 MB' },
  { angle: 'cab-interior', size: '2.9 MB' },
  { angle: 'undercarriage', size: '4.6 MB' },
  { angle: 'engine-bay', size: '3.1 MB' },
  { angle: 'hour-meter', size: '1.4 MB' },
]

const STEPS = [
  'Compiling spec sheet from inspection record',
  'Attaching photo set (6)',
  'Pricing landed cost to destination',
  'Sending to buyer',
]

export type PackRecipient = {
  name: string
  company: string
  email: string
  flag: string
  dest?: string
}

export function MachinePack({
  machine: m,
  recipient,
  open,
  onClose,
  onSent,
}: {
  machine: Machine
  recipient?: PackRecipient
  open: boolean
  onClose: () => void
  onSent: (message: string) => void
}) {
  const [step, setStep] = useState(-1) // -1 idle, 0..STEPS.length-1 running, STEPS.length done

  // Reset whenever the pack is opened for a different unit.
  useEffect(() => {
    if (open) setStep(-1)
  }, [open, m.id])

  useEffect(() => {
    if (step < 0 || step >= STEPS.length) return
    const t = setTimeout(() => setStep((s) => s + 1), 700)
    return () => clearTimeout(t)
  }, [step])

  useEffect(() => {
    if (step !== STEPS.length) return
    onSent(
      recipient
        ? `Machine pack for ${m.id} sent to ${recipient.company} — spec, 6 photos and landed price`
        : `Machine pack for ${m.id} sent — spec, 6 photos and landed price`,
    )
  }, [step])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const c = compsFor(m)
  const running = step >= 0 && step < STEPS.length
  const done = step === STEPS.length

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center overflow-y-auto bg-ink/30 p-6 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mt-6 w-full max-w-[620px] overflow-hidden rounded-2xl border border-line bg-surface shadow-pop"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-line px-5 py-4">
          <div>
            <div className="flex items-center gap-2 text-[10.5px] font-600 uppercase tracking-[0.16em] text-ink-faint">
              <Paperclip className="h-3.5 w-3.5" /> Machine pack
            </div>
            <h3 className="mt-1 font-display text-[18px] font-700 leading-tight text-ink">
              {m.make} {m.model}
            </h3>
            <div className="mt-0.5 text-[12px] text-ink-faint">
              {m.id} · {m.year} · {hrs(m.hours)} · {m.location.city}
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1 text-ink-faint transition hover:bg-mist hover:text-ink" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="max-h-[62vh] overflow-y-auto px-5 py-4">
          {/* Recipient */}
          <div className="rounded-xl border border-line bg-canvas/50 px-3.5 py-2.5">
            <div className="text-[10px] font-600 uppercase tracking-wide text-ink-faint">To</div>
            {recipient ? (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-[13px] font-600 text-ink">{recipient.name}</span>
                <span className="text-[12px] text-ink-soft">{recipient.company} {recipient.flag}</span>
                <span className="ml-auto text-[11.5px] tabular text-ink-faint">{recipient.email}</span>
              </div>
            ) : (
              <div className="mt-1 text-[12.5px] text-ink-soft">
                Select a buyer, or send to the <span className="font-600 text-ink">{m.predRegion}</span> contact list
              </div>
            )}
          </div>

          {/* Photos */}
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-600 uppercase tracking-wide text-ink-faint">
                <Camera className="h-3.5 w-3.5" /> Photo set
              </span>
              <span className="text-[11px] text-ink-faint">6 images · 20.0 MB</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {ANGLES.map((a) => (
                <figure key={a.angle} className="overflow-hidden rounded-lg border border-line">
                  <div className="relative flex h-[68px] items-center justify-center bg-gradient-to-br from-[#2A2F38] to-[#14171D] text-white/30">
                    <MachineGlyph category={m.category} size={26} />
                    <span className="absolute right-1.5 top-1.5 rounded bg-white/10 px-1 py-px text-[8px] font-600 uppercase tracking-wide text-white/60">
                      img
                    </span>
                  </div>
                  <figcaption className="truncate bg-canvas/60 px-1.5 py-1 text-[9.5px] text-ink-faint">
                    {a.angle} · {a.size}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>

          {/* Spec + pricing */}
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto]">
            <div className="rounded-xl border border-line p-3.5">
              <div className="mb-2 flex items-center gap-2 text-[11px] font-600 uppercase tracking-wide text-ink-faint">
                <FileText className="h-3.5 w-3.5" /> Specification
              </div>
              <dl className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px]">
                <Spec k="Year" v={String(m.year)} />
                <Spec k="Hours" v={hrs(m.hours)} />
                <Spec k="Category" v={m.category} />
                <Spec k="Application" v={m.vertical} />
                <Spec k="Location" v={`${m.location.city} (${m.location.region})`} />
                <Spec k="Status" v={m.status === 'ready' ? 'Ready to sell' : m.status} />
              </dl>
            </div>
            <div className="flex flex-col items-center justify-center rounded-xl border border-line bg-canvas/50 px-4 py-3">
              <ScoreRing value={m.inspection} size={54} label="insp" tone={m.inspection >= 90 ? 'ok' : 'anvil'} />
              <span className="mt-1 text-[10.5px] text-ink-faint">Omnia standard</span>
            </div>
          </div>

          <div className="mt-3 rounded-xl border border-copper/30 bg-copper-wash px-3.5 py-3">
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] font-600 uppercase tracking-wide text-copper-deep">Landed price · {m.predRegion}</span>
              <span className="font-display text-[19px] font-700 tabular text-copper-deep">{eur(m.predResale)}</span>
            </div>
            <div className="mt-1 flex items-center justify-between text-[11.5px] text-ink-soft">
              <span>Ex-yard {eur(m.askPrice)} · margin {eur(margin(m))}</span>
              <span className="tabular">Comps {eur(c.low)}–{eur(c.high)}</span>
            </div>
          </div>

          {/* Attachments */}
          <div className="mt-4">
            <div className="mb-1.5 text-[11px] font-600 uppercase tracking-wide text-ink-faint">Attachments</div>
            <ul className="space-y-1">
              <Attachment icon={<FileText className="h-3.5 w-3.5" />} name={`${m.id}-spec-sheet.pdf`} size="184 KB" />
              <Attachment icon={<ClipboardCheck className="h-3.5 w-3.5" />} name={`${m.id}-inspection-report.pdf`} size="1.2 MB" />
              <Attachment icon={<Camera className="h-3.5 w-3.5" />} name={`${m.id}-photos.zip`} size="20.0 MB" />
            </ul>
          </div>

          {/* Send progress */}
          {(running || done) && (
            <>
              <div className="my-4"><Divider /></div>
              <ol className="space-y-1.5">
                {STEPS.map((s, i) => (
                  <li key={s} className={cn('flex items-center gap-2 text-[12.5px] transition', i > step ? 'opacity-40' : '')}>
                    {i < step || done ? (
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-ok" />
                    ) : i === step ? (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center">
                        <span className="h-2 w-2 animate-beacon rounded-full bg-anvil" />
                      </span>
                    ) : (
                      <span className="h-4 w-4 shrink-0 rounded-full border border-line" />
                    )}
                    <span className={cn(i <= step ? 'text-ink' : 'text-ink-soft')}>{s}</span>
                  </li>
                ))}
              </ol>
            </>
          )}

          {done && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-ok/30 bg-ok-tint/50 px-3 py-2.5 text-[12.5px] text-ok-deep">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Sent{recipient ? ` to ${recipient.name} at ${recipient.company}` : ''}. Anvil will watch for a reply and draft the
                follow-up — you will only see it if it needs you.
              </span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 border-t border-line bg-canvas/40 px-5 py-3">
          <AIBadge label="Anvil composed" />
          <Badge tone="steel">{c.confidence} confidence pricing</Badge>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={onClose} className="rounded-lg px-3 py-2 text-[13px] font-600 text-ink-soft transition hover:bg-mist">
              {done ? 'Close' : 'Cancel'}
            </button>
            {!done && (
              <button
                onClick={() => setStep(0)}
                disabled={running}
                className="btn-ink flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-600 text-white transition hover:brightness-110 disabled:opacity-60"
              >
                {running ? 'Sending…' : 'Send machine pack'}
                {running ? <ArrowRight className="h-4 w-4" /> : <Send className="h-4 w-4" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex flex-col">
      <dt className="text-[10px] font-600 uppercase tracking-wide text-ink-faint">{k}</dt>
      <dd className="font-600 text-ink">{v}</dd>
    </div>
  )
}

function Attachment({ icon, name, size }: { icon: React.ReactNode; name: string; size: string }) {
  return (
    <li className="flex items-center gap-2 rounded-lg border border-line bg-canvas/40 px-2.5 py-1.5 text-[12px]">
      <span className="text-ink-faint">{icon}</span>
      <span className="truncate font-600 text-ink">{name}</span>
      <span className="ml-auto shrink-0 tabular text-ink-faint">{size}</span>
    </li>
  )
}
