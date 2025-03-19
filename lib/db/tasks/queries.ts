import { supabase } from "@/lib/supabase"
import type { TaskType } from "@/database.types"
import type { Category, Task, ChoiceOption, FillInTask, TrueFalseTask, OpenTask } from "./types"

// Function to get all categories
export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from("categories").select("*").order("name")

  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }

  return data
}

// Function to get a task by ID with its specific type details
export async function getTaskById(id: number): Promise<Task | null> {
  const { data, error } = await supabase.from("tasks").select("*, categories(*), sheets(*)").eq("id", id).single()

  if (error) {
    console.error("Error fetching task:", error)
    return null
  }

  return data
}

// Function to get task details based on task type
export async function getTaskDetails(taskId: number, taskType: TaskType) {
  switch (taskType) {
    case "single_choice":
    case "multiple_choice":
      return getChoiceTaskDetails(taskId)
    case "open":
      return getOpenTaskDetails(taskId)
    case "true_false":
      return getTrueFalseTaskDetails(taskId)
    case "fill_in":
      return getFillInTaskDetails(taskId)
    default:
      return null
  }
}

// Function to get choice task details
export async function getChoiceTaskDetails(taskId: number): Promise<ChoiceOption[]> {
  const { data, error } = await supabase.from("choice_options").select("*").eq("task_id", taskId).order("id")

  if (error) {
    console.error("Error fetching choice options:", error)
    return []
  }

  return data
}

// Function to get open task details
export async function getOpenTaskDetails(taskId: number): Promise<OpenTask | null> {
  const { data, error } = await supabase.from("open_tasks").select("*").eq("task_id", taskId).single()

  if (error) {
    console.error("Error fetching open task:", error)
    return null
  }

  return data
}

// Function to get true/false task details
export async function getTrueFalseTaskDetails(taskId: number): Promise<TrueFalseTask[]> {
  const { data, error } = await supabase
    .from("true_false_tasks")
    .select("*")
    .eq("task_id", taskId)
    .order("statement_order")

  if (error) {
    console.error("Error fetching true/false tasks:", error)
    return []
  }

  return data
}

// Function to get fill-in task details
export async function getFillInTaskDetails(taskId: number): Promise<FillInTask[]> {
  const { data, error } = await supabase.from("fill_in_tasks").select("*").eq("task_id", taskId).order("answer_order")

  if (error) {
    console.error("Error fetching fill-in tasks:", error)
    return []
  }

  return data
}

export async function getRandomTasks(
  type?: TaskType[],
  categoryId?: number,
  sheetId?: number,
): Promise<Task[]> {
  const { data, error } = await supabase.rpc('get_random_tasks', {
    p_category_id: categoryId, 
    p_sheet_id: sheetId, 
    p_type: type
  })
  
  if (error) {
    console.error("Error fetching random tasks:", error)
    return []
  }
  
  return data
}

