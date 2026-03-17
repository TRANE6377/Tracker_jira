import { useMemo, useState } from 'react'
import type { Task, TaskStatus } from '@/types/task'
import { cn } from '@/utils/cn'
import { formatDateTime } from '@/utils/formatDate'
import { useComments } from '@/hooks/useComments'
import { useAuth } from '@/hooks/useAuth'
import { Comment } from '@/components/Comment/Comment'

const STATUS_LABEL: Record<TaskStatus, string> = {
  todo: 'Сделать',
  in_progress: 'В процессе',
  done: 'Готово',
}

export function TaskCard({
  task,
  onDelete,
  onPatch,
}: {
  task: Task
  onDelete: (taskId: string) => void
  onPatch: (taskId: string, patch: Partial<{ title: string; description: string | null; status: TaskStatus }>) => void
}) {
  const { user } = useAuth()
  const [openComments, setOpenComments] = useState(false)
  const { comments, loading, error, add, remove } = useComments(task.id, openComments)
  const [commentBody, setCommentBody] = useState('')

  const badge = useMemo(() => {
    const base = 'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs border'
    if (task.status === 'done')
      return cn(base, 'border-emerald-500/20 bg-emerald-500/10 text-emerald-100')
    if (task.status === 'in_progress') return cn(base, 'border-sky-500/20 bg-sky-500/10 text-sky-100')
    return cn(base, 'border-white/10 bg-white/5 text-slate-100')
  }, [task.status])

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg transition hover:shadow-xl">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-base font-semibold">{task.title}</h3>
            <span className={badge}>
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  task.status === 'done'
                    ? 'bg-emerald-300'
                    : task.status === 'in_progress'
                      ? 'bg-sky-300'
                      : 'bg-slate-300',
                )}
              />
              {STATUS_LABEL[task.status]}
            </span>
          </div>
          {task.description ? (
            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-200/90">{task.description}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-400">
            <span>Обновлено: {formatDateTime(task.updated_at)}</span>
            {task.due_date ? <span>Дедлайн: {task.due_date}</span> : null}
            <span>Приоритет: {task.priority}</span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end gap-2">
          <select
            value={task.status}
            onChange={(e) => onPatch(task.id, { status: e.target.value as TaskStatus })}
            className="rounded-xl border border-white/10 bg-slate-950/40 px-2.5 py-1.5 text-sm text-slate-100 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
          >
            <option value="todo">Сделать</option>
            <option value="in_progress">В процессе</option>
            <option value="done">Готово</option>
          </select>

          <button
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-slate-100 transition hover:bg-white/10 active:scale-[0.99]"
            onClick={() => onDelete(task.id)}
            title="Удалить задачу"
          >
            <TrashIcon className="h-4 w-4" />
            Удалить
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <button
          className="inline-flex items-center gap-2 text-sm text-slate-300 transition hover:text-white"
          onClick={() => setOpenComments((v) => !v)}
        >
          <MessageIcon className="h-4 w-4" />
          {openComments ? 'Скрыть комментарии' : 'Показать комментарии'}
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-slate-100">
            {comments.length}
          </span>
        </button>
        <div className="text-xs text-slate-400">
          {openComments ? 'Комментарии' : 'Комментарии скрыты'}
        </div>
      </div>

      {openComments ? (
        <div className="mt-4 space-y-3">
          <form
            className="flex gap-2"
            onSubmit={async (e) => {
              e.preventDefault()
              const body = commentBody.trim()
              if (!body) return
              await add(body)
              setCommentBody('')
            }}
          >
            <input
              className="w-full rounded-xl border border-white/10 bg-slate-950/40 px-3 py-2 text-sm text-slate-100 outline-none placeholder:text-slate-500 transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
              placeholder="Напишите комментарий…"
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
            />
            <button className="rounded-xl bg-white px-3 py-2 text-sm font-medium text-slate-900 shadow-sm transition hover:bg-slate-200 active:scale-[0.99]">
              Добавить
            </button>
          </form>

          {loading ? <div className="text-sm text-slate-300">Загружаем комментарии…</div> : null}
          {error ? <div className="text-sm text-rose-200">{error}</div> : null}

          <div className="space-y-2">
            {comments.length === 0 && !loading ? (
              <div className="text-sm text-slate-400">Комментариев пока нет — оставьте первый.</div>
            ) : null}
            {comments.map((c) => (
              <Comment
                key={c.id}
                comment={c}
                isMine={Boolean(user && c.author_id === user.id)}
                onDelete={async (id) => remove(id)}
              />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function TrashIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M9 3h6m-9 4h12m-10 0 1 14h8l1-14M10 11v7m4-7v7"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MessageIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path
        d="M7 18.5c-1.2.5-2.3 1-3.5 1.5.5-1.2 1-2.3 1.5-3.5A8 8 0 1 1 20 12a8 8 0 0 1-13 6.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

