import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  href: string;
  text?: string;
}

export default function BackButton({ href, text }: BackButtonProps) {
  return (
    <Link href={href}>
      <Button variant="ghost" size="sm" className="text-muted-foreground mb-4">
        <ArrowLeft />
        {text ? text : "Back"}
      </Button>
    </Link>
  );
}
