import AuthPageWrapper from '@/features/auth/components/AuthPageWrapper'
import LoginForm from '@/features/auth/components/LoginForm'

export default function LoginPage() {
  return (
    <AuthPageWrapper title="Welcome to AquaTrack" description="Sign in to manage your fish farm" buttonText="Sign in" footerText="Don't" linkText="Create one" href="/signup" formId="login">
      <LoginForm />
    </AuthPageWrapper>
  )
}
