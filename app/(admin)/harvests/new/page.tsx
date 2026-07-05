import BackButton from "@/components/BackButton";
import CardWrapper from "@/components/CardWrapper";
import NewHarvestForm from "@/features/harvests/components/NewHarvestForm";
import { getActivePondsWithStock } from "@/features/harvests/data";

export default async function NewHarvestPage() {
  const ponds = await getActivePondsWithStock();

  return (
    <div className="mx-auto max-w-2xl">
      <BackButton href="/harvests" />
      <CardWrapper
        title="Record Harvest"
        description="Log a new harvest event for one of your ponds"
      >
        <NewHarvestForm ponds={ponds} />
      </CardWrapper>
    </div>
  );
}
