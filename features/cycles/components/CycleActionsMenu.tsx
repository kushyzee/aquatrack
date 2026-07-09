"use client";

import { useState } from "react";
import { EllipsisVertical, Send } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EndCycleDialog from "./EndCycleDialog";
import AddStockDialog from "./AddStockDialog";
import type { AvailablePond } from "@/features/cycles/data";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CycleActionsMenuProps {
  cycleId: string;
  totalRemaining: number;
  ponds: AvailablePond[];
}

export default function CycleActionsMenu({
  cycleId,
  totalRemaining,
  ponds,
}: CycleActionsMenuProps) {
  const [activeDialog, setActiveDialog] = useState<
    "addStock" | "endCycle" | null
  >(null);

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href={`/cycles/${cycleId}/transfer`}
          className={cn(buttonVariants({ variant: "outline" }))}
        >
          <Send />
          <span className="hidden sm:block">New Transfer</span>
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            className={buttonVariants({ variant: "outline" })}
          >
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setActiveDialog("addStock")}>
              Add Stock
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setActiveDialog("endCycle")}
              variant="destructive"
            >
              End Cycle
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AddStockDialog
        cycleId={cycleId}
        ponds={ponds}
        open={activeDialog === "addStock"}
        onOpenChange={(isOpen) => setActiveDialog(isOpen ? "addStock" : null)}
      />
      <EndCycleDialog
        cycleId={cycleId}
        totalRemaining={totalRemaining}
        open={activeDialog === "endCycle"}
        onOpenChange={(isOpen) => setActiveDialog(isOpen ? "endCycle" : null)}
      />
    </>
  );
}
