import { type ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Login } from '@/pages/Login'
import { Signup } from '@/pages/Signup'
import { useAuth } from '@/hooks/useAuth'
import { Dashboard } from '@/pages/Dashboard'
import { Toaster } from "@/components/ui/sonner"
import CollegeDetailsPage from '@/pages/CollegeDetailsPage'
import TasksPage from '@/pages/Tasks'
import { MobileNavBar } from '@/components/MobileNavBar'
import { ThemeProvider } from '@/components/ui/theme-provider'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/login" replace />

  return children
}

export function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <BrowserRouter>
      <div className='pb-20'>
      <Toaster />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/college/:id"
          element={
            <ProtectedRoute>
              <CollegeDetailsPage/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/tasks"
          element={
            <ProtectedRoute>
              <TasksPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      </div>
      <MobileNavBar />
    </BrowserRouter>
    </ThemeProvider>
  )
}

export default App;