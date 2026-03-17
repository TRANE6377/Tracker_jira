export type Comment = {
  id: string
  task_id: string
  author_id: string
  body: string
  created_at: string
  author_email?: string
  author_name?: string | null
}

