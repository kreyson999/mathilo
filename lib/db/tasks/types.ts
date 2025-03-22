import type { Database } from "@/database.types"

export type TaskType = Database["public"]["Enums"]["task_type"]

// Type definitions for our tasks
export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type Task = Database["public"]["Tables"]["tasks"]["Row"]
export type ChoiceOption = Database["public"]["Tables"]["choice_options"]["Row"]
export type FillInTask = Database["public"]["Tables"]["fill_in_tasks"]["Row"]
export type TrueFalseTask = Database["public"]["Tables"]["true_false_tasks"]["Row"]
export type OpenTask = Database["public"]["Tables"]["open_tasks"]["Row"]

