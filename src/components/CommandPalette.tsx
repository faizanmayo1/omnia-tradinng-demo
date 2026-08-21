import { useState, useEffect, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Sparkles,
  Boxes,
  Globe2,
  Ship,
  Gavel,
  MessageSquareText,
  Search,
  CornerDownLeft,
  Inbox,
  ShieldCheck,
} from 'lucide-react'
import { cn } from './ui'
import { useAuth } from './AuthContext'
import { canAccess } from '../data/team'

type Item = { label: string; sub: string; to: string; icon: typeof Boxes; keywords: string }
const ITEMS: Item[] = [
  { label: 'Trading Command Center', sub: 'Live desk, stock health & alerts', to: '/', icon: LayoutDashboard, keywords: 'home command center overview desk margin stock' },
  { label: 'Opportunity Engine', sub: 'Chieftain → West Africa surge', to: '/opportunities', icon: Sparkles, keywords: 'opportunity anvil resale match hero powerscreen chieftain screener ghana nigeria procure' },
  { label: 'Inventory & Machines', sub: 'Stock, inspection, predicted resale', to: '/inventory', icon: Boxes, keywords: 'inventory stock machines excavator crane dozer inspection resale margin yard' },
  { label: 'Demand Intelligence', sub: 'Regional demand & buyer inquiries', to: '/demand', icon: Globe2, keywords: 'demand buyers inquiries region tema apapa jebel ali india map trade flow' },
  { label: 'Logistics & Shipments', sub: 'RoRo, containers, ETAs', to: '/logistics', icon: Ship, keywords: 'logistics shipping roro container fcl lcl vessel eta port tracking' },
  { label: 'Procurement & Sourcing', sub: 'Auctions, dealers, buy lots', to: '/procurement', icon: Gavel, keywords: 'procurement sourcing auction dealer ritchie euro lots bid buy roi' },
  { label: 'Anvil Copilot', sub: 'Ask across the operation', to: '/copilot', icon: MessageSquareText, keywords: 'ai anvil copilot ask chat brief deal' },
  { label: 'Inquiry Desk', sub: 'Inbound email, auto-replies & escalations', to: '/inbox', icon: Inbox, keywords: 'inbox inquiry desk email mail campaign auto reply escalation buyer message whatsapp' },
  { label: 'Access & Audit', sub: 'Roles, permissions & audit trail', to: '/access', icon: ShieldCheck, keywords: 'access audit roles permissions users team staff security log who changed' },
  { label: 'OPP-2207 · Chieftain cluster', sub: 'West Africa surge · build deal', to: '/opportunities', icon: Sparkles, keywords: 'opp2207 chieftain powerscreen screener west africa tema apapa hero deal roro' },
  { label: 'OM-4471 · Powerscreen Chieftain 2100X', sub: 'Rotterdam · ready · 91 inspection', to: '/inventory', icon: Boxes, keywords: 'om4471 powerscreen chieftain 2100x rotterdam screener hero unit' },
  { label: 'THR-5496 · Sahel Roads', sub: 'Escalated · 90-day terms requested', to: '/inbox', icon: Inbox, keywords: 'thr5496 sahel roads escalation payment terms bomag roller ghana inquiry' },
  { label: 'SH-8841 · RoRo to Apapa', sub: '2× dozers · on water', to: '/logistics', icon: Ship, keywords: 'sh8841 roro apapa nigeria dozer grande lagos shipment' },
  { label: 'LOT-771 · Cat 336 ×2', sub: 'Meppen auction · closes Aug 3', to: '/procurement', icon: Gavel, keywords: 'lot771 cat 336 meppen auction ritchie bid procurement' },
]

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate()
  const { role } = useAuth()
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const results = useMemo(() => {
    // Respect the active role: the palette must not offer a destination the
    // sidebar has locked, or selecting it would just bounce to the dashboard.
    const allowed = ITEMS.filter((it) => canAccess(role, it.to))
    const s = q.trim().toLowerCase()
    if (!s) return allowed
    return allowed.filter((it) => (it.label + ' ' + it.sub + ' ' + it.keywords).toLowerCase().includes(s))
  }, [q, role])

  useEffect(() => {
    if (open) {
      setQ('')
      setIdx(0)
      setTimeout(() => inputRef.current?.focus(), 20)
    }
  }, [open])

  useEffect(() => {
    setIdx(0)
  }, [q])

  if (!open) return null

  function go(to: string) {
    navigate(to)
    onClose()
  }

  function onKey(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setIdx((i) => Math.min(results.length - 1, i + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setIdx((i) => Math.max(0, i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (results[idx]) go(results[idx].to)
    } else if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-start justify-center bg-ink/30 px-4 pt-[12vh] backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-[560px] overflow-hidden rounded-2xl border border-line bg-surface shadow-pop" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center gap-2.5 border-b border-line px-4 py-3">
          <Search className="h-4 w-4 text-ink-faint" />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKey}
            placeholder="Search stock, buyers, lanes, opportunities…"
            className="flex-1 bg-transparent text-[14px] text-ink outline-none placeholder:text-ink-faint"
          />
          <span className="rounded border border-line px-1.5 py-0.5 text-[10px] font-600 text-ink-faint">ESC</span>
        </div>
        <div className="max-h-[52vh] overflow-y-auto p-2">
          {results.length === 0 && <div className="px-3 py-6 text-center text-[13px] text-ink-faint">No matches</div>}
          {results.map((it, i) => {
            const Icon = it.icon
            return (
              <button
                key={it.label}
                onMouseEnter={() => setIdx(i)}
                onClick={() => go(it.to)}
                className={cn('flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition', i === idx ? 'bg-copper-tint' : 'hover:bg-canvas')}
              >
                <span className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', i === idx ? 'bg-surface' : 'bg-canvas')}>
                  <Icon className={cn('h-4 w-4', i === idx ? 'text-copper-deep' : 'text-ink-faint')} />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-600 text-ink">{it.label}</div>
                  <div className="truncate text-[11px] text-ink-faint">{it.sub}</div>
                </div>
                {i === idx && <CornerDownLeft className="h-3.5 w-3.5 text-ink-faint" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
