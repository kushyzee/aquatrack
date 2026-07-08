import BackButton from "@/components/BackButton";
import CardWrapper from "@/components/CardWrapper";
import NewHarvestForm from "@/features/harvests/components/NewHarvestForm";
import { getPondsWithCycleStatus } from "@/features/ponds/data";

export default async function NewHarvestPage({
  searchParams,
}: {
  searchParams: Promise<{ pondId?: string }>;
}) {
  const { pondId } = await searchParams;
  const ponds = await getPondsWithCycleStatus();

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton href="/harvests" />
      <CardWrapper
        title="Record Harvest"
        description="Log a new harvest event for one of your ponds"
      >
        <NewHarvestForm ponds={ponds} preselectedPondId={pondId} />
      </CardWrapper>
    </div>
  );
}
