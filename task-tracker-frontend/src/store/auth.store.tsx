import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { User } from '@/types/user'
import { clearToken, getToken, setToken } from '@/auth/token'
import * as authApi from '@/api/auth.api'

type AuthState = {
  user: User | null
  isReady: boolean
  token: string | null
  login: (input: { email: string; password: string }) => Promise<void>
  register: (input: { email: string; password: string; name?: string }) => Promise<void>
  logout: () => void
  refreshMe: () => Promise<void>
}

const AuthCtx = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [token, setTokenState] = useState<string | null>(() => getToken())

  const refreshMe = useCallback(async () => {
    const t = getToken()
    if (!t) {
      setUser(null)
      return
    }
    try {
      const { user } = await authApi.me()
      setUser(user)
    } catch {
      clearToken()
      setTokenState(null)
      setUser(null)
    }
  }, [])

  useEffect(() => {
    refreshMe().finally(() => setIsReady(true))
  }, [refreshMe])

  const login = useCallback(async (input: { email: string; password: string }) => {
    const res = await authApi.login(input)
    setToken(res.accessToken)
    setTokenState(res.accessToken)
    setUser(res.user)
  }, [])

  const register = useCallback(async (input: { email: string; password: string; name?: string }) => {
    const res = await authApi.register(input)
    setToken(res.accessToken)
    setTokenState(res.accessToken)
    setUser(res.user)
  }, [])

  const logout = useCallback(() => {
    clearToken()
    setTokenState(null)
    setUser(null)
  }, [])

  const value = useMemo<AuthState>(
    () => ({ user, token, isReady, login, register, logout, refreshMe }),
    [user, token, isReady, login, register, logout, refreshMe],
  )

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>
}

export function useAuthStore() {
  const ctx = useContext(AuthCtx)
  if (!ctx) throw new Error('useAuthStore must be used within AuthProvider')
  return ctx
}

