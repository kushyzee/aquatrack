import { notFound } from "next/navigation";
import BackButton from "@/components/BackButton";
import CardWrapper from "@/components/CardWrapper";
import {
  getCycleById,
  getFromPondOptionsForCycle,
  getToPondOptionsForCycle,
} from "@/features/cycles/data";
import NewTransferForm from "@/features/cycles/components/NewTransferForm";

interface TransferPageProps {
  params: Promise<{ cycleId: string }>;
}

export default async function NewTransferPage({ params }: TransferPageProps) {
  const { cycleId } = await params;
  const cycle = await getCycleById(cycleId);

  if (!cycle || cycle.status !== "active") {
    notFound();
  }

  const [fromPonds, toPonds] = await Promise.all([
    getFromPondOptionsForCycle(cycleId),
    getToPondOptionsForCycle(cycleId),
  ]);

  return (
    <>
      <BackButton href={`/cycles/${cycleId}`} text="Back to Cycle" />
      <CardWrapper
        title="New Stock Transfer"
        description={`Sort fish between ponds within the ${cycle.species} cycle`}
      >
        <NewTransferForm
          cycleId={cycleId}
          fromPonds={fromPonds}
          toPonds={toPonds}
        />
      </CardWrapper>
    </>
  );
}
