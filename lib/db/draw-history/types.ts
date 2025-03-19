import type { Database } from "@/database.types"
import { Task } from "../tasks/types"
import { Sheet } from "../sheets/types"

// Type definitions for our sheets and draw history
export type DrawHistory = Database["public"]["Tables"]["draw_history"]["Row"]


export type UserDrawHistory = DrawHistory & {
  tasks: Pick<Task, 'id' | 'content'> | null
  sheets: Pick<Sheet, 'name' | 'id'> | null
} 

export type DrawHistoryWithRelations = DrawHistory & {
  tasks: Task | null
  sheets: Sheet | null
} 