import { useState } from 'react'
import { ArrowRight, AlertCircle, KeyRound, Mail, User, Lock, Ticket } from 'lucide-react'
import { AnvilMark, Badge, cn } from '../components/ui'
import { useAuth } from '../components/AuthContext'
import { CLIENT } from '../data/omnia'
import { DEMO_PASSWORD, INVITE_CODES, QUICK_SIGN_IN, ROLE_LABEL, TEAM } from '../data/team'

type Mode = 'signin' | 'signup'

export function AuthScreen() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<Mode>('signin')
  const [error, setError] = useState<string | null>(null)

  // sign in
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // sign up
  const [name, setName] = useState('')
  const [suEmail, setSuEmail] = useState('')
  const [suPassword, setSuPassword] = useState('')
  const [invite, setInvite] = useState('')

  const quick = QUICK_SIGN_IN.map((id) => TEAM.find((m) => m.id === id)!).filter(Boolean)

  function submitSignIn(e: React.FormEvent) {
    e.preventDefault()
    const r = signIn(email, password)
    if (!r.ok) setError(r.error)
  }

  function submitSignUp(e: React.FormEvent) {
    e.preventDefault()
    const r = signUp({ name, email: suEmail, password: suPassword, invite })
    if (!r.ok) setError(r.error)
  }

  function quickSignIn(memberEmail: string) {
    setError(null)
    const r = signIn(memberEmail, DEMO_PASSWORD)
    if (!r.ok) setError(r.error)
  }

  function switchMode(m: Mode) {
    setMode(m)
    setError(null)
  }

  return (
    <div className="flex min-h-screen w-full bg-canvas text-ink">
      {/* Brand rail */}
      <aside className="relative hidden w-[46%] max-w-[560px] shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-b from-[#242830] to-[#12151A] p-10 text-white lg:flex">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(520px_260px_at_20%_-5%,rgba(180,98,46,0.28),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(420px_240px_at_90%_110%,rgba(14,140,140,0.20),transparent_70%)]" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.07] ring-1 ring-white/10">
            <AnvilMark size={26} tone="copper" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-[17px] font-700 tracking-tight text-white">{CLIENT.legal}</div>
            <div className="text-[11px] text-white/45">{CLIENT.productFull}</div>
          </div>
        </div>

        <div className="relative">
          <h1 className="font-display text-[30px] font-700 leading-[1.15] tracking-tight text-white">
            One platform for the whole trading operation.
          </h1>
          <p className="mt-3 max-w-[420px] text-[13.5px] leading-relaxed text-white/60">
            Procurement, stock, buyer inquiries, logistics and margin — in one place, with named accounts and a full audit
            trail instead of a shared spreadsheet.
          </p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            <Figure value={CLIENT.brokeredMtd.toString()} label="brokered this month" />
            <Figure value={CLIENT.countries.toString()} label="export countries" />
            <Figure value={CLIENT.staff.toString()} label="on the desk" />
          </div>
        </div>

        <div className="relative text-[11px] text-white/35">
          Illustrative demo environment · no live data, no real credentials
        </div>
      </aside>

      {/* Form */}
      <main className="flex flex-1 items-center justify-center px-5 py-10">
        <div className="w-full max-w-[420px]">
          <div className="mb-6 flex items-center gap-2.5 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink">
              <AnvilMark size={24} tone="copper" />
            </div>
            <div className="leading-tight">
              <div className="font-display text-[15px] font-700 text-ink">{CLIENT.legal}</div>
              <div className="text-[11px] text-ink-faint">{CLIENT.productFull}</div>
            </div>
          </div>

          <h2 className="font-display text-[24px] font-700 tracking-tight text-ink">
            {mode === 'signin' ? 'Sign in to the trading desk' : 'Create your account'}
          </h2>
          <p className="mt-1 text-[13px] text-ink-soft">
            {mode === 'signin'
              ? 'Use your Omnia work account.'
              : 'New joiners need an invite code from an administrator.'}
          </p>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-lg border border-late/30 bg-late-tint/50 px-3 py-2.5 text-[12.5px] text-late-deep">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'signin' ? (
            <form onSubmit={submitSignIn} className="mt-5 space-y-3">
              <Field
                icon={<Mail className="h-4 w-4" />}
                label="Work email"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="you@omniamachinery.com"
                autoComplete="username"
              />
              <Field
                icon={<Lock className="h-4 w-4" />}
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button type="submit" className="btn-ink flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13.5px] font-600 text-white transition hover:brightness-110">
                Sign in <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={submitSignUp} className="mt-5 space-y-3">
              <Field icon={<User className="h-4 w-4" />} label="Full name" value={name} onChange={setName} placeholder="Jane Fletcher" autoComplete="name" />
              <Field icon={<Mail className="h-4 w-4" />} label="Work email" type="email" value={suEmail} onChange={setSuEmail} placeholder="j.fletcher@omniamachinery.com" autoComplete="username" />
              <Field icon={<Lock className="h-4 w-4" />} label="Password" type="password" value={suPassword} onChange={setSuPassword} placeholder="At least 8 characters" autoComplete="new-password" />
              <Field icon={<Ticket className="h-4 w-4" />} label="Invite code" value={invite} onChange={setInvite} placeholder={INVITE_CODES[0]} />
              <button type="submit" className="btn-ink flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-[13.5px] font-600 text-white transition hover:brightness-110">
                Create account <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-[11.5px] leading-relaxed text-ink-faint">
                Accounts start with no operational access. An administrator assigns your role from Access &amp; Audit — nobody
                picks their own permissions.
              </p>
            </form>
          )}

          {mode === 'signin' && (
            <>
              <div className="my-5 flex items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <span className="text-[10.5px] font-600 uppercase tracking-[0.16em] text-ink-faint">Or continue as</span>
                <span className="h-px flex-1 bg-line" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quick.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => quickSignIn(m.email)}
                    className="lift flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5 text-left transition hover:border-copper/40"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-mist text-[11px] font-700 text-ink-soft">
                      {m.initials}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[12.5px] font-600 text-ink">{m.name}</span>
                      <span className="block truncate text-[10.5px] text-ink-faint">{ROLE_LABEL[m.role]}</span>
                    </span>
                  </button>
                ))}
              </div>
              <div className="mt-3 flex items-start gap-2 rounded-lg border border-anvil/30 bg-anvil-wash px-3 py-2.5">
                <KeyRound className="mt-0.5 h-3.5 w-3.5 shrink-0 text-anvil-deep" />
                <p className="text-[11.5px] leading-relaxed text-ink-soft">
                  Demo environment — every account uses the password{' '}
                  <span className="tabular font-600 text-ink">{DEMO_PASSWORD}</span>. Sign in as different people to see how
                  permissions change what the platform shows.
                </p>
              </div>
            </>
          )}

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-4">
            <span className="text-[12.5px] text-ink-soft">
              {mode === 'signin' ? 'New to the platform?' : 'Already have an account?'}
            </span>
            <button
              onClick={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
              className="text-[12.5px] font-600 text-anvil-deep transition hover:text-anvil"
            >
              {mode === 'signin' ? 'Create an account' : 'Sign in instead'}
            </button>
          </div>

          <div className="mt-5 flex justify-center">
            <Badge tone="neutral">Illustrative demo data</Badge>
          </div>
        </div>
      </main>
    </div>
  )
}

function Field({
  icon,
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
}: {
  icon: React.ReactNode
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
  autoComplete?: string
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[11px] font-600 uppercase tracking-wide text-ink-faint">{label}</span>
      <span className="relative block">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint">{icon}</span>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className={cn(
            'w-full rounded-lg border border-line bg-canvas/60 py-2.5 pl-9 pr-3 text-[13.5px] text-ink outline-none transition',
            'placeholder:text-ink-faint/70 focus:border-anvil/50 focus:bg-surface',
          )}
        />
      </span>
    </label>
  )
}

function Figure({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[22px] font-700 leading-none tabular text-copper-soft">{value}</div>
      <div className="mt-1 text-[10.5px] leading-tight text-white/45">{label}</div>
    </div>
  )
}
