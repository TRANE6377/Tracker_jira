import React from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/constants/routes'

export function AuthGuard() {
  const { token, isReady } = useAuthStore()
  const loc = useLocation()

  if (!isReady) {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200 shadow-lg">
          Проверяем сессию…
        </div>
      </div>
    )
  }

  if (!token) {
    return <Navigate to={ROUTES.login} replace state={{ from: loc.pathname }} />
  }

  return <Outlet />
}

