"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import type { TaskType } from "@/lib/db/tasks/types"
import { saveUserAnswer } from "@/lib/db/task-statuses/queries"
import { UserAnswer } from "@/lib/db/task-statuses/types"
import AnswerResultModal from "./answer-result-modal"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"

interface AnswerSubmissionProps {
  taskId: number | null
  taskStatusId: number
  taskType: TaskType
  options?: any[]
  question: string
  onSubmit?: (answer: any) => void
  getCanvasImage?: () => string | null
}

export default function AnswerSubmission({ 
  taskId,
  taskStatusId,
  taskType, 
  options, 
  question,
  onSubmit, 
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
    setIsLoading(true)
    
    let answer
    let isCorrect = false
    let earnedPoints = 0

    switch (taskType) {
      case "open":
        const capturedImage = getCanvasImage ? getCanvasImage() : null;
        answer = { image: capturedImage };
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
          earnedPoints = result.points || 0;
          setPoints(earnedPoints);
          setReasoning(result.reasoning);
        } catch (error) {
          console.error('Error checking answer:', error);
          isCorrect = false;
        }
        break
      case "fill_in":
        answer = fillInAnswers
        const correctAnswersCount = options?.reduce((count, option) => {
          const isAnswerCorrect = fillInAnswers[option.id]?.toLowerCase() === option.correctAnswer.toLowerCase();
          return isAnswerCorrect ? count + 1 : count;
        }, 0) || 0;
        
        earnedPoints = correctAnswersCount;
        isCorrect = correctAnswersCount === options?.length;
        break
      case "single_choice":
        answer = singleChoiceAnswer
        isCorrect = options?.find((option) => option.value === singleChoiceAnswer)?.isCorrect || false
        earnedPoints = isCorrect ? 1 : 0;
        break
      case "multiple_choice":
        answer = multipleChoiceAnswers
        const correctOptions = options?.filter((option) => option.isCorrect).map((option) => option.value) || []
        const correctSelectedCount = multipleChoiceAnswers.filter(answer => correctOptions.includes(answer)).length
        
        earnedPoints = correctSelectedCount
        
        isCorrect =
          correctOptions.length === multipleChoiceAnswers.length &&
          correctOptions.every((option) => multipleChoiceAnswers.includes(option))
        break
      case "true_false":
        answer = trueFalseAnswers
        const correctTrueFalseCount = options?.reduce((count, option) => {
          return trueFalseAnswers[option.id] === option.isTrue ? count + 1 : count;
        }, 0) || 0;
        
        earnedPoints = correctTrueFalseCount;
        isCorrect = correctTrueFalseCount === options?.length;
        break
      default:
        answer = null
        isCorrect = false
    }

    setCorrect(isCorrect)
    setPoints(earnedPoints)
    setIsLoading(false)
    setSubmitted(true)

    // Save user answer to the database
    try {
      const userAnswer: UserAnswer = {
        taskType,
        answer,
        isCorrect,
        points: earnedPoints,
        reasoning: reasoning ?? undefined
      }
      
      await saveUserAnswer(taskStatusId, userAnswer)
    } catch (error) {
      console.error('Error saving user answer:', error)
    }

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
            {options?.map((option) => (
              <div key={option.id} className="space-y-1">
                <Label htmlFor={`fill-in-${option.id}`}>
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {option.template}
                  </ReactMarkdown>
                  :</Label>
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
              {options?.map((option, index) => (
                <div key={option.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label htmlFor={option.value} className="flex gap-1">
                    {String.fromCharCode(65 + index)}.
                    <ReactMarkdown 
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {option.value}
                    </ReactMarkdown>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )
      case "multiple_choice":
        return (
          <div className="space-y-3">
            <p className="text-sm text-gray-500">Wybierz wszystkie prawidłowe odpowiedzi:</p>
            {options?.map((option, index) => (
              <div key={option.id} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50">
                <Checkbox
                  id={option.value}
                  checked={multipleChoiceAnswers.includes(option.value)}
                  onCheckedChange={() => handleMultipleChoiceChange(option.value)}
                />
                <Label htmlFor={option.value} className="flex gap-1">
                  {String.fromCharCode(65 + index)}.
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {option.value}
                  </ReactMarkdown> 
                </Label>
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
                  <div className="text-sm font-medium">
                    <ReactMarkdown 
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {option.statement}
                    </ReactMarkdown> 
                  </div>
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
        answer={taskType === "open" ? { image: getCanvasImage?.() } : 
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

