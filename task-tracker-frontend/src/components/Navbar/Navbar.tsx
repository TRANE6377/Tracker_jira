import { Link, useNavigate } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export function Navbar() {
  const nav = useNavigate()
  const { user, token, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/60 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to={ROUTES.tasks} className="group inline-flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-white/10 ring-1 ring-white/10 transition group-hover:bg-white/15">
              <span className="h-2 w-2 rounded-full bg-sky-300 shadow-[0_0_20px_rgba(125,211,252,0.45)]" />
            </span>
            <span className="text-slate-100">Таск‑трекер</span>
          </Link>
          <nav className="hidden items-center gap-3 text-sm text-slate-300 sm:flex">
            <Link to={ROUTES.tasks} className="rounded-md px-2 py-1 hover:bg-white/5 hover:text-white">
              Задачи
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {token ? (
            <>
              <div className="hidden max-w-[240px] truncate text-sm text-slate-300 sm:block">
                {user?.email ?? '—'}
              </div>
              <button
                className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-100 transition hover:bg-white/10 active:scale-[0.99]"
                onClick={() => {
                  logout()
                  nav(ROUTES.login, { replace: true })
                }}
              >
                <span>Выйти</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-2 text-sm">
              <Link className="rounded-md px-2 py-1 text-slate-300 hover:bg-white/5 hover:text-white" to={ROUTES.login}>
                Вход
              </Link>
              <span className="text-slate-700">/</span>
              <Link className="rounded-md px-2 py-1 text-slate-300 hover:bg-white/5 hover:text-white" to={ROUTES.register}>
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

