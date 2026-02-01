"use client";

import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  return (
    <div>
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
