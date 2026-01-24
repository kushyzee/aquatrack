import SignUpForm from "@/components/auth/SignUpForm";
import AuthPageWrapper from "@/components/auth/AuthPageWrapper";

export default function SignupPage() {
  return (
    <AuthPageWrapper title="Create an account" description="Sign up to get started" buttonText="Create Account" footerText="Already" linkText="Log in" href="/login" formId="signup">
      <SignUpForm />
    </AuthPageWrapper>
  )
}
