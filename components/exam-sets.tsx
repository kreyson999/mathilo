"use client"

import { Card, CardContent } from "@/components/ui/card"
import { FileText, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ExamSets() {
  const examSets = [
    { id: "1", title: "Matura 2024 - Maj", type: "Poziom podstawowy", items: 34 },
    { id: "2", title: "Matura 2024 - Maj", type: "Poziom rozszerzony", items: 15 },
    { id: "3", title: "Matura 2023 - Maj", type: "Poziom podstawowy", items: 34 },
    { id: "4", title: "Matura 2023 - Maj", type: "Poziom rozszerzony", items: 15 },
    { id: "5", title: "Matura 2022 - Maj", type: "Poziom podstawowy", items: 34 },
    { id: "6", title: "Matura 2022 - Maj", type: "Poziom rozszerzony", items: 15 },
    { id: "7", title: "Matura próbna Operon 2024", type: "Poziom podstawowy", items: 34 },
    { id: "8", title: "Matura próbna Operon 2024", type: "Poziom rozszerzony", items: 15 },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {examSets.map((exam) => (
        <Card key={exam.id} className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex gap-3 items-start">
              <div className="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0">
                <FileText className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium">{exam.title}</h3>
                <p className="text-sm text-gray-500">{exam.type}</p>
                <p className="text-xs text-gray-400 mt-1">{exam.items} zadań</p>

                <Button variant="ghost" size="sm" className="mt-2 w-full justify-between">
                  Otwórz arkusz <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

