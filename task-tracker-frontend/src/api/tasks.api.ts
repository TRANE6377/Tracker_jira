import { api } from './axios'
import type { ListTasksResponse, TaskResponse } from '@/types/api'
import type { TaskStatus } from '@/types/task'

export async function listTasks(params?: { status?: TaskStatus; q?: string; limit?: number; offset?: number }) {
  const { data } = await api.get<ListTasksResponse>('/tasks', { params })
  return data
}

export async function createTask(input: {
  title: string
  description?: string
  status?: TaskStatus
  priority?: number
  dueDate?: string
}) {
  const { data } = await api.post<TaskResponse>('/tasks', input)
  return data
}

export async function updateTask(
  taskId: string,
  patch: Partial<{ title: string; description: string | null; status: TaskStatus; priority: number; dueDate: string | null }>,
) {
  const { data } = await api.patch<TaskResponse>(`/tasks/${taskId}`, patch)
  return data
}

export async function deleteTask(taskId: string) {
  const { data } = await api.delete<{ id: string }>(`/tasks/${taskId}`)
  return data
}

