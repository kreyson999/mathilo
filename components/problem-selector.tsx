"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dice5, BookOpen, Clock } from "lucide-react"
import { useTaskGenerator } from "@/hooks/use-task-generator"
import { TaskType } from "@/database.types"

type ProblemSelectorProps = {}

export default function ProblemSelector({}: ProblemSelectorProps) {
  const [questionType, setQuestionType] = useState<"all" | "open" | "closed">("all")
  const [yearRange, setYearRange] = useState<string>("all")
  const { generateTask, isGenerating: isLoading } = useTaskGenerator()
  const router = useRouter()
  const { user } = useAuth()

  const handleRandomProblem = async () => {
    // Convert questionType to TaskType for the database query
    const taskType: TaskType[] | undefined  =
      questionType === "all"
        ? undefined
        : questionType === "open"
          ? ["open", "fill_in"]
          : ["single_choice", "multiple_choice", "true_false"]

    const drawRecord = await generateTask(taskType)
    if (drawRecord) {
      router.push(`/zadanie/${drawRecord.id}`)
    }
  }

  return (
    <Card className="max-w-3xl mx-auto overflow-hidden border shadow-md">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 border-b">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
            <Dice5 className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Losowanie zadania</h2>
            <p className="text-gray-600">Wybierz filtry i wylosuj zadanie maturalne</p>
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-700">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Typ zadania
            </div>

            <RadioGroup
              defaultValue="all"
              value={questionType}
              onValueChange={(value) => setQuestionType(value as "all" | "open" | "closed")}
              className="grid grid-cols-3 gap-2"
            >
              <div className="relative">
                <RadioGroupItem value="all" id="all" className="absolute opacity-0" />
                <Label
                  htmlFor="all"
                  className={`border rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-colors w-full ${questionType === "all" ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"}`}
                >
                  <span className="font-medium">Wszystkie</span>
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem value="closed" id="closed" className="absolute opacity-0" />
                <Label
                  htmlFor="closed"
                  className={`border rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-colors w-full ${questionType === "closed" ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"}`}
                >
                  <span className="font-medium">Zamknięte</span>
                </Label>
              </div>
              <div className="relative">
                <RadioGroupItem value="open" id="open" className="absolute opacity-0" />
                <Label
                  htmlFor="open"
                  className={`border rounded-lg p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-colors w-full ${questionType === "open" ? "bg-blue-50 border-blue-200" : "hover:bg-gray-50"}`}
                >
                  <span className="font-medium">Otwarte</span>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-gray-700">
              <Clock className="h-5 w-5 text-blue-600" />
              Okres
            </div>

            <Select value={yearRange} onValueChange={setYearRange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Wybierz okres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie lata</SelectItem>
                <SelectItem value="2">Ostatnie 2 lata</SelectItem>
                <SelectItem value="5">Ostatnie 5 lat</SelectItem>
                <SelectItem value="10">Ostatnie 10 lat</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Button className="w-full gap-2 mt-8" size="lg" onClick={handleRandomProblem} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
              Losowanie...
            </>
          ) : (
            <>
              <Dice5 className="h-5 w-5" />
              Losuj zadanie
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

