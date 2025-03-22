import type { Database } from "@/database.types"
import { Task } from "../tasks/types"

// Type definitions for task statuses (formerly draw history)
export type TaskStatus = Database["public"]["Tables"]["task_statuses"]["Row"]

// Define types for the new fields
export type AiMessage = {
  role: 'user' | 'assistant'
  content: string
  timestamp: string
}

export type UserAnswer = {
  taskType: string
  answer: any
  isCorrect: boolean
  points?: number
  reasoning?: string
}

export type UserTaskStatus = TaskStatus & {
  tasks: Pick<Task, 'id' | 'content' | 'max_points'> | null
} 

export type TaskStatusWithRelations = TaskStatus & {
  tasks: Task | null
}