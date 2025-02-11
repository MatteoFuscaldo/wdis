"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Switch } from "@/components/ui/switch"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2">
      <span className="text-sm">🌞</span>
      <Switch
        checked={theme === "dark"}
        onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
        className="data-[state=checked]:bg-slate-700 data-[state=unchecked]:bg-slate-400"
      />
      <span className="text-sm">🌚</span>
    </div>
  )
} 