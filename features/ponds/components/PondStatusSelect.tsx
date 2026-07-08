"use client";

import { useState, useTransition } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { updatePondStatusAction } from "../action";
import { PondStatus } from "@/lib/types";

interface PondStatusSelectProps {
  pondId: string;
  status: PondStatus;
  currentFishCount: number;
}

const STATUS_OPTIONS: { value: PondStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archived" },
];

export default function PondStatusSelect({
  pondId,
  status,
  currentFishCount,
}: PondStatusSelectProps) {
  const [isPending, startTransition] = useTransition();
  const [confirmStatus, setConfirmStatus] = useState<PondStatus | null>(null);
  const hasFish = currentFishCount > 0;

  const applyStatus = (newStatus: PondStatus) => {
    startTransition(async () => {
      const result = await updatePondStatusAction({
        pondId,
        status: newStatus,
      });

      if (result?.error) {
        toast.error(result.error);
        return;
      }

      toast.success(`Pond marked ${newStatus}.`);
    });
  };

  const handleChange = (value: string) => {
    const newStatus = value as PondStatus;
    if (newStatus === status) return;

    if (newStatus === "archived") {
      setConfirmStatus(newStatus);
      return;
    }

    applyStatus(newStatus);
  };

  return (
    <>
      <Select
        value={status}
        onValueChange={(val) => handleChange(val as PondStatus)}
        disabled={isPending}
        items={STATUS_OPTIONS}
      >
        <SelectTrigger className="w-fit" aria-label="Pond status">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-w-[200px] min-w-[180px] overscroll-auto">
          {STATUS_OPTIONS.map((option) => {
            const disabled =
              hasFish && option.value !== "active" && option.value !== status;
            return (
              <SelectItem
                key={option.value}
                value={option.value}
                disabled={disabled}
                className={
                  disabled
                    ? "text-muted-foreground cursor-not-allowed opacity-60"
                    : undefined
                }
              >
                {option.label}
                {disabled ? " - has active fish" : ""}
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>

      <AlertDialog
        open={confirmStatus !== null}
        onOpenChange={(open) => !open && setConfirmStatus(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive this pond?</AlertDialogTitle>
            <AlertDialogDescription>
              Archived ponds are hidden from active use but not deleted. You can
              still view their full history, and this can be reversed later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmStatus(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (confirmStatus) applyStatus(confirmStatus);
                setConfirmStatus(null);
              }}
            >
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
