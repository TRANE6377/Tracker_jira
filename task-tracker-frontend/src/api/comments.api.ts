import { api } from './axios'
import type { CommentResponse, ListCommentsResponse } from '@/types/api'

export async function listComments(taskId: string) {
  const { data } = await api.get<ListCommentsResponse>(`/tasks/${taskId}/comments`)
  return data
}

export async function addComment(taskId: string, input: { body: string }) {
  const { data } = await api.post<CommentResponse>(`/tasks/${taskId}/comments`, input)
  return data
}

export async function deleteComment(taskId: string, commentId: string) {
  const { data } = await api.delete<{ id: string }>(`/tasks/${taskId}/comments/${commentId}`)
  return data
}

