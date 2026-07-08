/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Container } from "lucide-react";

interface PondDetailPageButtonsProps {
  data: any;
  pondId: string;
}

export default function PondDetailPageButtons({
  data,
  pondId,
}: PondDetailPageButtonsProps) {
  const hasActiveCycle = Boolean(data?.cycle_id);
  const hasFish = (data?.current_fish_count ?? 0) > 0;
  const canLog = hasActiveCycle;
  const canHarvest = hasActiveCycle && hasFish;

  const logDisabledReason = !canLog ? "No active cycle" : null;
  const harvestDisabledReason = !hasActiveCycle
    ? "No active cycle"
    : !hasFish
      ? "No fish available"
      : null;
  return (
    <div className="mt-6 mb-7 flex flex-col gap-4">
      <div>
        {canLog ? (
          <Link
            href={`/daily-logs/${pondId}`}
            className={cn(buttonVariants(), "w-full")}
          >
            <Plus data-icon="inline-start" /> Add Today&apos;s Log
          </Link>
        ) : (
          <Button className="w-full" disabled>
            <Plus data-icon="inline-start" /> Add Today&apos;s Log
          </Button>
        )}
        {logDisabledReason && (
          <p className="text-destructive/50 mt-1 text-center text-xs">
            {logDisabledReason}
          </p>
        )}
      </div>

      <div>
        {canHarvest ? (
          <Link
            href={`/harvests/new?pondId=${pondId}`}
            className={cn(buttonVariants({ variant: "outline" }), "w-full")}
          >
            <Container data-icon="inline-start" /> Add Harvest
          </Link>
        ) : (
          <Button className="w-full" variant="outline" disabled>
            <Container data-icon="inline-start" /> Add Harvest
          </Button>
        )}
        {harvestDisabledReason && (
          <p className="text-destructive/50 mt-1 text-center text-xs">
            {harvestDisabledReason}
          </p>
        )}
      </div>
    </div>
  );
}
