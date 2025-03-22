"use client"

import { useState, useEffect, use } from "react"
import { useRouter } from "next/navigation"
import Whiteboard from "@/components/whiteboard"
import AiChat from "@/components/ai-chat"
import AnswerSubmission from "@/components/answer-submission"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getTaskStatusById } from "@/lib/db/task-statuses/queries"
import { getTaskById, getTaskDetails } from "@/lib/db/tasks/queries"
import { toast } from "@/components/ui/use-toast"
import { AiMessage, TaskStatusWithRelations, UserAnswer } from "@/lib/db/task-statuses/types"
import { ChoiceOption, FillInTask, OpenTask, Task, TrueFalseTask } from "@/lib/db/tasks/types"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import 'katex/dist/katex.min.css'

export type TaskType = "single_choice" | "multiple_choice" | "true_false" | "fill_in" | "open"

export default function TaskPage(props: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const params = use<{ id: string }>(props.params);
  const [taskStatus, setTaskStatus] = useState<TaskStatusWithRelations | null>(null)
  const [task, setTask] = useState<Task | null>(null)
  const [taskDetails, setTaskDetails] = useState<OpenTask | TrueFalseTask[] | ChoiceOption[] | FillInTask[] | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        // Parse the draw history ID
        const taskStatusId = Number.parseInt(params.id)
        if (isNaN(taskStatusId)) {
          throw new Error("Invalid draw history ID")
        }

        // Fetch the task status record
        const taskStatusRecord = await getTaskStatusById(taskStatusId)
        if (!taskStatusRecord) {
          throw new Error("Task status record not found")
        }
        setTaskStatus(taskStatusRecord)

        // Fetch the task
        const task = await getTaskById(taskStatusRecord.task_id)
        if (!task) {
          throw new Error("Task not found")
        }
        setTask(task)

        // Fetch task details based on task type
        const details = await getTaskDetails(task.id, task.type)
        setTaskDetails(details)
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

  if (!task || !taskStatus) {
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
        return details.map((option: any) => {
          return {
            id: option.id,
            value: option.content,
            isCorrect: option.is_correct,
          }
        })
      case "true_false":
        return details.map((statement: any) => ({
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
    <div className="grow flex flex-col max-h-screen">
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

          <div className="text-lg">
            {/* <div>
              <span className="text-sm text-gray-500">
                {formattedProblem.source}
              </span>
            </div> */}
            
            <ReactMarkdown 
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {formattedProblem.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        <div className="flex-1 h-full lg:h-auto overflow-hidden">
          <Whiteboard taskStatusId={taskStatus.id} savedCanvasData={taskStatus.canvas_data} />
        </div>

        <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l">
          <div className="h-full flex flex-col">
            <div className="flex-1 overflow-hidden">
              <AiChat taskStatusId={taskStatus.id} savedMessages={taskStatus.ai_messages as AiMessage[] | null} problem={formattedProblem} />
            </div>

            <div className="border-t">
              <AnswerSubmission
                taskId={taskStatus.task_id}
                taskStatusId={taskStatus.id}
                question={formattedProblem.content}
                taskType={formattedProblem.taskType as TaskType}
                options={formattedProblem.options}
                onSubmit={handleSubmitAnswer}
                savedAnswer={taskStatus.user_answers as UserAnswer | null}
                getCanvasImage={() => {
                  // Call the export function we exposed on the window
                  if (typeof window !== 'undefined' && window.exportWhiteboardCanvas) {
                    return window.exportWhiteboardCanvas();
                  }
                  return null;
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

