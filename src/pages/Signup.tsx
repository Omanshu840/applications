import { Link } from 'react-router-dom'
import { SignupForm } from '@/components/auth/SignupForm'
import {
  GlassCard,
  GlassCardHeader,
  GlassCardTitle,
  GlassCardContent,
  GlassCardFooter,
} from '@/components/ui/glass-card'

export function Signup() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <GlassCard className="w-full max-w-md">
        <GlassCardHeader className="text-center">
          <GlassCardTitle className="text-2xl">Create an account</GlassCardTitle>
        </GlassCardHeader>
        <GlassCardContent>
          <SignupForm />
        </GlassCardContent>
        <GlassCardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-medium text-primary hover:underline"
            >
              Sign in
            </Link>
          </p>
        </GlassCardFooter>
      </GlassCard>
    </div>
  )
}