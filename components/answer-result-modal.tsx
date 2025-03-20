"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import type { TaskType } from "@/database.types"
import { useTaskGenerator } from "@/hooks/use-task-generator"
import { useRouter } from "next/navigation"

interface AnswerResultModalProps {
  isOpen: boolean
  onClose: () => void
  onReset: () => void
  correct: boolean | null
  taskType: TaskType
  options?: any[]
  answer: any
  points?: number | null
  reasoning?: string | null
}

export default function AnswerResultModal({
  isOpen,
  onClose,
  onReset,
  correct,
  taskType,
  options,
  answer,
  points,
  reasoning
}: AnswerResultModalProps) {
  const { generateTask, isGenerating } = useTaskGenerator()
  const router = useRouter()

  const handleGenerateNewTask = async () => {
    const drawRecord = await generateTask()
    if (drawRecord) {
        router.push(`/zadanie/${drawRecord.id}`)
    }
  }

  const renderAnswerDisplay = () => {
    let answerDisplay

    switch (taskType) {
      case "open":
        // No answer display needed for open tasks
        break
      case "fill_in":
        answerDisplay = (
          <div className="space-y-1">
            {options?.map((option, index) => (
              <div key={option.id}>
                Pole {index + 1}: <span className="font-medium">{answer[option.id]}</span>
              </div>
            ))}
          </div>
        )
        break
      case "single_choice":
        answerDisplay = <span className="font-medium">{answer}</span>
        break
      case "multiple_choice":
        answerDisplay = <span className="font-medium">{answer.join(", ")}</span>
        break
      case "true_false":
        answerDisplay = (
          <div className="space-y-1">
            {options
              ?.sort((a, b) => a.order - b.order)
              .map((option) => (
                <div key={option.id}>
                  {option.statement}:{" "}
                  <span className="font-medium">{answer[option.id] ? "Prawda" : "Fałsz"}</span>
                </div>
              ))}
          </div>
        )
        break
      default:
        answerDisplay = <span>Nieznana odpowiedź</span>
    }

    return answerDisplay
  }

  const renderCorrectAnswer = () => {
    // This would come from the database in a real app
    switch (taskType) {
      case "open":
        return null
      case "fill_in":
        return (
          <div className="space-y-1">
            {options?.map((option, index) => (
              <div key={option.id}>
                Pole {index + 1}: <span className="font-medium">{option.correctAnswer}</span>
              </div>
            ))}
          </div>
        )
      case "single_choice":
        const correctOption = options?.find((option) => option.isCorrect)
        return <span className="font-medium">{correctOption?.value || "B"}</span>
      case "multiple_choice":
        const correctOptions = options?.filter((option) => option.isCorrect).map((option) => option.value)
        return <span className="font-medium">{correctOptions?.join(", ") || "A, C"}</span>
      case "true_false":
        return (
          <div className="space-y-1">
            {options
              ?.sort((a, b) => a.order - b.order)
              .map((option) => (
                <div key={option.id}>
                  {option.statement}: <span className="font-medium">{option.isTrue ? "Prawda" : "Fałsz"}</span>
                </div>
              ))}
          </div>
        )
      default:
        return <span>Nieznana odpowiedź</span>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {correct ? "Poprawna odpowiedź!" : "Niepoprawna odpowiedź"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div
            className={`p-3 rounded-lg ${correct ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
          >
            <div className="flex items-start gap-2">
              {correct ? (
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <p className={`font-medium ${correct ? "text-green-800" : "text-red-800"}`}>
                  {correct ? "Poprawna odpowiedź!" : "Niepoprawna odpowiedź"}
                </p>
                
                {taskType === "open" && points !== null && (
                  <p className="text-sm mt-1">Zdobyte punkty: <span className="font-medium">{points}</span></p>
                )}
                
                {taskType !== "open" && (
                  <div className="text-sm mt-1">Twoja odpowiedź: {renderAnswerDisplay()}</div>
                )}
                
                {taskType === "open" && reasoning && (
                  <div className="text-sm mt-2 p-2 bg-gray-50 rounded border border-gray-200">
                    <p className="font-medium mb-1">Uzasadnienie:</p>
                    <p>{reasoning}</p>
                  </div>
                )}
                
                {!correct && taskType !== "open" && (
                  <div className="text-sm mt-2">
                    <p>Prawidłowa odpowiedź:</p>
                    {renderCorrectAnswer()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onReset}>
            Spróbuj ponownie
          </Button>
          <Button onClick={handleGenerateNewTask} disabled={isGenerating}>
            {isGenerating ? "Generowanie..." : "Wygeneruj nowe zadanie"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}