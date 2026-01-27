'use client'

import AuthPageWrapper from '@/features/auth/components/AuthPageWrapper'
import LoginForm from '@/features/auth/components/LoginForm'
import { useState } from 'react'

export default function LoginPage() {
  const [submitting, setSubmitting] = useState(false)

  return (
    <AuthPageWrapper title="Welcome to AquaTrack" description="Sign in to manage your fish farm" buttonText="Sign in" footerText="Don't" linkText="Create one" href="/signup" formId="login" submitting={submitting}>
      <LoginForm setSubmitting={setSubmitting} />
    </AuthPageWrapper>
  )
}
