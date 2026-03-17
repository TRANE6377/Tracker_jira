export type TaskStatus = 'todo' | 'in_progress' | 'done'

export type Task = {
  id: string
  owner_id: string
  title: string
  description: string | null
  status: TaskStatus
  priority: number
  due_date: string | null
  created_at: string
  updated_at: string
}

