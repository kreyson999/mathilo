"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Whiteboard from "@/components/whiteboard"
import AiChat from "@/components/ai-chat"
import AnswerSubmission from "@/components/answer-submission"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getDrawHistoryById } from "@/lib/db/draw-history/queries"
import { getTaskById, getTaskDetails } from "@/lib/db/tasks/queries"
import { toast } from "@/components/ui/use-toast"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { DrawHistoryWithRelations } from "@/lib/db/draw-history/types"
import { ChoiceOption, FillInTask, OpenTask, Task, TrueFalseTask } from "@/lib/db/tasks/types"

export type TaskType = "single_choice" | "multiple_choice" | "true_false" | "fill_in" | "open"

export default function TaskPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const params = use<{ id: string }>(props.params);
  const [drawHistory, setDrawHistory] = useState<DrawHistoryWithRelations | null>(null)
  const [task, setTask] = useState<Task | null>(null)
  const [taskDetails, setTaskDetails] = useState<OpenTask | TrueFalseTask[] | ChoiceOption[] | FillInTask[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Parse the draw history ID
        const drawHistoryId = Number.parseInt(params.id)
        if (isNaN(drawHistoryId)) {
          throw new Error("Invalid draw history ID")
        }

        // Fetch the draw history record
        const drawHistoryRecord = await getDrawHistoryById(drawHistoryId)
        if (!drawHistoryRecord) {
          throw new Error("Draw history record not found")
        }
        setDrawHistory(drawHistoryRecord)

        // If it's a task draw, fetch the task
        if (!drawHistoryRecord.is_sheet && drawHistoryRecord.task_id) {
          const task = await getTaskById(drawHistoryRecord.task_id)
          if (!task) {
            throw new Error("Task not found")
          }
          setTask(task)

          // Fetch task details based on task type
          const details = await getTaskDetails(task.id, task.type)
          setTaskDetails(details)
        } else {
          throw new Error("Sheet draws are not supported on this page")
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Błąd",
          description: "Nie udało się załadować zadania. Spróbuj ponownie.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  const handleSubmitAnswer = async () => {
    // Implementation for submitting answers would go here
    toast({
      title: "Odpowiedź zapisana",
      description: "Twoja odpowiedź została zapisana.",
    })
  }

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-64 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 w-48 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!task || !drawHistory) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Nie znaleziono zadania</h2>
          <p className="text-gray-500 mb-4">Zadanie o podanym ID nie istnieje.</p>
          <Button onClick={() => router.push("/")}>Wróć do strony głównej</Button>
        </div>
      </div>
    )
  }

  const formattedProblem = {
    id: task.id.toString(),
    content: task.content,
    taskType: task.type,
    options: taskDetails ? formatTaskDetails(task.type, taskDetails) : undefined,
  }

  // Add this function to format task details based on task type
  function formatTaskDetails(type: string, details: any) {
    switch (type) {
      case "single_choice":
      case "multiple_choice":
        return details.map((option: any, index: number) => {
          const letter = String.fromCharCode(65 + index) // A, B, C, D...
          return {
            id: option.id,
            label: `${letter}. ${option.content}`,
            value: letter,
            isCorrect: option.is_correct,
          }
        })
      case "true_false":
        return details.map((statement: any, index: number) => ({
          id: statement.id,
          statement: statement.statement,
          isTrue: statement.is_true,
          order: statement.statement_order,
        }))
      case "fill_in":
        return details.map((item: any) => ({
          id: item.id,
          template: item.template,
          correctAnswer: item.correct_answer,
          order: item.answer_order,
        }))
      case "open":
        return details
          ? {
              solution: details.solution,
              solutionSteps: details.solution_points_steps,
            }
          : undefined
      default:
        return undefined
    }
  }

  return (
    <div className="grow flex flex-col">
      <div className="p-4 border-b bg-white flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 gap-1 mr-4"
            onClick={() => router.push("/")}
          >
            <ArrowLeft />
          </Button>

          <div>
            {/* <div>
              <span className="text-sm text-gray-500">
                {formattedProblem.source}
              </span>
            </div> */}
            <p className="text-lg">{formattedProblem.content}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 h-full lg:h-auto overflow-hidden">
          <Whiteboard />
        </div>

        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <AiChat problem={formattedProblem} />
            </div>

            <div className="border-t">
              <AnswerSubmission
                taskType={formattedProblem.taskType as TaskType}
                options={formattedProblem.options}
                onSubmit={handleSubmitAnswer}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

