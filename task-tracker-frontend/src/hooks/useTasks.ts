import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Task, TaskStatus } from '@/types/task'
import * as tasksApi from '@/api/tasks.api'

type State = {
  tasks: Task[]
  loading: boolean
  error: string | null
}

export function useTasks() {
  const [state, setState] = useState<State>({ tasks: [], loading: true, error: null })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const { tasks } = await tasksApi.listTasks({ limit: 100, offset: 0 })
      setState({ tasks, loading: false, error: null })
    } catch (e: any) {
      setState({ tasks: [], loading: false, error: e?.message ?? 'Failed to load tasks' })
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const create = useCallback(
    async (input: { title: string; description?: string }) => {
      const { task } = await tasksApi.createTask({ title: input.title, description: input.description })
      setState((s) => ({ ...s, tasks: [task, ...s.tasks] }))
    },
    [],
  )

  const update = useCallback(
    async (taskId: string, patch: Partial<{ title: string; description: string | null; status: TaskStatus; priority: number; dueDate: string | null }>) => {
      const { task } = await tasksApi.updateTask(taskId, patch)
      setState((s) => ({ ...s, tasks: s.tasks.map((t) => (t.id === taskId ? task : t)) }))
    },
    [],
  )

  const remove = useCallback(async (taskId: string) => {
    await tasksApi.deleteTask(taskId)
    setState((s) => ({ ...s, tasks: s.tasks.filter((t) => t.id !== taskId) }))
  }, [])

  const byId = useMemo(() => new Map(state.tasks.map((t) => [t.id, t])), [state.tasks])

  return { ...state, reload, create, update, remove, byId }
}

