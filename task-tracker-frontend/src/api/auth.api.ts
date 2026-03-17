import { api } from './axios'
import type { LoginResponse, MeResponse, RegisterResponse } from '@/types/api'

export async function register(input: { email: string; password: string; name?: string }) {
  const { data } = await api.post<RegisterResponse>('/auth/register', input)
  return data
}

export async function login(input: { email: string; password: string }) {
  const { data } = await api.post<LoginResponse>('/auth/login', input)
  return data
}

export async function me() {
  const { data } = await api.get<MeResponse>('/auth/me')
  return data
}

