"use client"

import ProblemSelector from "@/components/problem-selector"
import ExamSets from "@/components/exam-sets"
import { SidebarTrigger } from "@/components/ui/sidebar"

export default function Home() {
  return (
    <div className="p-6">
      <div className="flex items-center mb-4">
        <SidebarTrigger className="mr-2" />
      </div>
      <div className="max-w-6xl mx-auto">
        <ProblemSelector />

        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Pełne arkusze egzaminacyjne</h2>
          <ExamSets />
        </div>
      </div>
    </div>
  )
}

