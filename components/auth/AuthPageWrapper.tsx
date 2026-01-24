import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import logo from "@/app/icon.svg";
import { Button } from "../ui/button";
import Link from "next/link";

interface AuthPageWrapperProps {
  title: string
  description: string
  buttonText: "Create Account" | "Sign in"
  footerText: "Already" | "Don't"
  linkText: "Log in" | "Create one"
  href: "/login" | "/signup"
  formId: "signup" | "login"
  children: React.ReactNode
}

export default function AuthPageWrapper({ title, description, buttonText, footerText, linkText, href, formId, children }: AuthPageWrapperProps) {
  return (
    <Card className="max-w-md mx-auto">
      <CardHeader className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Image loading="eager" src={logo} alt="logo" className="w-8 h-8" />
          <h1 className="text-xl font-semibold">AquaTrack</h1>
        </div>
        <CardTitle className="text-2xl font-semibold mt-5">
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="flex-col gap-2">
        <Button size="lg" type="submit" form={formId} className="w-full">{buttonText}</Button>
        <p className="text-muted-foreground">{`${footerText} have an account?`} <Link className="text-primary font-semibold" href={href}>{linkText}</Link></p>
      </CardFooter>
    </Card>
  )
}
