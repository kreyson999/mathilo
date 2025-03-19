"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Plus, Minus, Loader2 } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAuth } from "@/components/auth/auth-provider"
import { getUserDrawHistory } from "@/lib/db/draw-history/queries"
import { useTaskGenerator } from "@/hooks/use-task-generator"
import { UserNav } from "@/components/user-nav"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter()
  const pathname = usePathname()
  const { user } = useAuth()
  const [historyItems, setHistoryItems] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { generateTask, isGenerating: isGeneratingTask } = useTaskGenerator()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const handleNewTask = async () => {
    const drawRecord = await generateTask()
    if (drawRecord) {
      router.push(`/zadanie/${drawRecord.id}`)
    }
  }

  useEffect(() => {
    const fetchDrawHistory = async () => {
      if (!user) return

      setIsLoading(true)
      try {
        const history = await getUserDrawHistory(user.id, 20) // Get last 20 items
        setHistoryItems(history)
      } catch (error) {
        console.error("Error fetching draw history:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDrawHistory()
  }, [user])

  // Function to truncate text to a certain length
  const truncateText = (text: string, maxLength = 20) => {
    if (!text.trim()) return ""
    return text.length > maxLength ? text.trim().substring(0, maxLength) + "..." : text.trim()
  }

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      {...props}
    >
      <SidebarHeader>
        <div className="group-data-[collapsible=icon]:pl-0 pl-1.5 group-data-[collapsible=icon]:pr-0 pr-3 pt-3">
          <Link href="/" className={`flex items-center justify-center gap-2`}>
            {isCollapsed ? (
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mathilo-short-wd2i98kiWHectxvgFv8FlPYulsd2Do.png"
                alt="Mathilo Logo"
                className="h-8"
              />
            ) : (
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Mathilo-xcicj8vuuphIWaybnjPpCKVvaD3JeF.png"
                alt="Mathilo Logo"
                className="h-8"
              />
            )}
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <div className={`group-data-[collapsible=icon]:px-1.5 px-3 py-3 border-b`}>
          <Button
            variant={isCollapsed ? "ghost" : "outline"}
            size={isCollapsed ? "icon" : undefined}
            disabled={isGeneratingTask}
            onClick={handleNewTask}
            className={`w-full ${isCollapsed ? "" : "justify-center"}`}
            title={isGeneratingTask ? 'Losowanie...' : 'Nowe zadanie'}
          >
            {isGeneratingTask ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="group-data-[collapsible=icon]:hidden">Losowanie...</span>
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                <span className="group-data-[collapsible=icon]:hidden">Nowe zadanie</span>
              </>
            )}
          </Button>
        </div>

        {/* Only show history when sidebar is expanded */}
        <div className="group-data-[collapsible=icon]:hidden">
          {historyItems.length > 0 && (
            <SidebarGroup>
              <SidebarMenu>
                <Collapsible defaultOpen className="group/collapsible">
                  <SidebarMenuItem>
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton>
                        Historia zadań
                        <Plus className="ml-auto group-data-[state=open]/collapsible:hidden" />
                        <Minus className="ml-auto group-data-[state=closed]/collapsible:hidden" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {isLoading ? (
                          <div className="flex justify-center py-4">
                            <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                          </div>
                        ) : (
                          historyItems.map((item) => (
                            <SidebarMenuSubItem key={item.id}>
                              <SidebarMenuSubButton asChild>
                                <Link href={`/zadanie/${item.id}`}>
                                  <span className="text-sm font-medium">
                                    {item.is_sheet
                                      ? truncateText(item.sheets?.name || "Arkusz")
                                      : truncateText(item.tasks?.content || "Zadanie")}
                                  </span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))
                        )}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </SidebarMenuItem>
                </Collapsible>
              </SidebarMenu>
            </SidebarGroup>
          )}
        </div>
      </SidebarContent>
      <SidebarFooter className="mt-auto border-t pt-2">
        <div className="px-1.5 md:px-3 py-2">
          <UserNav />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

