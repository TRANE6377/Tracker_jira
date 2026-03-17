import { useCallback, useEffect, useState } from 'react'
import type { Comment } from '@/types/comment'
import * as commentsApi from '@/api/comments.api'

type State = {
  comments: Comment[]
  loading: boolean
  error: string | null
}

export function useComments(taskId: string, enabled: boolean) {
  const [state, setState] = useState<State>({ comments: [], loading: false, error: null })

  const reload = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }))
    try {
      const { comments } = await commentsApi.listComments(taskId)
      setState({ comments, loading: false, error: null })
    } catch (e: any) {
      setState({ comments: [], loading: false, error: e?.message ?? 'Failed to load comments' })
    }
  }, [taskId])

  useEffect(() => {
    if (!enabled) return
    reload()
  }, [enabled, reload])

  const add = useCallback(
    async (body: string) => {
      const { comment } = await commentsApi.addComment(taskId, { body })
      setState((s) => ({ ...s, comments: [...s.comments, comment] }))
    },
    [taskId],
  )

  const remove = useCallback(
    async (commentId: string) => {
      await commentsApi.deleteComment(taskId, commentId)
      setState((s) => ({ ...s, comments: s.comments.filter((c) => c.id !== commentId) }))
    },
    [taskId],
  )

  return { ...state, reload, add, remove }
}

