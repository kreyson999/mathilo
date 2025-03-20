"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { TaskType } from "@/database.types"
import AnswerResultModal from "./answer-result-modal"

interface AnswerSubmissionProps {
  taskId: number | null
  taskType: TaskType
  options?: any[]
  onSubmit?: (answer: any) => void
  canvasImage?: string | null
  getCanvasImage?: () => string | null
  question: string
}

export default function AnswerSubmission({ 
  taskId,
  taskType, 
  options, 
  question,
  onSubmit, 
  canvasImage, 
  getCanvasImage 
}: AnswerSubmissionProps) {
  const [fillInAnswers, setFillInAnswers] = useState<Record<string, string>>({})
  const [singleChoiceAnswer, setSingleChoiceAnswer] = useState("")
  const [multipleChoiceAnswers, setMultipleChoiceAnswers] = useState<string[]>([])
  const [trueFalseAnswers, setTrueFalseAnswers] = useState<Record<string, boolean>>({})
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState<boolean | null>(null)
  const [points, setPoints] = useState<number | null>(null)
  const [reasoning, setReasoning] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    // In a real app, this would validate against the correct answer
    // For demo purposes, we'll just simulate a correct answer
    setIsLoading(true)
    
    let answer
    let isCorrect = false

    switch (taskType) {
      case "open":
        const capturedImage = getCanvasImage ? getCanvasImage() : canvasImage;
        answer = { image: capturedImage };
        console.log(answer, options)
        try {
          const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              image: capturedImage,
              question,
              options
            }),
          });
          
          const result = await response.json();
          isCorrect = result.isCorrect;
          setPoints(result.points);
          setReasoning(result.reasoning);
        } catch (error) {
          console.error('Error checking answer:', error);
          isCorrect = false;
        }
        break
      case "fill_in":
        answer = fillInAnswers
        // Check if all fill-in answers are correct
        isCorrect =
          options?.every((option) => fillInAnswers[option.id]?.toLowerCase() === option.correctAnswer.toLowerCase()) ||
          false
        break
      case "single_choice":
        answer = singleChoiceAnswer
        // Check if the selected option is correct
        isCorrect = options?.find((option) => option.value === singleChoiceAnswer)?.isCorrect || false
        break
      case "multiple_choice":
        answer = multipleChoiceAnswers
        // Check if all and only correct options are selected
        const correctOptions = options?.filter((option) => option.isCorrect).map((option) => option.value) || []
        isCorrect =
          correctOptions.length === multipleChoiceAnswers.length &&
          correctOptions.every((option) => multipleChoiceAnswers.includes(option))
        break
      case "true_false":
        answer = trueFalseAnswers
        // Check if all true/false answers are correct
        isCorrect = options?.every((option) => trueFalseAnswers[option.id] === option.isTrue) || false
        break
      default:
        answer = null
        isCorrect = false
    }

    setCorrect(isCorrect)
    setIsLoading(false)
    setSubmitted(true)

    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit(answer)
    }
  }

  const resetAnswer = () => {
    setSubmitted(false)
    setCorrect(null)
    setPoints(null)
    setReasoning(null)
    setSingleChoiceAnswer("")
    setMultipleChoiceAnswers([])
    setFillInAnswers({})
    setTrueFalseAnswers({})
    setIsLoading(false)
  }

  const handleMultipleChoiceChange = (value: string) => {
    setMultipleChoiceAnswers((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value],
    )
  }

  const handleFillInChange = (id: string, value: string) => {
    setFillInAnswers((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleTrueFalseChange = (id: string, value: boolean) => {
    setTrueFalseAnswers((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const isSubmitDisabled = () => {
    switch (taskType) {
      case "open":
        return false
      case "fill_in":
        return options ? !options.every((option) => fillInAnswers[option.id]) : true
      case "single_choice":
        return !singleChoiceAnswer
      case "multiple_choice":
        return multipleChoiceAnswers.length === 0
      case "true_false":
        return options ? !options.every((option) => trueFalseAnswers[option.id] !== undefined) : true
      default:
        return true
    }
  }

  const renderAnswerInput = () => {
    switch (taskType) {
      case "open":
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Twoja odpowiedź powinna być narysowana na tablicy i zostanie sprawdzona przez sztuczną inteligencję.</p>
          </div>
        )
      case "fill_in":
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Uzupełnij brakujące elementy:</p>
            {options?.map((option, index) => (
              <div key={option.id} className="space-y-1">
                <Label htmlFor={`fill-in-${option.id}`}>Pole {index + 1}:</Label>
                <Input
                  id={`fill-in-${option.id}`}
                  value={fillInAnswers[option.id] || ""}
                  onChange={(e) => handleFillInChange(option.id, e.target.value)}
                  placeholder="Wpisz odpowiedź"
                />
              </div>
            ))}
          </div>
        )
      case "single_choice":
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Wybierz prawidłową odpowiedź:</p>
            <RadioGroup value={singleChoiceAnswer} onValueChange={setSingleChoiceAnswer}>
              {options?.map((option) => (
                <div key={option.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )
      case "multiple_choice":
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Wybierz wszystkie prawidłowe odpowiedzi:</p>
            {options?.map((option) => (
              <div key={option.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <Checkbox
                  id={option.value}
                  checked={multipleChoiceAnswers.includes(option.value)}
                  onCheckedChange={() => handleMultipleChoiceChange(option.value)}
                />
                <Label htmlFor={option.value}>{option.label}</Label>
              </div>
            ))}
          </div>
        )
      case "true_false":
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Określ, czy poniższe stwierdzenia są prawdziwe czy fałszywe:</p>
            {options
              ?.sort((a, b) => a.order - b.order)
              .map((option) => (
                <div key={option.id} className="space-y-2 p-2 border rounded">
                  <p className="text-sm font-medium">{option.statement}</p>
                  <RadioGroup
                    value={
                      trueFalseAnswers[option.id] === true
                        ? "true"
                        : trueFalseAnswers[option.id] === false
                          ? "false"
                          : ""
                    }
                    onValueChange={(value) => handleTrueFalseChange(option.id, value === "true")}
                  >
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id={`true-${option.id}`} value="true" />
                        <Label htmlFor={`true-${option.id}`}>Prawda</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem id={`false-${option.id}`} value="false" />
                        <Label htmlFor={`false-${option.id}`}>Fałsz</Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              ))}
          </div>
        )
      default:
        return <p>Nieobsługiwany typ zadania</p>
    }
  }

  // Funkcjonalność renderowania odpowiedzi została przeniesiona do komponentu AnswerResultModal

  // Funkcjonalność renderowania poprawnej odpowiedzi została przeniesiona do komponentu AnswerResultModal

  return (
    <div className="p-4">
      <h3 className="font-medium mb-3">Sprawdź odpowiedź</h3>

      {renderAnswerInput()}

      <Button className="w-full mt-4" onClick={handleSubmit} disabled={isSubmitDisabled() || isLoading}>
        {isLoading ? "Sprawdzanie..." : "Sprawdź odpowiedź"}
      </Button>

      <AnswerResultModal
        isOpen={submitted && !isLoading}
        onClose={() => setSubmitted(false)}
        onReset={resetAnswer}
        correct={correct}
        taskType={taskType}
        options={options}
        answer={taskType === "open" ? { image: canvasImage || getCanvasImage?.() } : 
               taskType === "fill_in" ? fillInAnswers :
               taskType === "single_choice" ? singleChoiceAnswer :
               taskType === "multiple_choice" ? multipleChoiceAnswers :
               trueFalseAnswers}
        points={points}
        reasoning={reasoning}
      />
    </div>
  )
}

