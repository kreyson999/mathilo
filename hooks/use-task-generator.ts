"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { getRandomTasks } from "@/lib/db/tasks/queries"
import { recordTaskStatus } from "@/lib/db/task-statuses/queries"
import { toast } from "@/components/ui/use-toast"
import type { TaskType } from "@/lib/db/tasks/types"

type TaskGeneratorOptions = {
  onLoginRequired?: () => void
}

export function useTaskGenerator(options?: TaskGeneratorOptions) {
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  const { user } = useAuth()
  const { onLoginRequired } = options || {}

  const generateTask = async (taskType?: TaskType[], categoryId?: number, sheetId?: number) => {
    if (!user) {
      toast({
        title: "Wymagane logowanie",
        description: "Musisz być zalogowany, aby losować zadania.",
        variant: "destructive",
      })

      if (onLoginRequired) {
        onLoginRequired()
      } else {
        router.push("/zaloguj")
      }
      return null
    }

    setIsGenerating(true)
    try {
      // Get a random task based on filters
      const randomTasks = await getRandomTasks(taskType, categoryId, sheetId)

      if (randomTasks.length === 0) {
        toast({
          title: "Brak zadań",
          description: "Nie znaleziono zadań spełniających wybrane kryteria.",
          variant: "destructive",
        })
        setIsGenerating(false)
        return null
      }

      const randomTask = randomTasks[0]

      // Record the task status and wait for it to complete
      const drawRecord = await recordTaskStatus(user.id, randomTask.id)

      if (!drawRecord) {
        throw new Error("Nie udało się zapisać historii losowania")
      }

      // Return the draw record so the component can decide what to do with it
      return drawRecord
    } catch (error) {
      console.error("Error generating task:", error)
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas losowania zadania. Spróbuj ponownie.",
        variant: "destructive",
      })
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  return {
    generateTask,
    isGenerating,
  }
}

