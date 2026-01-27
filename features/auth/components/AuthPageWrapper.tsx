import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AuthPageWrapperProps } from "@/lib/types";
import { Spinner } from "@/components/ui/spinner";
import Logo from "@/components/Logo";
export default function AuthPageWrapper({
  title,
  description,
  buttonText,
  footerText,
  linkText,
  href,
  formId,
  submitting,
  children,
}: AuthPageWrapperProps) {
  return (
    <Card className="mx-auto w-full max-w-sm">
      <CardHeader className="flex flex-col items-center">
        <Logo isAuth={true} />
        <CardTitle className="mt-5 text-center text-2xl font-semibold">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex-col gap-2">
        <Button
          size="lg"
          type="submit"
          disabled={submitting}
          form={formId}
          className="w-full"
        >
          {submitting ? (
            <p className="inline-flex items-center gap-2">
              <Spinner /> Loading...
            </p>
          ) : (
            buttonText
          )}
        </Button>
        <p className="text-muted-foreground">
          {`${footerText} have an account?`}{" "}
          <Link className="text-primary font-semibold" href={href}>
            {linkText}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
