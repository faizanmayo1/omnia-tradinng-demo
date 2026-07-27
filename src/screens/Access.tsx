import { Users, ShieldCheck, KeyRound, ScrollText, Check, Minus, Sparkles, UserPlus, LogOut } from 'lucide-react'
import { Card, SectionTitle, StatTile, Badge, AIBadge, cn } from '../components/ui'
import { useAuth } from '../components/AuthContext'
import { useToast } from '../components/Toast'
import { CLIENT } from '../data/omnia'
import { ROLES, ROLE_LABEL, CAPABILITIES, type Role } from '../data/team'

const roleTone: Record<Role, 'copper' | 'anvil' | 'steel' | 'ok' | 'neutral' | 'risk'> = {
  admin: 'copper',
  trading: 'anvil',
  logistics: 'steel',
  procurement: 'ok',
  viewer: 'neutral',
  pending: 'risk',
}

// Roles an administrator can assign. 'pending' is a state an account arrives
// in, not something you would grant someone.
const ASSIGNABLE = ROLES.filter((r) => r.id !== 'pending')

export function Access() {
  const { user, role, members, audit, grantRole } = useAuth()
  const toast = useToast()
  const isAdmin = role === 'admin'
  const pendingCount = members.filter((m) => m.role === 'pending').length

  return (
    <div className="mx-auto max-w-[1240px] space-y-5">
      <div className="stagger grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatTile label="People on the platform" value={members.length} accent="ink" icon={<Users className="h-4 w-4" />} sub={`${CLIENT.hqCity.split(',')[0]} & ${CLIENT.usOffice}`} />
        <StatTile label="Roles defined" value={ASSIGNABLE.length} accent="copper" icon={<ShieldCheck className="h-4 w-4" />} sub="Scoped to what each job needs" />
        <StatTile label="Gated capabilities" value={CAPABILITIES.length} accent="anvil" icon={<KeyRound className="h-4 w-4" />} sub="Permission checked on every action" />
        <StatTile label="Audit entries today" value={audit.length} accent="steel" icon={<ScrollText className="h-4 w-4" />} sub="Append-only, nothing editable" />
      </div>

      {/* Your own session */}
      {role === 'pending' ? (
        <Card className="border-risk/40 bg-risk-tint/30">
          <div className="flex items-start gap-3">
            <UserPlus className="mt-0.5 h-5 w-5 shrink-0 text-risk-deep" />
            <div>
              <h3 className="font-display text-[17px] font-700 text-ink">Your account is waiting on a role</h3>
              <p className="mt-1 max-w-2xl text-[13px] leading-relaxed text-ink-soft">
                {user?.name}, your account exists but has no operational access yet. An administrator — {CLIENT.principal} or
                the operations manager — assigns your role from this screen. Until then you can see this page and nothing
                else.
              </p>
              <p className="mt-2 text-[12px] text-ink-faint">
                Nobody picks their own permissions. That is the difference between this and a shared spreadsheet.
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <Card>
          <SectionTitle
            eyebrow="Your session"
            title={`Signed in as ${user?.name} · ${ROLE_LABEL[role]}`}
            right={<AIBadge label="live permission check" />}
          />
          <div className="flex flex-wrap items-start gap-x-8 gap-y-3">
            <div className="min-w-[240px] flex-1">
              <p className="text-[12.5px] leading-relaxed text-ink-soft">
                The sidebar only shows what {ROLE_LABEL[role].toLowerCase()} may reach — everything else is locked. To see how
                the platform looks to someone else, sign out and sign back in as them.
              </p>
              <div className="mt-2 inline-flex items-center gap-1.5 text-[12px] text-ink-faint">
                <LogOut className="h-3.5 w-3.5" /> Sign out from the bottom of the sidebar
              </div>
            </div>
            {isAdmin && pendingCount > 0 && (
              <div className="rounded-xl border border-risk/30 bg-risk-tint/40 px-3.5 py-2.5">
                <div className="text-[11px] font-600 uppercase tracking-wide text-risk-deep">Needs your attention</div>
                <div className="mt-0.5 text-[13px] font-600 text-ink">
                  {pendingCount} account{pendingCount > 1 ? 's' : ''} awaiting a role
                </div>
                <div className="text-[11.5px] text-ink-soft">Assign one in the roster below.</div>
              </div>
            )}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.2fr_1fr]">
        {/* Capability matrix */}
        <Card pad={false} className="overflow-hidden">
          <div className="px-5 pt-5">
            <SectionTitle eyebrow="Permissions" title="Who can do what" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left">
              <thead className="border-b border-line bg-surface/95">
                <tr>
                  <th className="px-5 py-2 text-[10px] font-600 uppercase tracking-wide text-ink-faint">Capability</th>
                  {ASSIGNABLE.map((r) => (
                    <th
                      key={r.id}
                      className={cn(
                        'px-2 py-2 text-center text-[10px] font-600 uppercase tracking-wide',
                        r.id === role ? 'text-copper-deep' : 'text-ink-faint',
                      )}
                    >
                      {r.label.split(' ')[0]}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CAPABILITIES.map((c) => (
                  <tr key={c.label} className="border-b border-line/70 transition hover:bg-canvas/60">
                    <td className="px-5 py-2 text-[12.5px] font-600 text-ink">{c.label}</td>
                    {ASSIGNABLE.map((r) => (
                      <td key={r.id} className={cn('px-2 py-2 text-center', r.id === role && 'bg-copper-wash/60')}>
                        {c.allow.includes(r.id) ? (
                          <Check className={cn('mx-auto h-4 w-4', r.id === role ? 'text-copper' : 'text-ok')} />
                        ) : (
                          <Minus className="mx-auto h-4 w-4 text-line" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Audit trail */}
        <Card pad={false} className="overflow-hidden">
          <div className="px-5 pt-5">
            <SectionTitle
              eyebrow="Audit trail"
              title="Every change, attributed"
              right={<span className="text-[11.5px] text-ink-faint">Newest first</span>}
            />
          </div>
          <ol className="max-h-[420px] overflow-y-auto">
            {audit.map((a) => (
              <li key={a.id} className="flex gap-3 border-b border-line/70 px-5 py-2.5 transition hover:bg-canvas/60">
                <div
                  className={cn(
                    'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[9.5px] font-700',
                    a.actor === 'Anvil' ? 'bg-anvil-tint text-anvil-deep' : 'bg-mist text-ink-soft',
                  )}
                >
                  {a.actor === 'Anvil' ? <Sparkles className="h-3 w-3" /> : a.actor.replace(/[^A-Z]/g, '').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[12.5px] font-600 text-ink">{a.actor}</span>
                    <Badge tone={roleTone[a.role]}>{ROLE_LABEL[a.role]}</Badge>
                    <span className="ml-auto shrink-0 text-[11px] tabular text-ink-faint">{a.at}</span>
                  </div>
                  <div className="text-[12px] text-ink-soft">{a.action}</div>
                  {a.entity && <div className="truncate text-[11.5px] tabular text-ink-faint">{a.entity}</div>}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </div>

      {/* Team roster */}
      <Card pad={false} className="overflow-hidden">
        <div className="px-5 pt-5">
          <SectionTitle
            eyebrow="Team"
            title={`${members.length} people, two offices`}
            right={
              <span className="text-[11.5px] text-ink-faint">
                {isAdmin ? 'You can change any role here' : 'Only administrators can change roles'}
              </span>
            }
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left">
            <thead className="border-b border-line bg-surface/95">
              <tr>
                {['Person', 'Role', 'Title', 'Office', 'Last active'].map((h) => (
                  <th key={h} className="px-5 py-2 text-[10px] font-600 uppercase tracking-wide text-ink-faint">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {members.map((m) => (
                <tr
                  key={m.id}
                  className={cn(
                    'border-b border-line/70 transition hover:bg-canvas/60',
                    m.role === 'pending' && 'bg-risk-tint/25',
                    m.id === user?.id && 'bg-copper-wash/40',
                  )}
                >
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-mist text-[10.5px] font-700 text-ink-soft">
                        {m.initials}
                      </span>
                      <div className="leading-tight">
                        <div className="flex items-center gap-1.5 text-[13px] font-600 text-ink">
                          {m.name}
                          {m.id === user?.id && <span className="text-[10px] font-600 text-copper-deep">you</span>}
                        </div>
                        <div className="text-[10.5px] text-ink-faint">{m.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    {isAdmin ? (
                      <select
                        value={m.role}
                        onChange={(e) => {
                          const next = e.target.value as Role
                          grantRole(m.id, next)
                          toast(`${m.name} is now ${ROLE_LABEL[next]}`, 'copper')
                        }}
                        className="cursor-pointer rounded-lg border border-line bg-surface px-2 py-1 text-[12px] font-550 text-ink outline-none transition hover:border-copper/50 focus:border-copper/60"
                      >
                        {m.role === 'pending' && <option value="pending">Pending access</option>}
                        {ASSIGNABLE.map((r) => (
                          <option key={r.id} value={r.id}>{r.label}</option>
                        ))}
                      </select>
                    ) : (
                      <Badge tone={roleTone[m.role]}>{ROLE_LABEL[m.role]}</Badge>
                    )}
                  </td>
                  <td className="px-5 py-2.5 text-[12.5px] text-ink-soft">{m.title}</td>
                  <td className="px-5 py-2.5 text-[12.5px] text-ink-soft">{m.office}</td>
                  <td className="px-5 py-2.5 text-[12px] tabular text-ink-faint">{m.lastActive}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
