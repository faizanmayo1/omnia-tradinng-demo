import { type ReactNode, useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Sparkles,
  Boxes,
  Globe2,
  Ship,
  Gavel,
  MessageSquareText,
  Search,
  Inbox,
  ShieldCheck,
  Lock,
  LogOut,
} from 'lucide-react'
import { cn, AnvilMark } from './ui'
import { CommandPalette } from './CommandPalette'
import { useAuth } from './AuthContext'
import { CLIENT, num } from '../data/omnia'
import { OPP_STATS } from '../data/opportunities'
import { ROLES, ROLE_LABEL, canAccess, landingFor } from '../data/team'

const NAV: {
  to: string
  label: string
  icon: typeof LayoutDashboard
  end?: boolean
  ai?: boolean
  hero?: boolean
}[] = [
  { to: '/', label: 'Trading Command Center', icon: LayoutDashboard, end: true },
  { to: '/opportunities', label: 'Opportunity Engine', icon: Sparkles, hero: true, ai: true },
  { to: '/inbox', label: 'Inquiry Desk', icon: Inbox, ai: true },
  { to: '/inventory', label: 'Inventory & Machines', icon: Boxes, ai: true },
  { to: '/demand', label: 'Demand Intelligence', icon: Globe2, ai: true },
  { to: '/logistics', label: 'Logistics & Shipments', icon: Ship },
  { to: '/procurement', label: 'Procurement & Sourcing', icon: Gavel, ai: true },
  { to: '/copilot', label: 'Anvil Copilot', icon: MessageSquareText, ai: true },
  { to: '/access', label: 'Access & Audit', icon: ShieldCheck },
]

