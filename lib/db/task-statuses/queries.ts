import { supabase } from "@/lib/supabase"
import type { AiMessage, TaskStatus, TaskStatusWithRelations, UserAnswer, UserTaskStatus } from "@/lib/db/task-statuses/types"

// Function to record a task status
export async function recordTaskStatus(userId: string, taskId: number): Promise<TaskStatus | null> {
  const insertData = { user_id: userId, task_id: taskId }

  try {
    const { data, error } = await supabase.from("task_statuses").insert([insertData]).select().single()

    if (error) {
      console.error("Error recording task status:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Exception recording task status:", error)
    return null
  }
}

// Function to get a task status record by ID
export async function getTaskStatusById(id: number): Promise<TaskStatusWithRelations | null> {
  const { data, error } = await supabase
    .from("task_statuses")
    .select(`
      *,
      tasks(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching task status:", error)
    return null
  }

  return data
}

// Function to get user's task statuses
export async function getUserTaskStatuses(userId: string, limit = 10): Promise<UserTaskStatus[]> {
  const { data, error } = await supabase
    .from("task_statuses")
    .select(`
      *,
      tasks(id, content, max_points)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching user task statuses:", error)
    return []
  }

  return data
}

// Function to update a task status record
export async function updateTaskStatus(id: number, updates: Partial<TaskStatus>): Promise<TaskStatus | null> {
  const { data, error } = await supabase.from("task_statuses").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating task status:", error)
    return null
  }

  return data
}

// Function to save canvas data
export async function saveCanvasData(id: number, canvasData: string): Promise<TaskStatus | null> {
  return updateTaskStatus(id, { canvas_data: canvasData })
}

// Function to save AI messages
export async function saveAiMessages(id: number, messages: AiMessage[]): Promise<TaskStatus | null> {
  return updateTaskStatus(id, { ai_messages: messages })
}

// Function to save user answers and completion status
export async function saveUserAnswer(id: number, userAnswer: UserAnswer): Promise<TaskStatus | null> {
  return updateTaskStatus(id, { 
    user_answers: userAnswer,
    is_completed: true,
    received_points: userAnswer.points || 0
  })
}

// Function to get task status with all tracking data
export async function getTaskStatusWithTracking(id: number): Promise<TaskStatus | null> {
  const { data, error } = await supabase
    .from("task_statuses")
    .select()
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching task status with tracking:", error)
    return null
  }

  return data
}