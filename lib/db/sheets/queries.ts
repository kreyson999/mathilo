import { supabase } from "@/lib/supabase"
import type { Sheet } from "./types"

// Function to get all sheets
export async function getSheets(isPractice?: boolean): Promise<Sheet[]> {
  let query = supabase.from("sheets").select("*").order("release_date", { ascending: false })

  if (isPractice !== undefined) {
    query = query.eq("is_practice", isPractice)
  }

  const { data, error } = await query

  if (error) {
    console.error("Error fetching sheets:", error)
    return []
  }

  return data
}

// Function to get a sheet by ID
export async function getSheetById(id: number): Promise<Sheet | null> {
  const { data, error } = await supabase.from("sheets").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching sheet:", error)
    return null
  }

  return data
}

// Function to get tasks for a specific sheet
export async function getTasksBySheetId(sheetId: number) {
  const { data, error } = await supabase.from("tasks").select("*").eq("sheet_id", sheetId).order("id")

  if (error) {
    console.error("Error fetching tasks for sheet:", error)
    return []
  }

  return data
}

