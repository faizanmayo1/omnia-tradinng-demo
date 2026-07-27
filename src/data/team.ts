// Team, roles and audit — Omnia runs a small desk (10-12 people across the UK
// and US offices) feeding what is currently a central spreadsheet. Anvil
// replaces that with named accounts, scoped permissions and an append-only
// record of who changed what.

export type Role = 'admin' | 'trading' | 'logistics' | 'procurement' | 'viewer' | 'pending'

// Note: every role can *see* /access. The audit trail is a transparency
// surface — staff seeing who changed what is the point of replacing a shared
// spreadsheet. What is gated is acting on it: "Manage users & roles" below is
// admin-only. Keeping the screen reachable also means switching role from it
// leaves you on it, so the new audit entry is visible the moment it lands.
export const ROLES: { id: Role; label: string; blurb: string; routes: string[] }[] = [
  {
    id: 'admin',
    label: 'Administrator',
    blurb: 'Full platform access, user management and audit',
    routes: ['/', '/opportunities', '/inventory', '/demand', '/logistics', '/procurement', '/inbox', '/copilot', '/access'],
  },
  {
    id: 'trading',
    label: 'Trading desk',
    blurb: 'Deals, stock, buyer demand and the inquiry desk',
    routes: ['/', '/opportunities', '/inventory', '/demand', '/inbox', '/copilot', '/access'],
  },
  {
    id: 'logistics',
    label: 'Logistics',
    blurb: 'Shipments and stock movement — no pricing or sourcing',
    routes: ['/', '/inventory', '/logistics', '/inbox', '/copilot', '/access'],
  },
  {
    id: 'procurement',
    label: 'Procurement',
    blurb: 'Sourcing, auction lots and supplier performance',
    routes: ['/', '/inventory', '/demand', '/procurement', '/copilot', '/access'],
  },
  {
    id: 'viewer',
    label: 'Read only',
    blurb: 'Sees stock and demand, changes nothing',
    routes: ['/', '/inventory', '/demand', '/access'],
  },
  {
    id: 'pending',
    label: 'Pending access',
    blurb: 'Account created — waiting on an administrator to grant a role',
    routes: ['/access'],
  },
]

/** Where a role lands when it has no access to the screen it is on. */
export function landingFor(role: Role) {
  return ROLES.find((r) => r.id === role)?.routes[0] ?? '/'
}

export const ROLE_LABEL: Record<Role, string> = Object.fromEntries(
  ROLES.map((r) => [r.id, r.label]),
) as Record<Role, string>

export function canAccess(role: Role, path: string) {
  const r = ROLES.find((x) => x.id === role)
  if (!r) return true
  return r.routes.includes(path)
}

export type Member = {
  id: string
  name: string
  initials: string
  role: Role
  title: string
  office: 'Billingham (UK)' | 'Miami (US)'
  lastActive: string
  email: string
}

// Demo credentials. Every seeded account shares one password, shown openly on
// the sign-in screen — this is a sales demo with no backend, nothing is
// authenticated against anything and no credential leaves the browser.
export const DEMO_PASSWORD = 'omnia2026'

/** Invite codes an administrator would issue to a new joiner. */
export const INVITE_CODES = ['OMNIA-2026', 'OMNIA-DESK']

