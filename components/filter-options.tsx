"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function FilterOptions() {
  const [questionType, setQuestionType] = useState("all")
  const [yearRange, setYearRange] = useState("all")

  return (
    <div className="space-y-6">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="basic" className="text-sm">
            Podstawowe filtry
          </TabsTrigger>
          <TabsTrigger value="advanced" className="text-sm">
            Zaawansowane filtry
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm">
                1
              </span>
              Typ zadania
            </h3>
            <div className="grid grid-cols-3 gap-2">
              <div className="border rounded-lg p-3 cursor-pointer hover:border-violet-500 hover:bg-violet-50 transition-colors flex flex-col items-center justify-center text-center gap-2">
                <div className="h-10 w-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                  </svg>
                </div>
                <span className="font-medium">Wszystkie</span>
              </div>
              <div className="border rounded-lg p-3 cursor-pointer hover:border-violet-500 hover:bg-violet-50 transition-colors flex flex-col items-center justify-center text-center gap-2">
                <div className="h-10 w-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="m8 12 3 3 5-5"></path>
                  </svg>
                </div>
                <span className="font-medium">Zamknięte</span>
              </div>
              <div className="border rounded-lg p-3 cursor-pointer hover:border-violet-500 hover:bg-violet-50 transition-colors flex flex-col items-center justify-center text-center gap-2">
                <div className="h-10 w-10 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22V8"></path>
                    <path d="M5 12H2a10 10 0 0 0 20 0h-3"></path>
                    <path d="M8 5.2A10 10 0 0 1 22 12"></path>
                    <path d="M8 5.2A10 10 0 0 0 2 12"></path>
                    <path d="M12 2v6"></path>
                  </svg>
                </div>
                <span className="font-medium">Otwarte</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm">
                2
              </span>
              Okres
            </h3>
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
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm">
                3
              </span>
              Dodatkowe opcje
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="border rounded-lg p-4 hover:border-violet-500 hover:bg-violet-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <Checkbox id="mock" />
                  <Label htmlFor="mock" className="font-medium">
                    Uwzględnij matury próbne
                  </Label>
                </div>
                <p className="text-gray-500 text-sm mt-2">Zadania z matur próbnych od CKE i wydawnictw</p>
              </div>
              <div className="border rounded-lg p-4 hover:border-violet-500 hover:bg-violet-50 transition-colors">
                <div className="flex items-center space-x-2">
                  <Checkbox id="publishers" />
                  <Label htmlFor="publishers" className="font-medium">
                    Uwzględnij arkusze wydawnictw
                  </Label>
                </div>
                <p className="text-gray-500 text-sm mt-2">Zadania z arkuszy przygotowanych przez wydawnictwa</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-violet-100 text-violet-600 flex items-center justify-center text-sm">
                4
              </span>
              Poziom trudności
            </h3>
            <div className="flex gap-2">
              <div className="flex-1 border rounded-lg p-3 cursor-pointer hover:border-violet-500 hover:bg-violet-50 transition-colors flex items-center justify-center text-center">
                <span className="font-medium">Łatwe</span>
              </div>
              <div className="flex-1 border rounded-lg p-3 cursor-pointer hover:border-violet-500 hover:bg-violet-50 transition-colors flex items-center justify-center text-center">
                <span className="font-medium">Średnie</span>
              </div>
              <div className="flex-1 border rounded-lg p-3 cursor-pointer hover:border-violet-500 hover:bg-violet-50 transition-colors flex items-center justify-center text-center">
                <span className="font-medium">Trudne</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

