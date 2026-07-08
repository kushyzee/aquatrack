import BackButton from "@/components/BackButton";
import PondCard from "@/features/ponds/components/PondCard";
import PondDetailPageButtons from "@/features/ponds/components/PondDetailPageButtons";
import PondDetailTab from "@/features/ponds/components/PondDetailTab";
import { getPondStockSummary } from "@/features/ponds/data";
import PondCardStat from "@/features/ponds/PondCardStat";

export default async function PondDetailPage({
  params,
}: {
  params: Promise<{ pondId: string }>;
}) {
  const { pondId } = await params;

  const data = await getPondStockSummary(pondId);

  return (
    <div>
      <BackButton href="/ponds" />
      <PondCard
        name={data?.pond_name || "Unknown Pond"}
        status={data?.status || "inactive"}
        type={data?.type}
        species={data?.species}
        isPondDetailsPage={true}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <PondCardStat
            title="Current Stock"
            value={data?.current_fish_count || 0}
          />
          <PondCardStat
            title="Initial Stock"
            value={data?.initial_fish_count || 0}
          />
          <PondCardStat title="Mortality" value={data?.total_mortality || 0} />
          <PondCardStat title="Harvested" value={data?.total_harvested || 0} />
        </div>
      </PondCard>

      <PondDetailPageButtons data={data} pondId={pondId} />

      <PondDetailTab pondId={pondId} />
    </div>
  );
}