export function Shell({ children }: { children: ReactNode }) {
  const loc = useLocation()
  const navigate = useNavigate()
  const { user, role, signOut } = useAuth()
  const current = NAV.find((n) => (n.end ? loc.pathname === n.to : loc.pathname.startsWith(n.to)))
  const [paletteOpen, setPaletteOpen] = useState(false)

  // If the signed-in role has no access to the screen currently open, fall back
  // to the first screen that role can reach. Using landingFor rather than a
  // hard-coded '/' matters: a pending account cannot reach '/' at all, and
  // redirecting there would loop.
  useEffect(() => {
    if (canAccess(role, loc.pathname)) return
    const target = landingFor(role)
    if (target !== loc.pathname) navigate(target, { replace: true })
  }, [role, loc.pathname, navigate])

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setPaletteOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="flex h-screen w-full overflow-hidden bg-canvas text-ink">
      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      {/* Sidebar, forged-graphite trading rail */}
      <aside className="relative flex w-[256px] shrink-0 flex-col bg-gradient-to-b from-[#242830] to-[#12151A] text-white/80 shadow-[1px_0_0_rgba(0,0,0,0.06)]">
        {/* faint copper forge glow at top */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[radial-gradient(320px_150px_at_22%_-10%,rgba(180,98,46,0.20),transparent_70%)]" />
        <div className="relative flex items-center gap-2.5 px-5 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.06] ring-1 ring-white/10">
            <AnvilMark size={22} tone="copper" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-[15.5px] font-700 tracking-tight text-white">Omnia Machinery</div>
            <div className="text-[10.5px] text-white/45">Anvil · Trading Intelligence</div>
          </div>
        </div>

        <div className="relative px-3 pb-1">
          <button
            onClick={() => setPaletteOpen(true)}
            className="flex w-full items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-[12.5px] text-white/45 transition hover:border-copper/50 hover:text-white/80"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search stock, buyers, lanes…</span>
            <span className="ml-auto text-[10px] tabular text-white/35">⌘K</span>
          </button>
        </div>

        <nav className="relative flex-1 space-y-0.5 overflow-y-auto px-3 py-3">
          {NAV.map((n) => {
            const Icon = n.icon
            if (!canAccess(role, n.to)) {
              return (
                <div
                  key={n.to}
                  title={`Not available to the ${ROLES.find((r) => r.id === role)?.label} role`}
                  className="group relative flex cursor-not-allowed items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-450 text-white/25"
                >
                  <Icon className="h-4 w-4 shrink-0 text-white/20" strokeWidth={2} />
                  <span className="truncate">{n.label}</span>
                  <Lock className="ml-auto h-3 w-3 shrink-0 text-white/25" />
                </div>
              )
            }
            return (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.end}
                className={({ isActive }) =>
                  cn(
                    'group relative flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] font-450 transition',
                    isActive ? 'bg-copper/[0.16] text-copper-soft' : 'text-white/60 hover:bg-white/[0.06] hover:text-white',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-copper shadow-[0_0_12px_rgba(180,98,46,0.7)]" />}
                    <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-copper-soft' : 'text-white/40')} strokeWidth={2} />
                    <span className="truncate">{n.label}</span>
                    {n.hero && (
                      <span className="ml-auto rounded bg-copper/25 px-1 py-0.5 text-[9px] font-600 uppercase tracking-wide text-copper-soft">
                        Hero
                      </span>
                    )}
                    {n.ai && !n.hero && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-anvil" title="Anvil" />}
                  </>
                )}
              </NavLink>
            )
          })}
        </nav>

        <div className="relative mx-3 mb-3 rounded-xl border border-white/10 bg-white/[0.04] p-3">
          <div className="flex items-center justify-between text-[11px]">
            <span className="inline-flex items-center gap-1.5 font-600 text-white/90"><span className="h-1.5 w-1.5 animate-beacon rounded-full bg-anvil" /> Anvil live</span>
            <span className="tabular text-white/55">{CLIENT.now} {CLIENT.tz}</span>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div>
              <div className="font-display text-[18px] font-700 leading-none tabular text-white">{CLIENT.countries}</div>
              <div className="text-[9.5px] text-white/50">export countries YTD</div>
            </div>
            <div className="text-right">
              <div className="font-display text-[18px] font-700 leading-none tabular text-copper-soft">{OPP_STATS.open}</div>
              <div className="text-[9.5px] text-white/50">open opportunities</div>
            </div>
          </div>
        </div>

        <div className="relative border-t border-white/10 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-[11px] font-700 text-white">
              {user?.initials ?? '—'}
            </div>
            <div className="min-w-0 leading-tight">
              <div className="truncate text-[12px] font-550 text-white">{user?.name ?? 'Signed out'}</div>
              <div className="truncate text-[10px] text-white/45">{user?.title ?? ''}</div>
            </div>
            <button
              onClick={signOut}
              title="Sign out"
              className="ml-auto shrink-0 rounded-md p-1.5 text-white/40 transition hover:bg-white/10 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="rounded-full bg-copper/20 px-2 py-0.5 text-[10px] font-600 text-copper-soft">
              {ROLE_LABEL[role]}
            </span>
            <span className="truncate text-[10px] text-white/35">{user?.email}</span>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-surface/80 px-6 backdrop-blur">
          <div className="font-display text-[16px] font-600 leading-none text-ink">
            {current ? current.label : 'Trading Command Center'}
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden rounded-full border border-line bg-canvas px-2 py-0.5 text-[10px] font-550 text-ink-faint lg:inline-flex" title="Sample figures for demonstration; brands, models and export corridors reflect Omnia's real catalogue.">
              Illustrative demo data
            </span>
            <div className="hidden items-center gap-3 rounded-full border border-line bg-canvas px-3 py-1.5 md:flex">
              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-soft">W. Africa demand <span className="font-600 text-copper-deep">▲ +20%</span></span>
              <span className="h-3 w-px bg-line" />
              <span className="inline-flex items-center gap-1.5 text-[11.5px] text-ink-soft">Stock <span className="tabular font-600 text-ink">{num(CLIENT.liveListings)}</span></span>
            </div>
          </div>
        </header>

        <main className="forgewash flex-1 overflow-y-auto px-6 py-5">{children}</main>
      </div>
    </div>
  )
}
