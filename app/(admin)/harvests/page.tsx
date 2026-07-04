import PageWrapper from "@/components/PageWrapper";
import HarvestDataDetails from "@/features/harvests/components/HarvestDataDetails";
import HarvestStats from "@/features/harvests/components/HarvestStats";
import NoHarvest from "@/features/harvests/components/NoHarvest";
import { getHarvestRecords } from "@/features/harvests/data";

export default async function HarvestsPage() {
  const harvests = await getHarvestRecords();

  return (
    <PageWrapper
      title="Harvests"
      description="Track your harvest records"
      link="/harvest/new"
      buttonText="Add Harvest"
    >
      <div className="space-y-6">
        {harvests.length === 0 ? (
          <NoHarvest />
        ) : (
          <>
            <HarvestStats />
            <HarvestDataDetails harvests={harvests} />
          </>
        )}
      </div>
    </PageWrapper>
  );
}
