// theme-provider.tsx
import { createContext, useContext, useEffect, useState } from "react"

type Mode = "light" | "dark" | "system"
type ColorTheme = "default" | "bubblegum" | "claymorphism" | "quantum-rose" | "pastel-dreams"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultMode?: Mode
  defaultColorTheme?: ColorTheme
  storageKeyMode?: string
  storageKeyTheme?: string
}

type ThemeProviderState = {
  mode: Mode
  colorTheme: ColorTheme
  setMode: (mode: Mode) => void
  setColorTheme: (theme: ColorTheme) => void
}

const initialState: ThemeProviderState = {
  mode: "system",
  colorTheme: "default",
  setMode: () => null,
  setColorTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultMode = "system",
  defaultColorTheme = "default",
  storageKeyMode = "app-mode",
  storageKeyTheme = "app-color-theme",
  ...props
}: ThemeProviderProps) {
  const [mode, setMode] = useState<Mode>(
    () => (localStorage.getItem(storageKeyMode) as Mode) || defaultMode
  )
  const [colorTheme, setColorTheme] = useState<ColorTheme>(
    () => (localStorage.getItem(storageKeyTheme) as ColorTheme) || defaultColorTheme
  )

  // Apply changes to HTML root
  useEffect(() => {
    const root = document.documentElement

    // Remove old mode classes
    root.classList.remove("light", "dark")

    // Handle mode
    let activeMode = mode
    if (mode === "system") {
      activeMode = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
    }
    root.classList.add(activeMode)

    // Set data-theme for color palette
    root.setAttribute("data-theme", colorTheme)
  }, [mode, colorTheme])

  const value = {
    mode,
    colorTheme,
    setMode: (m: Mode) => {
      localStorage.setItem(storageKeyMode, m)
      setMode(m)
    },
    setColorTheme: (t: ColorTheme) => {
      localStorage.setItem(storageKeyTheme, t)
      setColorTheme(t)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)
  if (!context)
    throw new Error("useTheme must be used within a ThemeProvider")
  return context
}
