import BackButton from "@/components/BackButton";
import CardWrapper from "@/components/CardWrapper";
import NewCycleForm from "@/features/cycles/components/NewCycleForm";
import { getAvailablePondsForStocking } from "@/features/cycles/data";

export default async function NewCyclePage() {
  const ponds = await getAvailablePondsForStocking();

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton href="/cycles" text="Back to Cycles" />
      <CardWrapper
        title="Start New Production Cycle"
        description="Stock one or more ponds to begin a new cycle"
      >
        {ponds.length === 0 ? (
          <p className="text-muted-foreground">
            No available ponds to stock. All active ponds already have a running
            cycle.
          </p>
        ) : (
          <NewCycleForm ponds={ponds} />
        )}
      </CardWrapper>
    </div>
  );
}
