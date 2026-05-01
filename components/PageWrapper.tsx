import Link from "next/link";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import React from "react";

interface PageWrapperProps {
  title: string;
  description: string;
  link: string;
  buttonText: string;
  children: React.ReactNode;
}

export default function PageWrapper({
  title,
  description,
  link,
  buttonText,
  children,
}: PageWrapperProps) {
  return (
    <div>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-1 max-w-36 sm:max-w-max">
            {description}
          </p>
        </div>
        <Link href={link}>
          <Button size="lg">
            <Plus /> {buttonText}
          </Button>
        </Link>
      </div>
      {children}
    </div>
  );
}
