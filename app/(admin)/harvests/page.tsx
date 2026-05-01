import PageWrapper from "@/components/PageWrapper";
import HarvestDataDetails from "@/features/harvests/components/HarvestDataDetails";
import HarvestStats from "@/features/harvests/components/HarvestStats";
import NoHarvest from "@/features/harvests/components/NoHarvest";

export default function HarvestsPage() {
  return (
    <PageWrapper
      title="Harvests"
      description="Track your harvest records"
      link="/harvest/new"
      buttonText="Add Harvest"
    >
      <div className="space-y-6">
        {false && <NoHarvest />}
        <HarvestStats />
        <HarvestDataDetails />
      </div>
    </PageWrapper>
  );
}
