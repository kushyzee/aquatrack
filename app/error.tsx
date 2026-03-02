"use client";

export default function Error() {
  return (
    <div className="flex flex-col items-center justify-center p-5">
      <h1 className="mb-3 text-2xl font-bold">Something went wrong!</h1>
      <p className="text-muted-foreground">Please refresh the page</p>
    </div>
  );
}
