"use client"

import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { LogOut, User, LogIn, UserPlus } from "lucide-react"
import { useSidebar } from "@/components/ui/sidebar"

export function UserNav() {
  const { user, signOut, isLoading } = useAuth()
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  if (isLoading) {
    return (
      <div className="flex justify-center">
        <div className="h-10 w-10 animate-pulse rounded-full bg-gray-200"></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col gap-2">
        <Button
          variant={isCollapsed ? "ghost" : 'outline'}
          size={isCollapsed ? "icon" : undefined}
          asChild
          className={`w-full ${isCollapsed ? "" : "justify-center"}`}
          title="Zaloguj się"
        >
          <Link href="/zaloguj">
            {isCollapsed ? (
              <LogIn className="h-5 w-5" />
            ) : (
              "Zaloguj się"
            )}
          </Link>
        </Button>
        <Button
          variant={isCollapsed ? "ghost" : "default"}
          size={isCollapsed ? "icon" : undefined}
          asChild
          className={`w-full ${isCollapsed ? "" : "justify-center"}`}
          title="Zarejestruj się"
        >
          <Link href="/zarejestruj">
            {isCollapsed ? (
              <UserPlus className="h-5 w-5" />
            ) : (
              "Zarejestruj się"
            )}
          </Link>
        </Button>
      </div>
    )
  }

  // Get user's name from metadata or email
  const userName = user.user_metadata?.full_name || user.email || ""

  const initials = userName
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {isCollapsed ? (
          <Button variant="ghost" size="icon" className="w-full flex items-center justify-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        ) : (
          <Button variant="ghost" className="w-full flex items-center justify-start gap-2 px-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium truncate">{userName}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <User className="mr-2 h-4 w-4" />
          <span>Profil</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => signOut()}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Wyloguj się</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

