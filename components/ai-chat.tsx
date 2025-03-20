"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChat } from "@ai-sdk/react"
import { SendIcon } from "lucide-react"
import { TaskType } from "@/database.types"
import ReactMarkdown from "react-markdown"
import remarkMath from "remark-math"
import rehypeKatex from "rehype-katex"
import 'katex/dist/katex.min.css'

interface Problem {
  id: string,
  content: string,
  taskType: TaskType,
  // options: taskDetails ? formatTaskDetails(task.type, taskDetails) : undefined,
}

export default function AiChat({ problem }: { problem: Problem }) {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    initialMessages: [
      {
        id: "1",
        role: "system",
        content: `Jesteś pomocnym asystentem matematycznym, który pomaga uczniom rozwiązywać zadania maturalne z matematyki. 
        Aktualne zadanie: ${problem.content}. 
        Dawaj wskazówki krok po kroku, nie podawaj od razu pełnego rozwiązania.
        Używaj notacji LaTeX do formatowania wzorów matematycznych, np. $x(x - 6) \\leq 7$.`,
      },
    ],
  })

  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="flex flex-col h-full">
      <div className="border-b px-3 py-3.5 bg-gray-50">
        <h2 className="font-medium">Asystent AI</h2>
      </div>

      <ScrollArea className="flex-1 px-4 pt-0">
        <div className="space-y-4">
          <div className="mt-4 p-3 bg-gray-100 rounded-lg">
            <p className="text-sm">Witaj! Jestem twoim asystentem matematycznym. Mogę pomóc Ci z zadaniem:</p>
            <p className="text-sm font-medium mt-1">{problem.content}</p>
            <p className="text-sm mt-2">Jak mogę Ci pomóc? Potrzebujesz wskazówki?</p>
          </div>

          {messages.slice(1).map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.role === "user" ? "bg-blue-600 text-white ml-12" : "bg-gray-100 mr-12"
              }`}
            >
              {message.role === "user" ? (
                <p className="text-sm">{message.content}</p>
              ) : (
                <div className="text-sm prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown 
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              )}
            </div>
          ))}

          {status === 'streaming' && (
            <div className="p-3 bg-gray-100 rounded-lg mr-12">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse"></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-75"></div>
                <div className="h-2 w-2 rounded-full bg-gray-400 animate-pulse delay-150"></div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      <div className="p-4 border-t">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            placeholder="Zadaj pytanie..."
            disabled={status === 'streaming'}
            className="flex-1"
          />
          <Button type="submit" size="icon" disabled={status === 'streaming'}>
            <SendIcon className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

