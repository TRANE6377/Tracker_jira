import type { Comment as CommentT } from '@/types/comment'
import { formatDateTime } from '@/utils/formatDate'

export function Comment({
  comment,
  isMine,
  onDelete,
}: {
  comment: CommentT
  isMine: boolean
  onDelete: (id: string) => void
}) {
  const author = comment.author_name || comment.author_email || comment.author_id
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-2 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-xs text-slate-400">
            <span className="text-slate-300">{author}</span> · {formatDateTime(comment.created_at)}
          </div>
          <div className="mt-1 whitespace-pre-wrap text-sm text-slate-100">{comment.body}</div>
        </div>
        {isMine ? (
          <button
            className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200 transition hover:bg-white/10 active:scale-[0.99]"
            onClick={() => onDelete(comment.id)}
            title="Удалить"
          >
            <span className="inline-flex items-center gap-1">
              <TrashIcon className="h-3.5 w-3.5" />
              Удалить
            </span>
          </button>
        ) : null}
      </div>
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

