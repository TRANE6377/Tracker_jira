import { useMemo, useState } from 'react'
import { TaskCard } from '@/components/TaskCard/TaskCard'
import { useTasks } from '@/hooks/useTasks'
import type { TaskStatus } from '@/types/task'

export function TasksPage() {
  const { tasks, loading, error, create, update, remove } = useTasks()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [creating, setCreating] = useState(false)

  const stats = useMemo(() => {
    const s: Record<TaskStatus, number> = { todo: 0, in_progress: 0, done: 0 }
    for (const t of tasks) s[t.status] += 1
    return s
  }, [tasks])

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold">Задачи</h1>
          <div className="mt-1 text-sm text-slate-400">
            Сделать {stats.todo} · В процессе {stats.in_progress} · Готово {stats.done}
          </div>
        </div>
      </div>

      <form
        className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_-30px_rgba(0,0,0,0.9)] backdrop-blur"
        onSubmit={async (e) => {
          e.preventDefault()
          const t = title.trim()
          if (!t) return
          setCreating(true)
          try {
            await create({ title: t, description: description.trim() ? description.trim() : undefined })
            setTitle('')
            setDescription('')
          } finally {
            setCreating(false)
          }
        }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-medium text-slate-100">Новая задача</div>
            <div className="mt-1 text-xs text-slate-400">Быстро добавьте задачу и при необходимости оставьте описание.</div>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="block sm:col-span-1">
            <div className="text-sm text-slate-300">Название</div>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none placeholder:text-slate-500 transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Например: Добавить комментарии"
            />
          </label>
          <label className="block sm:col-span-2">
            <div className="text-sm text-slate-300">Описание (необязательно)</div>
            <input
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm outline-none placeholder:text-slate-500 transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Короткая заметка…"
            />
          </label>
        </div>
        <div className="mt-3 flex justify-end">
          <button
            disabled={creating}
            className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-200 active:scale-[0.99] disabled:opacity-60"
          >
            {creating ? 'Создаём…' : 'Создать задачу'}
          </button>
        </div>
      </form>

      {loading ? <div className="text-sm text-slate-300">Загружаем задачи…</div> : null}
      {error ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4">
        {tasks.length === 0 && !loading ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-300 shadow-lg">
            Пока нет задач. Создайте первую — форма выше.
          </div>
        ) : null}
        {tasks.map((t) => (
          <TaskCard
            key={t.id}
            task={t}
            onDelete={async (id) => remove(id)}
            onPatch={async (id, patch) => update(id, patch)}
          />
        ))}
      </div>
    </div>
  )
}

