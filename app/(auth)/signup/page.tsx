import AuthPageWrapper from "@/features/auth/components/AuthPageWrapper";
import SignUpForm from "@/features/auth/components/SignUpForm";

export default function SignupPage() {
  return (
    <AuthPageWrapper title="Create an account" description="Sign up to get started" buttonText="Create Account" footerText="Already" linkText="Log in" href="/login" formId="signup">
      <SignUpForm />
    </AuthPageWrapper>
  )
}
