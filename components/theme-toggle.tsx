"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="hover:bg-muted">
        <Sun className="h-5 w-5 text-muted-foreground" />
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="hover:bg-muted"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? (
        <Sun className="h-5 w-5 text-muted-foreground transition-transform hover:text-primary" />
      ) : (
        <Moon className="h-5 w-5 text-muted-foreground transition-transform hover:text-primary" />
      )}
      <span className="sr-only">Cambiar tema</span>
    </Button>
  )
}
