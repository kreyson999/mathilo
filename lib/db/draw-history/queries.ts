import { supabase } from "@/lib/supabase"
import type { DrawHistory, DrawHistoryWithRelations, UserDrawHistory } from "@/lib/db/draw-history/types"

// Function to record a draw in history
export async function recordDraw(userId: string, isSheet: boolean, itemId: number): Promise<DrawHistory | null> {
  const insertData = isSheet
    ? { user_id: userId, is_sheet: true, sheet_id: itemId }
    : { user_id: userId, is_sheet: false, task_id: itemId }

  try {
    const { data, error } = await supabase.from("draw_history").insert([insertData]).select().single()

    if (error) {
      console.error("Error recording draw history:", error)
      return null
    }

    return data
  } catch (error) {
    console.error("Exception recording draw history:", error)
    return null
  }
}

// Function to get a draw history record by ID
export async function getDrawHistoryById(id: number): Promise<DrawHistoryWithRelations | null> {
  const { data, error } = await supabase
    .from("draw_history")
    .select(`
      *,
      tasks(*),
      sheets(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching draw history:", error)
    return null
  }

  return data
}

// Function to get user's draw history
export async function getUserDrawHistory(userId: string, limit = 10): Promise<UserDrawHistory[]> {
  // wykonuje
  const { data, error } = await supabase
    .from("draw_history")
    .select(`
      *,
      tasks(id, content),
      sheets(id, name)
    `)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.error("Error fetching user draw history:", error)
    return []
  }

  return data
}

// Function to update a draw history record
export async function updateDrawHistory(id: number, updates: Partial<DrawHistory>): Promise<DrawHistory | null> {
  const { data, error } = await supabase.from("draw_history").update(updates).eq("id", id).select().single()

  if (error) {
    console.error("Error updating draw history:", error)
    return null
  }

  return data
}

