import Image from "next/image";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import logo from "@/app/icon.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthPageWrapperProps } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";
export default function AuthPageWrapper({ title, description, buttonText, footerText, linkText, href, formId, submitting, children }: AuthPageWrapperProps) {
  return (
    <Card className="max-w-sm w-full mx-auto">
      <CardHeader className="flex flex-col items-center">
        <div className="flex items-center gap-2">
          <Image loading="eager" src={logo} alt="logo" className="w-8 h-8" />
          <h1 className="text-xl font-semibold">AquaTrack</h1>
        </div>
        <CardTitle className="text-2xl text-center font-semibold mt-5">
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
        <Button size="lg" type="submit" disabled={submitting} form={formId} className="w-full">{submitting ? <p className="inline-flex items-center gap-2"><Spinner /> Loading...</p> : buttonText}</Button>
        <p className="text-muted-foreground">{`${footerText} have an account?`} <Link className="text-primary font-semibold" href={href}>{linkText}</Link></p>
      </CardFooter>
    </Card>
  )
}
