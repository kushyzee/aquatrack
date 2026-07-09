"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { endCycleAction } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface EndCycleDialogProps {
  cycleId: string;
  totalRemaining: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EndCycleDialog({
  cycleId,
  totalRemaining,
  open,
  onOpenChange,
}: EndCycleDialogProps) {
  const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleConfirm() {
    startTransition(async () => {
      const result = await endCycleAction({ cycleId, endDate });

      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Cycle ended");
      onOpenChange(false);
      router.refresh();
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>End Production Cycle</DialogTitle>
          <DialogDescription>
            This marks the cycle as completed. This can&apos;t be undone.
          </DialogDescription>
        </DialogHeader>

        {totalRemaining > 0 && (
          <div className="border-destructive/30 bg-destructive/10 text-destructive rounded-md border p-3 text-sm">
            {totalRemaining.toLocaleString()} fish are unaccounted for across
            this cycle&apos;s ponds and will be recorded as loss once closed.
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="end-date">End date</Label>
          <input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            max={new Date().toISOString().slice(0, 10)}
            className="border-input flex h-9 w-full rounded-md border bg-transparent px-3 py-1 text-sm shadow-xs"
          />
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleConfirm} disabled={isPending}>
            {isPending ? "Ending..." : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
