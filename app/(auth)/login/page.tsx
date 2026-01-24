import AuthPageWrapper from '@/components/auth/AuthPageWrapper'
import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <AuthPageWrapper title="Welcome to AquaTrack" description="Sign in to manage your fish farm" buttonText="Sign in" footerText="Don't" linkText="Create one" href="/signup" formId="login">
      <LoginForm />
    </AuthPageWrapper>
  )
}
