"use client";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h1 className="mb-5 text-2xl font-bold">Something went wrong!</h1>
      <Button size="lg" className="px-6" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}
