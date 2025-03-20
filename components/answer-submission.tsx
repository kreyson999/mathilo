"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { CheckCircle2, AlertCircle } from "lucide-react"
import type { TaskType } from "@/database.types"

interface AnswerSubmissionProps {
  taskType: TaskType
  options?: any[]
  onSubmit?: (answer: any) => void
  canvasImage?: string | null
  getCanvasImage?: () => string | null
}

export default function AnswerSubmission({ 
  taskType, 
  options, 
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

  const handleSubmit = () => {
    // In a real app, this would validate against the correct answer
    // For demo purposes, we'll just simulate a correct answer
    setSubmitted(true)

    let answer
    let isCorrect = false

    switch (taskType) {
      case "open":
        // Send request to AI
        const capturedImage = getCanvasImage ? getCanvasImage() : canvasImage;
        answer = { image: capturedImage };
        console.log(answer, options)
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

    // Call the onSubmit callback if provided
    if (onSubmit) {
      onSubmit(answer)
    }
  }

  const resetAnswer = () => {
    setSubmitted(false)
    setCorrect(null)
    setSingleChoiceAnswer("")
    setMultipleChoiceAnswers([])
    setFillInAnswers({})
    setTrueFalseAnswers({})
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

  const renderSubmittedAnswer = () => {
    let answerDisplay

    switch (taskType) {
      case "open":
        // answerDisplay = <span className="font-medium">{openAnswer}</span>
        break
      case "fill_in":
        answerDisplay = (
          <div className="space-y-1">
            {options?.map((option, index) => (
              <div key={option.id}>
                Pole {index + 1}: <span className="font-medium">{fillInAnswers[option.id]}</span>
              </div>
            ))}
          </div>
        )
        break
      case "single_choice":
        answerDisplay = <span className="font-medium">{singleChoiceAnswer}</span>
        break
      case "multiple_choice":
        answerDisplay = <span className="font-medium">{multipleChoiceAnswers.join(", ")}</span>
        break
      case "true_false":
        answerDisplay = (
          <div className="space-y-1">
            {options
              ?.sort((a, b) => a.order - b.order)
              .map((option) => (
                <div key={option.id}>
                  {option.statement}:{" "}
                  <span className="font-medium">{trueFalseAnswers[option.id] ? "Prawda" : "Fałsz"}</span>
                </div>
              ))}
          </div>
        )
        break
      default:
        answerDisplay = <span>Nieznana odpowiedź</span>
    }

    return (
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
              <div className="text-sm mt-1">Twoja odpowiedź: {answerDisplay}</div>
              {!correct && (
                <div className="text-sm mt-2">
                  <p>Prawidłowa odpowiedź:</p>
                  {renderCorrectAnswer()}
                </div>
              )}
            </div>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={resetAnswer}>
          Spróbuj ponownie
        </Button>
      </div>
    )
  }

  const renderCorrectAnswer = () => {
    // This would come from the database in a real app
    switch (taskType) {
      case "open":
        return <span className="font-medium">x = -3 lub x = 0.5</span>
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
    <div className="p-4">
      <h3 className="font-medium mb-3">Sprawdź odpowiedź</h3>

      {!submitted ? (
        <>
          {renderAnswerInput()}

          <Button className="w-full mt-4" onClick={handleSubmit} disabled={isSubmitDisabled()}>
            Sprawdź odpowiedź
          </Button>
        </>
      ) : (
        renderSubmittedAnswer()
      )}
    </div>
  )
}

