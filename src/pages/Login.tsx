import { Link } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardContent,
  GlassCardFooter,
} from '@/components/ui/glass-card'

export function Login() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <GlassCard className="w-full max-w-md">
        <GlassCardHeader className="text-center">
          <GlassCardTitle className="text-2xl">Welcome back</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <LoginForm />
        </GlassCardContent>
        <GlassCardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link
              to="/signup"
              className="font-medium text-primary hover:underline"
            >
              Sign up
            </Link>
          </p>
        </GlassCardFooter>
      </GlassCard>
    </div>
  )
}