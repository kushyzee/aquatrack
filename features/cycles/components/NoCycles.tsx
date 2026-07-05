"use client";

import Link from "next/link";
import { Waves } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NoCycles() {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
      <Waves className="text-muted-foreground mb-4 h-10 w-10" />
      <h3 className="text-lg font-semibold">No production cycles yet</h3>
      <p className="text-muted-foreground mt-1 max-w-sm text-sm">
        Start your first cycle to begin tracking stocking, growth, and harvests
        across your ponds.
      </p>
      <Link href="/cycles/new" className={cn(buttonVariants(), "mt-4")}>
        New Cycle
      </Link>
    </div>
  );
}
