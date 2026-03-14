import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Moon, Sun, Laptop, Palette } from "lucide-react"
import { useTheme } from "@/components/ui/theme-provider"

const colorThemes = [
  { id: "default", label: "Default" },
  { id: "bubblegum", label: "Bubblegum" },
  { id: 'claymorphism', label: 'Claymorphism' },
  { id: 'quantum-rose', label: 'Quantum Rose' },
  { id: 'pastel-dreams', label: 'Pastel Dreams' }
]

export function ThemeSwitcher() {
  const { mode, setMode, colorTheme, setColorTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          {mode === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : mode === "light" ? (
            <Moon className="h-5 w-5" />
          ) : (
            <Laptop className="h-5 w-5" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuLabel>Mode</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => setMode("light")} className={mode === "light" ? "bg-accent" : ""}>
          <Sun className="mr-2 h-4 w-4" /> Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode("dark")} className={mode === "dark" ? "bg-accent" : ""}>
          <Moon className="mr-2 h-4 w-4" /> Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setMode("system")} className={mode === "system" ? "bg-accent" : ""}>
          <Laptop className="mr-2 h-4 w-4" /> System
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuLabel>Theme</DropdownMenuLabel>
        {colorThemes.map((theme) => (
          <DropdownMenuItem
            key={theme.id}
            onClick={() => setColorTheme(theme.id as any)}
            className={colorTheme === theme.id ? "bg-accent" : ""}
          >
            <Palette className="mr-2 h-4 w-4" /> {theme.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
