'use client'

import AuthPageWrapper from "@/features/auth/components/AuthPageWrapper";
import SignUpForm from "@/features/auth/components/SignUpForm";
import { useState } from "react";

export default function SignupPage() {
  const [submitting, setSubmitting] = useState(false)

  return (
    <AuthPageWrapper title="Create an account" description="Sign up to get started" buttonText="Create Account" footerText="Already" linkText="Log in" href="/login" submitting={submitting} formId="signup">
      <SignUpForm setSubmitting={setSubmitting} />
    </AuthPageWrapper>
  )
}

// niklaus.oa@gmail.com
// 12345Kushy