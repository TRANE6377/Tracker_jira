import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export function LoginPage() {
  const nav = useNavigate()
  const loc = useLocation()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const redirectTo = useMemo(() => (loc.state as any)?.from ?? ROUTES.tasks, [loc.state])

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Вход</h1>
        <p className="mt-2 text-sm text-slate-400">Войдите, чтобы увидеть свои задачи и комментарии.</p>
      </div>

      <form
        className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur"
        onSubmit={async (e) => {
          e.preventDefault()
          setError(null)
          setLoading(true)
          try {
            await login({ email: email.trim(), password })
            nav(redirectTo, { replace: true })
          } catch (e: any) {
            setError(e?.response?.data?.error?.message ?? e?.message ?? 'Не удалось войти')
          } finally {
            setLoading(false)
          }
        }}
      >
        <label className="block">
          <div className="text-sm text-slate-300">Почта</div>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none placeholder:text-slate-500 transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>

        <label className="block">
          <div className="text-sm text-slate-300">Пароль</div>
          <input
            className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none placeholder:text-slate-500 transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            type="password"
            autoComplete="current-password"
          />
        </label>

        {error ? (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <button
          disabled={loading}
          className="w-full rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-200 active:scale-[0.99] disabled:opacity-60"
        >
          {loading ? 'Входим…' : 'Войти'}
        </button>

        <div className="text-sm text-slate-400">
          Нет аккаунта?{' '}
          <Link className="text-slate-200 underline decoration-slate-700 hover:decoration-slate-400" to={ROUTES.register}>
            Зарегистрироваться
          </Link>
        </div>
      </form>
    </div>
  )
}

