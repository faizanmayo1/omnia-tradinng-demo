import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import {
  AUDIT_SEED,
  DEMO_PASSWORD,
  INVITE_CODES,
  ROLE_LABEL,
  TEAM,
  type AuditEntry,
  type Member,
  type Role,
} from '../data/team'

/**
 * Who is signed in, and what they may reach.
 *
 * There is no backend: accounts live in component state for the length of the
 * session and no credential leaves the browser. What this models is the shape
 * Omnia needs — named accounts instead of a shared spreadsheet, a role granted
 * by an administrator rather than self-selected, and an append-only record of
 * who did what.
 */

type AuthResult = { ok: true } | { ok: false; error: string }

type AuthContextValue = {
  user: Member | null
  members: Member[]
  role: Role
  audit: AuditEntry[]
  signIn: (email: string, password: string) => AuthResult
  signUp: (input: { name: string; email: string; password: string; invite: string }) => AuthResult
  signOut: () => void
  grantRole: (memberId: string, role: Role) => void
  log: (action: string, entity?: string) => void
}

const Ctx = createContext<AuthContextValue | null>(null)

function stamp() {
  const d = new Date()
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function initialsOf(name: string) {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? '?'
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase()
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Member | null>(null)
  const [members, setMembers] = useState<Member[]>(TEAM)
  const [audit, setAudit] = useState<AuditEntry[]>(AUDIT_SEED)

  const append = useCallback(
    (actor: string, role: Role, action: string, entity?: string) => {
      setAudit((prev) => [
        { id: `A-${9413 + prev.length - AUDIT_SEED.length}`, actor, role, action, entity, at: stamp() },
        ...prev,
      ])
    },
    [],
  )

  const log = useCallback(
    (action: string, entity?: string) => {
      if (!user) return
      append(user.name, user.role, action, entity)
    },
    [user, append],
  )

  const signIn = useCallback(
    (email: string, password: string): AuthResult => {
      const e = email.trim().toLowerCase()
      if (!e || !password) return { ok: false, error: 'Enter your work email and password.' }
      const found = members.find((m) => m.email.toLowerCase() === e)
      if (!found) return { ok: false, error: 'No account found for that email address.' }
      if (password !== DEMO_PASSWORD) return { ok: false, error: 'That password is not correct.' }
      setUser(found)
      append(found.name, found.role, 'Signed in', found.email)
      return { ok: true }
    },
    [members, append],
  )

  const signUp = useCallback(
    ({ name, email, password, invite }: { name: string; email: string; password: string; invite: string }): AuthResult => {
      const n = name.trim()
      const e = email.trim().toLowerCase()
      if (!n || !e || !password) return { ok: false, error: 'Fill in your name, work email and a password.' }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e)) return { ok: false, error: 'That does not look like a valid email address.' }
      if (password.length < 8) return { ok: false, error: 'Choose a password of at least 8 characters.' }
      if (!INVITE_CODES.includes(invite.trim().toUpperCase())) {
        return { ok: false, error: 'That invite code is not recognised. Ask an administrator for one.' }
      }
      if (members.some((m) => m.email.toLowerCase() === e)) {
        return { ok: false, error: 'An account already exists for that email address.' }
      }

      // New joiners land with no operational access. An administrator grants
      // the role from Access & Audit — that is the whole point of the model.
      const member: Member = {
        id: `U-${String(members.length + 1).padStart(2, '0')}`,
        name: n,
        initials: initialsOf(n),
        role: 'pending',
        title: 'Awaiting role assignment',
        office: 'Billingham (UK)',
        lastActive: 'Active now',
        email: e,
      }
      setMembers((prev) => [...prev, member])
      setUser(member)
      append(n, 'pending', 'Account created — awaiting role assignment', e)
      return { ok: true }
    },
    [members, append],
  )

  const signOut = useCallback(() => {
    if (user) append(user.name, user.role, 'Signed out', user.email)
    setUser(null)
  }, [user, append])

  const grantRole = useCallback(
    (memberId: string, role: Role) => {
      const target = members.find((m) => m.id === memberId)
      if (!target || target.role === role) return

      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role, title: m.role === 'pending' ? 'Role granted' : m.title } : m)),
      )
      // Keep the signed-in session in step if an admin changes their own role.
      setUser((u) => (u && u.id === memberId ? { ...u, role } : u))

      // Logged outside the state updaters: StrictMode double-invokes those in
      // development, which would write the audit entry twice.
      if (user) {
        append(user.name, user.role, 'Changed role for user', `${target.name} · ${ROLE_LABEL[target.role]} → ${ROLE_LABEL[role]}`)
      }
    },
    [members, user, append],
  )

  const value = useMemo(
    () => ({ user, members, role: user?.role ?? 'pending', audit, signIn, signUp, signOut, grantRole, log }),
    [user, members, audit, signIn, signUp, signOut, grantRole, log],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useAuth() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useAuth must be used inside AuthProvider')
  return v
}