export const TEAM: Member[] = [
  { id: 'U-01', name: 'Sam Brown', initials: 'SB', role: 'admin', title: 'Owner & Director', office: 'Billingham (UK)', lastActive: '12 min ago', email: 's.brown@omniamachinery.com' },
  { id: 'U-02', name: 'H. Osei', initials: 'HO', role: 'trading', title: 'Trading Desk Lead', office: 'Billingham (UK)', lastActive: 'Active now', email: 'h.osei@omniamachinery.com' },
  { id: 'U-03', name: 'Marta Kowalska', initials: 'MK', role: 'trading', title: 'Senior Trader', office: 'Billingham (UK)', lastActive: '34 min ago', email: 'm.kowalska@omniamachinery.com' },
  { id: 'U-04', name: 'Daniel Reyes', initials: 'DR', role: 'trading', title: 'Trader — Americas', office: 'Miami (US)', lastActive: '1h ago', email: 'd.reyes@omniamachinery.com' },
  { id: 'U-05', name: 'Priya Shah', initials: 'PS', role: 'logistics', title: 'Shipping Coordinator', office: 'Billingham (UK)', lastActive: '8 min ago', email: 'p.shah@omniamachinery.com' },
  { id: 'U-06', name: 'Tomasz Nowak', initials: 'TN', role: 'logistics', title: 'Yard & Transport', office: 'Billingham (UK)', lastActive: '2h ago', email: 't.nowak@omniamachinery.com' },
  { id: 'U-07', name: 'Elena Rossi', initials: 'ER', role: 'procurement', title: 'Head of Procurement', office: 'Billingham (UK)', lastActive: '25 min ago', email: 'e.rossi@omniamachinery.com' },
  { id: 'U-08', name: 'Femi Adebayo', initials: 'FA', role: 'procurement', title: 'Sourcing Analyst', office: 'Billingham (UK)', lastActive: '3h ago', email: 'f.adebayo@omniamachinery.com' },
  { id: 'U-09', name: 'Claire Dunn', initials: 'CD', role: 'admin', title: 'Operations Manager', office: 'Billingham (UK)', lastActive: '48 min ago', email: 'c.dunn@omniamachinery.com' },
  { id: 'U-10', name: 'Jorge Medina', initials: 'JM', role: 'logistics', title: 'Logistics — Americas', office: 'Miami (US)', lastActive: '5h ago', email: 'j.medina@omniamachinery.com' },
  { id: 'U-11', name: 'Anna Whitfield', initials: 'AW', role: 'viewer', title: 'Finance', office: 'Billingham (UK)', lastActive: 'Yesterday', email: 'a.whitfield@omniamachinery.com' },
]

/** The accounts offered as one-click sign-in on the auth screen. */
export const QUICK_SIGN_IN = ['U-01', 'U-02', 'U-05', 'U-07', 'U-11']

// Capability matrix — what each role may actually do, not just see.
export const CAPABILITIES: { label: string; allow: Role[] }[] = [
  { label: 'View inventory & demand', allow: ['admin', 'trading', 'logistics', 'procurement', 'viewer'] },
  { label: 'Reserve a unit', allow: ['admin', 'trading'] },
  { label: 'Send quotes & machine packs', allow: ['admin', 'trading'] },
  { label: 'Approve non-standard terms', allow: ['admin'] },
  { label: 'Book & amend shipments', allow: ['admin', 'logistics'] },
  { label: 'Bid on auction lots', allow: ['admin', 'procurement'] },
  { label: 'Edit acquisition cost', allow: ['admin', 'procurement'] },
  { label: 'Manage users & roles', allow: ['admin'] },
  { label: 'Export data', allow: ['admin', 'trading', 'procurement'] },
]

export type AuditEntry = {
  id: string
  actor: string
  role: Role
  action: string
  entity?: string
  at: string
}

// Seed history — the platform's record before this session started.
export const AUDIT_SEED: AuditEntry[] = [
  { id: 'A-9412', actor: 'H. Osei', role: 'trading', action: 'Reserved unit against buyer inquiry', entity: 'OM-4471 · INQ-2207', at: '14:22' },
  { id: 'A-9411', actor: 'Anvil', role: 'trading', action: 'Auto-replied to inbound inquiry', entity: 'THR-5512', at: '14:19' },
  { id: 'A-9410', actor: 'Priya Shah', role: 'logistics', action: 'Confirmed RoRo booking', entity: 'SH-8841', at: '13:57' },
  { id: 'A-9409', actor: 'Anvil', role: 'trading', action: 'Escalated inquiry — payment terms outside policy', entity: 'THR-5496', at: '13:40' },
  { id: 'A-9408', actor: 'Elena Rossi', role: 'procurement', action: 'Placed bid on auction lot', entity: 'LOT-771', at: '12:15' },
  { id: 'A-9407', actor: 'Marta Kowalska', role: 'trading', action: 'Issued quote', entity: 'OMN-Q-4210 · OM-4210', at: '11:48' },
  { id: 'A-9406', actor: 'Sam Brown', role: 'admin', action: 'Approved staged payment terms', entity: 'INQ-2203', at: '11:20' },
  { id: 'A-9405', actor: 'Tomasz Nowak', role: 'logistics', action: 'Updated yard location', entity: 'OM-4351 → Southampton', at: '10:34' },
  { id: 'A-9404', actor: 'Anvil', role: 'trading', action: 'Filtered non-buying message', entity: 'THR-5452', at: '09:52' },
  { id: 'A-9403', actor: 'Claire Dunn', role: 'admin', action: 'Changed role for user', entity: 'U-11 · Anna Whitfield → Read only', at: '09:15' },
]
