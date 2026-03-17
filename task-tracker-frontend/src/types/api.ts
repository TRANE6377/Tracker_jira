import type { User } from './user'
import type { Task } from './task'
import type { Comment } from './comment'

export type RegisterResponse = {
  user: User
  accessToken: string
}

export type LoginResponse = {
  user: User
  accessToken: string
}

export type MeResponse = {
  user: User
}

export type ListTasksResponse = {
  tasks: Task[]
}

export type TaskResponse = {
  task: Task
}

export type ListCommentsResponse = {
  comments: Comment[]
}

export type CommentResponse = {
  comment: Comment
}

